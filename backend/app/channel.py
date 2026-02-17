"""
Публикация новостей в Telegram-канал и удаление при удалении в админке.
Подробное логирование и уведомление админов об ошибках.
"""
import asyncio
import logging
import re
from html import unescape

from .config import settings
from .database import SessionLocal
from .models import News, BotSubscriber, NewsChannelMessage

logger = logging.getLogger("channel")
if not logger.handlers:
    h = logging.StreamHandler()
    h.setFormatter(logging.Formatter("[channel] %(levelname)s %(message)s"))
    logger.addHandler(h)
logger.setLevel(logging.DEBUG)

# Лимит символов в одном сообщении Telegram (оставляем запас)
TG_MESSAGE_MAX_LENGTH = 4000
# Лимит подписи к фото в Telegram
TG_CAPTION_MAX_LENGTH = 1024


def _get_plain_text(html: str) -> str:
    """Преобразование HTML в простой текст для Telegram."""
    if not html:
        return ""
    text = re.sub(r"<br\s*/?>", "\n", html, flags=re.IGNORECASE)
    text = re.sub(r"</p>\s*<p>", "\n\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", "", text)
    return unescape(text).strip()


def _split_text(text: str, max_len: int = TG_MESSAGE_MAX_LENGTH) -> list[str]:
    """Разбить текст на части не длиннее max_len, по границам абзацев/строк."""
    if not text or len(text) <= max_len:
        return [text] if text else []
    chunks = []
    rest = text
    while rest:
        if len(rest) <= max_len:
            chunks.append(rest)
            break
        part = rest[:max_len]
        last_br = part.rfind("\n")
        if last_br > max_len // 2:
            part = part[: last_br + 1]
            rest = rest[last_br + 1 :].lstrip("\n")
        else:
            rest = rest[max_len:]
        chunks.append(part.rstrip())
    return chunks


def _run_async(coro):
    try:
        asyncio.run(coro)
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(coro)
        loop.close()


def _get_active_admin_chat_ids() -> list[str]:
    db = SessionLocal()
    try:
        rows = (
            db.query(BotSubscriber)
            .filter(BotSubscriber.is_active.is_(True))
            .all()
        )
        return [r.chat_id for r in rows if r.chat_id]
    finally:
        db.close()


async def _notify_admins_error(message: str) -> None:
    """Отправить уведомление об ошибке всем активным админам."""
    if not settings.telegram_bot_token:
        return
    chat_ids = _get_active_admin_chat_ids()
    if not chat_ids:
        return
    from aiogram import Bot
    bot = Bot(token=settings.telegram_bot_token)
    text = "⚠️ Ошибка канала Совет ветеранов:\n\n" + message
    try:
        for chat_id in chat_ids:
            try:
                await bot.send_message(chat_id=chat_id, text=text[:4000])
            except Exception as e:
                logger.warning("Не удалось отправить уведомление админу %s: %s", chat_id, e)
    finally:
        await bot.session.close()


def post_news_to_channel(news: News) -> None:
    """
    Опубликовать новость в Telegram-канал. Текст разбивается на части при необходимости.
    Сохраняет message_id каждой части в news_channel_messages для последующего удаления.
    """
    channel = (settings.telegram_channel or "").strip()
    if not channel:
        logger.debug("TELEGRAM_CHANNEL не задан, публикация в канал пропущена")
        return
    if not settings.telegram_bot_token:
        logger.warning("TELEGRAM_BOT_TOKEN не задан, публикация в канал невозможна")
        return

    async def _post() -> None:
        from aiogram import Bot
        bot = Bot(token=settings.telegram_bot_token)
        db = SessionLocal()
        try:
            title = (news.title or "Без заголовка")[:500]
            body_plain = _get_plain_text(news.content or "")
            hashtag = (news.hashtag or "").strip()
            header = f"📰 {title}"
            if hashtag:
                header += f"\n{hashtag}"
            full_text = header + ("\n\n" + body_plain if body_plain else "")
            chunks = _split_text(full_text)
            if not chunks:
                chunks = [header]

            # Все фото новости (до 10): главное + из списка images, без дубликатов
            raw_urls = []
            if news.image:
                raw_urls.append(news.image)
            if getattr(news, "images", None):
                for u in news.images:
                    if u and u not in raw_urls:
                        raw_urls.append(u)
            raw_urls = raw_urls[:10]
            base = (settings.site_url or "").rstrip("/")
            image_urls = []
            for u in raw_urls:
                if u.startswith("http"):
                    image_urls.append(u)
                elif base:
                    image_urls.append(base + "/" + u.lstrip("/"))

            logger.info(
                "Публикация новости id=%s в канал %s, частей текста: %s, фото: %s",
                news.id, channel, len(chunks), len(image_urls),
            )
            message_ids = []
            first_chunk_sent = False

            if image_urls and chunks:
                from aiogram.types import InputMediaPhoto
                caption = chunks[0][:TG_CAPTION_MAX_LENGTH]
                media = []
                for j, url in enumerate(image_urls):
                    media.append(
                        InputMediaPhoto(media=url, caption=caption if j == 0 else None)
                    )
                try:
                    sent = await bot.send_media_group(
                        chat_id=channel,
                        media=media,
                    )
                    for msg in sent:
                        message_ids.append(msg.message_id)
                    first_chunk_sent = True
                    logger.debug("Отправлен альбом из %s фото, message_ids=%s", len(sent), [m.message_id for m in sent])
                except Exception as e:
                    logger.warning("Не удалось отправить альбом в канал, отправляю текстом: %s", e)
                    first_chunk_sent = False

            start = 1 if first_chunk_sent else 0
            for i, chunk in enumerate(chunks[start:], start=start):
                try:
                    msg = await bot.send_message(
                        chat_id=channel,
                        text=chunk,
                        parse_mode=None,
                    )
                    message_ids.append(msg.message_id)
                    logger.debug("Отправлена часть %s, message_id=%s", i + 1, msg.message_id)
                except Exception as e:
                    logger.exception("Ошибка отправки части %s в канал: %s", i + 1, e)
                    await _notify_admins_error(
                        f"Новость id={news.id} «{title[:50]}»: не удалось отправить часть {i + 1} в канал: {e}"
                    )
                    raise

            for mid in message_ids:
                row = NewsChannelMessage(
                    news_id=news.id,
                    channel_chat_id=channel,
                    message_id=mid,
                )
                db.add(row)
            db.commit()
            logger.info("Новость id=%s успешно опубликована в канал, сообщений: %s", news.id, len(message_ids))
        except Exception as e:
            db.rollback()
            logger.exception("Публикация новости id=%s в канал не удалась: %s", news.id, e)
            await _notify_admins_error(f"Новость id={news.id}: публикация в канал не удалась: {e}")
        finally:
            db.close()
            await bot.session.close()

    _run_async(_post())


def delete_news_from_channel(news_id: int) -> None:
    """
    Удалить из канала все сообщения, связанные с новостью.
    """
    channel = (settings.telegram_channel or "").strip()
    if not channel:
        logger.debug("TELEGRAM_CHANNEL не задан, удаление из канала пропущено")
        return
    if not settings.telegram_bot_token:
        logger.warning("TELEGRAM_BOT_TOKEN не задан, удаление из канала невозможно")
        return

    async def _delete() -> None:
        from aiogram import Bot
        bot = Bot(token=settings.telegram_bot_token)
        db = SessionLocal()
        try:
            rows = (
                db.query(NewsChannelMessage)
                .filter(NewsChannelMessage.news_id == news_id)
                .filter(NewsChannelMessage.channel_chat_id == channel)
                .all()
            )
            if not rows:
                logger.debug("Новость id=%s не найдена в записях канала", news_id)
                return
            logger.info("Удаление новости id=%s из канала %s, сообщений: %s", news_id, channel, len(rows))
            for row in rows:
                try:
                    await bot.delete_message(chat_id=channel, message_id=row.message_id)
                    logger.debug("Удалено сообщение message_id=%s", row.message_id)
                except Exception as e:
                    logger.warning("Не удалось удалить сообщение message_id=%s: %s", row.message_id, e)
                    await _notify_admins_error(
                        f"Новость id={news_id}: не удалось удалить сообщение в канале (message_id={row.message_id}): {e}"
                    )
            for row in rows:
                db.delete(row)
            db.commit()
            logger.info("Новость id=%s успешно удалена из канала", news_id)
        except Exception as e:
            db.rollback()
            logger.exception("Удаление новости id=%s из канала не удалось: %s", news_id, e)
            await _notify_admins_error(f"Новость id={news_id}: удаление из канала не удалось: {e}")
        finally:
            db.close()
            await bot.session.close()

    _run_async(_delete())
