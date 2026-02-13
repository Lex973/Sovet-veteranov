"""
Опциональные уведомления в Telegram (aiogram).
Настрой TELEGRAM_BOT_TOKEN в .env и подпишись на бота, чтобы получать уведомления.
"""
import asyncio
from typing import Iterable

from .config import settings
from .database import SessionLocal
from .models import News, Feedback, BotSubscriber


def _get_active_chat_ids() -> list[str]:
    db = SessionLocal()
    try:
        rows: Iterable[BotSubscriber] = (
            db.query(BotSubscriber)
            .filter(BotSubscriber.is_active.is_(True))
            .all()
        )
        return [r.chat_id for r in rows if r.chat_id]
    finally:
        db.close()


def _run_send(coro):
    try:
        asyncio.run(coro)
    except RuntimeError:
        # уже есть цикл событий — создаём временный
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(coro)
        loop.close()


def notify_new_news(news: News) -> None:
    if not settings.telegram_bot_token:
        return

    chat_ids = _get_active_chat_ids()
    if not chat_ids:
        return

    async def send():
        from aiogram import Bot

        bot = Bot(token=settings.telegram_bot_token)
        text = (
            "📰 Новая новость на сайте Совета ветеранов:\n\n"
            f"<b>{news.title}</b>\n\n"
            f"{(news.subtitle or news.content or '')[:200]}..."
        )
        try:
            for chat_id in chat_ids:
                try:
                    await bot.send_message(
                        chat_id=chat_id,
                        text=text,
                        parse_mode="HTML",
                    )
                except Exception:
                    # не ломаем отправку остальным при ошибке
                    continue
        finally:
            await bot.session.close()

    _run_send(send())


def notify_new_feedback(feedback: Feedback) -> None:
    """Уведомление о новом обращении через форму."""
    if not settings.telegram_bot_token:
        return

    chat_ids = _get_active_chat_ids()
    if not chat_ids:
        return

    async def send():
        from aiogram import Bot

        bot = Bot(token=settings.telegram_bot_token)
        text = (
            "📩 Новое обращение на сайте Совета ветеранов:\n\n"
            f"<b>{feedback.full_name}</b>\n"
            f"Телефон: {feedback.phone or '—'}\n"
            f"Email: {feedback.email or '—'}\n\n"
            f"{feedback.question[:500]}"
        )
        try:
            for chat_id in chat_ids:
                try:
                    await bot.send_message(
                        chat_id=chat_id,
                        text=text,
                        parse_mode="HTML",
                    )
                except Exception:
                    continue
        finally:
            await bot.session.close()

    _run_send(send())
