"""
Telegram-бот для Совета ветеранов.

- При /start новый пользователь создаётся с is_active=False.
  Всем активным админам приходит сообщение с кнопкой «Подтвердить».
- Активные подписчики (админы) могут выкладывать новости из бота: кнопка
  «Выложить новость на сайт» → первая строка = заголовок, остальное = текст,
  до 10 фото, дата и хэштеги (#) подставляются автоматически.

Запуск из папки backend:
    python -m bot.main

В .env: TELEGRAM_BOT_TOKEN=... , опционально SITE_URL=..., API_BASE_URL=...
"""

import asyncio
import re
from datetime import date
import httpx
from aiogram import Bot, Dispatcher, F
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import (
    CallbackQuery,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Message,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    KeyboardButton,
)

from app.config import settings
from app.database import SessionLocal, Base, engine
from app.models import BotSubscriber


def log(msg: str) -> None:
    print(f"[bot] {msg}", flush=True)


def ensure_tables():
    Base.metadata.create_all(bind=engine)
    log("Таблицы БД проверены/созданы.")


def _admin_link():
    base = (settings.site_url or "").rstrip("/")
    return f"{base}/admin" if base else ""


def _site_news_link():
    base = (settings.site_url or "").rstrip("/")
    return f"{base}#news" if base else ""


def _is_active_subscriber(chat_id: str) -> bool:
    db = SessionLocal()
    try:
        sub = db.query(BotSubscriber).filter(BotSubscriber.chat_id == chat_id).first()
        return sub is not None and sub.is_active
    finally:
        db.close()


def _reply_keyboard_post_news():
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="Выложить новость на сайт")],
        ],
        resize_keyboard=True,
    )


def _reply_keyboard_cancel():
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="Отменить")],
        ],
        resize_keyboard=True,
    )


# --- FSM для публикации новости ---
class PostNewsStates(StatesGroup):
    waiting_content = State()


# Буфер для медиа-групп: media_group_id -> list of Message
_media_group_buffers: dict[str, list[Message]] = {}
_media_group_tasks: dict[str, asyncio.Task] = {}


def _parse_hashtags(text: str) -> str:
    """Извлечь хэштеги из текста (например #Спорт #Культура -> «#Спорт, #Культура»)."""
    if not text:
        return ""
    tags = re.findall(r"#[\w\u0400-\u04FF]+", text)
    return ", ".join(dict.fromkeys(tags)) if tags else ""


def _text_to_html(text: str) -> str:
    """Преобразовать обычный текст в простой HTML (абзацы)."""
    if not text or not text.strip():
        return ""
    parts = [p.strip() for p in text.strip().split("\n\n") if p.strip()]
    return "".join(f"<p>{p.replace(chr(10), '<br/>')}</p>" for p in parts)


async def _download_telegram_photo(bot: Bot, file_id: str) -> bytes | None:
    try:
        file = await bot.get_file(file_id)
        data = await bot.download_file(file.file_path)
        return data.read() if hasattr(data, "read") else data
    except Exception as e:
        log(f"Ошибка загрузки фото из Telegram: {e}")
        return None


async def _upload_photo_to_backend(bytes_data: bytes, filename: str = "photo.jpg") -> str | None:
    """Загрузить фото на бэкенд, вернуть URL (например /media/uploads/xxx.jpg) или None."""
    api_base = (settings.api_base_url or "").rstrip("/")
    if not api_base:
        log("API_BASE_URL не задан")
        return None
    url = f"{api_base}/files/images"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(
                url,
                files={"file": (filename, bytes_data, "image/jpeg")},
            )
            r.raise_for_status()
            data = r.json()
            return data.get("url") or None
    except Exception as e:
        log(f"Ошибка загрузки фото на бэкенд: {e}")
        return None


async def _create_news_on_backend(
    title: str,
    content_html: str,
    image: str,
    images: list[str],
    hashtag: str,
) -> dict | None:
    api_base = (settings.api_base_url or "").rstrip("/")
    if not api_base:
        return None
    today = date.today().isoformat()
    payload = {
        "title": title,
        "subtitle": "",
        "image": image,
        "images": images,
        "content": content_html,
        "date": today,
        "hashtag": hashtag,
    }
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.post(f"{api_base}/news", json=payload)
            r.raise_for_status()
            return r.json()
    except Exception as e:
        log(f"Ошибка создания новости на бэкенде: {e}")
        return None


async def _process_news_content(bot: Bot, message: Message, state: FSMContext, text: str, photo_file_ids: list[str]):
    """Парсинг текста, загрузка фото, создание новости, ответ пользователю."""
    await message.answer("Обрабатываю новость…")
    lines = (text or "").strip().split("\n")
    title = (lines[0].strip() or "Без заголовка")[:500]
    rest_text = "\n".join(lines[1:]).strip() if len(lines) > 1 else ""
    content_html = _text_to_html(rest_text) or "<p></p>"
    hashtag = _parse_hashtags(text)

    image_url = ""
    images_list: list[str] = []
    for i, file_id in enumerate(photo_file_ids[:10]):
        data = await _download_telegram_photo(bot, file_id)
        if not data:
            continue
        ext = ".jpg"
        url = await _upload_photo_to_backend(data, f"photo{i}{ext}")
        if url:
            if not image_url:
                image_url = url
            images_list.append(url)

    news = await _create_news_on_backend(title, content_html, image_url, images_list, hashtag)
    await state.clear()

    if not news:
        await message.answer(
            "Не удалось добавить новость на сайт. Проверьте, что бэкенд запущен и доступен.",
            reply_markup=_reply_keyboard_post_news(),
        )
        return

    site_link = _site_news_link()
    admin_link = _admin_link()
    reply = (
        "✅ Новость успешно добавлена на сайт.\n\n"
        f"Проверить на сайте: {site_link}\n\n"
    )
    if admin_link:
        reply += f"Редактировать в админке: {admin_link}"
    await message.answer(reply, reply_markup=_reply_keyboard_post_news())


async def _handle_media_group_after_delay(bot: Bot, media_group_id: str, state: FSMContext):
    await asyncio.sleep(2.0)
    messages = _media_group_buffers.pop(media_group_id, None)
    _media_group_tasks.pop(media_group_id, None)
    if not messages or not bot:
        return
    first = messages[0]
    text = first.caption or ""
    photo_file_ids = []
    for m in messages:
        if m.photo:
            photo_file_ids.append(m.photo[-1].file_id)
    await _process_news_content(bot, first, state, text, photo_file_ids)


async def notify_admins_new_subscriber(bot: Bot, sub: BotSubscriber):
    db = SessionLocal()
    try:
        admins = (
            db.query(BotSubscriber)
            .filter(BotSubscriber.is_active.is_(True))
            .all()
        )
    finally:
        db.close()

    link = _admin_link()
    text = (
        "👤 Новый пользователь подписался на бота:\n\n"
        f"<b>{sub.name or 'Без имени'}</b>\n"
        f"chat_id: <code>{sub.chat_id}</code>\n\n"
        "После подтверждения он будет получать уведомления.\n"
    )
    if link:
        text += f"Удалить подписчика можно в админ-панели: {link}"

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="Подтвердить", callback_data=f"confirm:{sub.id}")]
    ])

    for a in admins:
        if not a.chat_id:
            continue
        try:
            await bot.send_message(
                chat_id=a.chat_id,
                text=text,
                parse_mode="HTML",
                reply_markup=keyboard,
            )
        except Exception as e:
            log(f"Не удалось отправить админу {a.chat_id}: {e}")


async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    chat_id = str(message.chat.id)
    name = (message.from_user.full_name or "").strip()
    db = SessionLocal()
    sub = None
    try:
        sub = db.query(BotSubscriber).filter(BotSubscriber.chat_id == chat_id).first()
        if sub:
            sub.name = name or sub.name
            db.commit()
            if sub.is_active:
                log(f"Подписчик обновлён (уже активен): chat_id={chat_id}")
                await message.answer(
                    "Вы подписаны на уведомления Совета ветеранов.\n"
                    "Администратор может отключить уведомления в админ-панели сайта.",
                    reply_markup=_reply_keyboard_post_news(),
                )
                return
            else:
                log(f"Подписчик обновлён (ожидает подтверждения): chat_id={chat_id}")
                await message.answer(
                    "Ожидайте подтверждения администратором. "
                    "После подтверждения вы будете получать уведомления о новостях и обращениях."
                )
                return

        sub = BotSubscriber(chat_id=chat_id, name=name, is_active=False)
        db.add(sub)
        db.commit()
        db.refresh(sub)
        log(f"Новый подписчик (ожидает подтверждения): id={sub.id}, chat_id={chat_id}, name={name!r}")

        await message.answer(
            "Вы запросили подписку на уведомления Совета ветеранов.\n"
            "Ожидайте подтверждения администратором."
        )

        await notify_admins_new_subscriber(message.bot, sub)
    except Exception as e:
        db.rollback()
        log(f"Ошибка при сохранении подписчика: {e}")
        await message.answer("Произошла ошибка. Попробуйте позже.")
    finally:
        db.close()


async def cmd_post_news_start(message: Message, state: FSMContext):
    """Кнопка «Выложить новость на сайт» — только для активных подписчиков."""
    chat_id = str(message.chat.id)
    if not _is_active_subscriber(chat_id):
        await message.answer("Эта функция доступна только подтверждённым подписчикам (админам).")
        return
    await state.set_state(PostNewsStates.waiting_content)
    await message.answer(
        "Отправьте новость одним сообщением:\n\n"
        "• Первая строка — заголовок новости.\n"
        "• Далее — текст новости (можно с хэштегами, например #Спорт).\n"
        "• Можно приложить до 10 фото (одним или альбомом).\n\n"
        "Дата подставится текущая. Редактировать потом можно в админке.\n\n"
        "Чтобы отменить — нажмите кнопку «Отменить».",
        reply_markup=_reply_keyboard_cancel(),
    )


async def cmd_post_news_cancel(message: Message, state: FSMContext):
    """Кнопка «Отменить» при ожидании новости."""
    await state.clear()
    chat_id = str(message.chat.id)
    await message.answer("Действие отменено.", reply_markup=ReplyKeyboardRemove())
    if _is_active_subscriber(chat_id):
        await message.answer("Клавиатура восстановлена.", reply_markup=_reply_keyboard_post_news())


async def cmd_post_news_content(message: Message, state: FSMContext):
    """Обработка присланной новости (текст и/или фото)."""
    text_pre = (message.caption or message.text or "").strip()
    if text_pre and "выложить новость" in text_pre.lower():
        await message.answer("Сначала завершите текущую новость или нажмите «Отменить».", reply_markup=_reply_keyboard_cancel())
        return
    if message.media_group_id:
        # Медиа-группа: собираем все сообщения группы
        mgid = message.media_group_id
        if mgid not in _media_group_buffers:
            _media_group_buffers[mgid] = []
            t = asyncio.create_task(_handle_media_group_after_delay(message.bot, mgid, state))
            _media_group_tasks[mgid] = t
        _media_group_buffers[mgid].append(message)
        return

    text = message.caption or message.text or ""
    photo_file_ids = []
    if message.photo:
        photo_file_ids.append(message.photo[-1].file_id)

    await _process_news_content(message.bot, message, state, text, photo_file_ids)


async def callback_confirm(callback: CallbackQuery):
    if not callback.data or not callback.data.startswith("confirm:"):
        return
    try:
        sub_id = int(callback.data.split(":")[1])
    except (IndexError, ValueError):
        await callback.answer("Ошибка")
        return

    db = SessionLocal()
    try:
        sub = db.query(BotSubscriber).filter(BotSubscriber.id == sub_id).first()
        if not sub:
            await callback.answer("Подписчик не найден")
            return

        if sub.is_active:
            await callback.answer("Уже подтверждён")
            link = _admin_link()
            new_text = f"Пользователь <b>{sub.name or 'Без имени'}</b> уже был добавлен в рассылку ранее.\n"
            if link:
                new_text += f"Удалить можно в админке: {link}"
            try:
                await callback.message.edit_text(new_text, parse_mode="HTML")
            except Exception:
                pass
            return

        sub.is_active = True
        db.commit()
        sub_name = sub.name or "Без имени"
        log(f"Подписчик id={sub.id} ({sub_name}) подтверждён")
    finally:
        db.close()

    await callback.answer("Подтверждено")
    link = _admin_link()
    done_text = f"Пользователь <b>{sub_name}</b> добавлен в рассылку.\n"
    if link:
        done_text += f"Удалить можно в админке: {link}"
    try:
        await callback.message.edit_text(done_text, parse_mode="HTML")
    except Exception:
        pass

    db = SessionLocal()
    try:
        admins = db.query(BotSubscriber).filter(BotSubscriber.is_active.is_(True)).all()
    finally:
        db.close()

    confirm_chat_id = str(callback.message.chat.id)
    other_text = f"Пользователь <b>{sub_name}</b> добавлен в рассылку (подтвердил другой администратор).\n"
    if link:
        other_text += f"Удалить можно в админке: {link}"
    for a in admins:
        if not a.chat_id or a.chat_id == confirm_chat_id:
            continue
        try:
            await callback.bot.send_message(chat_id=a.chat_id, text=other_text, parse_mode="HTML")
        except Exception as e:
            log(f"Не удалось отправить админу {a.chat_id}: {e}")


async def main():
    if not settings.telegram_bot_token:
        log("TELEGRAM_BOT_TOKEN не задан в backend/.env")
        raise RuntimeError("TELEGRAM_BOT_TOKEN не задан в .env")

    db_path = settings.database_url.replace("sqlite:///", "").split("?")[0]
    log(f"БД: {db_path}")

    ensure_tables()
    storage = MemoryStorage()
    bot = Bot(token=settings.telegram_bot_token)
    dp = Dispatcher(storage=storage)

    dp.message.register(cmd_start, CommandStart())
    dp.message.register(
        cmd_post_news_cancel,
        PostNewsStates.waiting_content,
        F.text.func(lambda t: t and t.strip().lower() == "отменить"),
    )
    dp.message.register(
        cmd_post_news_start,
        F.text.func(lambda t: t and "выложить новость" in (t or "").lower()),
    )
    dp.message.register(cmd_post_news_content, PostNewsStates.waiting_content, F.photo | F.text)
    dp.callback_query.register(callback_confirm, lambda c: c.data and c.data.startswith("confirm:"))

    log("Бот запущен. Отправьте /start в Telegram.")

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
