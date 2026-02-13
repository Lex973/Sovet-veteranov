"""
Простой Telegram-бот для Совета ветеранов.

Функции:
- При /start сохраняет chat_id пользователя в таблицу bot_subscribers
  (чтобы ему можно было отправлять уведомления из админки/бэкенда).

Запуск из папки backend:
    python -m bot.main

Перед запуском:
- В .env задать TELEGRAM_BOT_TOKEN=...
"""

import asyncio

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import Message

from app.config import settings
from app.database import engine, SessionLocal, Base
from app.models import BotSubscriber


def log(msg: str) -> None:
    print(f"[bot] {msg}", flush=True)


def ensure_tables():
    """Создать таблицы, если их ещё нет (тот же движок, что и у API)."""
    Base.metadata.create_all(bind=engine)
    log("Таблицы БД проверены/созданы.")


async def cmd_start(message: Message):
    """Регистрируем/обновляем подписчика по команде /start."""
    chat_id = str(message.chat.id)
    name = (message.from_user.full_name or "").strip()
    db = SessionLocal()
    try:
        sub = db.query(BotSubscriber).filter(BotSubscriber.chat_id == chat_id).first()
        if sub:
            sub.name = name or sub.name
            sub.is_active = True
            db.commit()
            log(f"Подписчик обновлён: chat_id={chat_id}, name={name!r}")
        else:
            sub = BotSubscriber(chat_id=chat_id, name=name, is_active=True)
            db.add(sub)
            db.commit()
            log(f"Подписчик добавлен: chat_id={chat_id}, name={name!r}")
    except Exception as e:
        db.rollback()
        log(f"Ошибка при сохранении подписчика: {e}")
        raise
    finally:
        db.close()

    await message.answer(
        "Вы подписаны на уведомления Совета ветеранов.\n"
        "Администратор сайта может включить или отключить для вас уведомления в админ-панели."
    )


async def main():
    if not settings.telegram_bot_token:
        log("TELEGRAM_BOT_TOKEN не задан в backend/.env")
        raise RuntimeError("TELEGRAM_BOT_TOKEN не задан в .env (файл backend/.env)")

    # Показываем, какую БД используем (без токена)
    db_path = settings.database_url.replace("sqlite:///", "").split("?")[0]
    log(f"БД: {db_path}")

    ensure_tables()
    bot = Bot(token=settings.telegram_bot_token)
    dp = Dispatcher()

    dp.message.register(cmd_start, CommandStart())
    log("Бот запущен. Отправьте /start в Telegram.")

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())

