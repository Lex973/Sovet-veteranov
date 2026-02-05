"""
Опциональные уведомления в Telegram при добавлении новостей (aiogram).
Настрой TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env для включения.
"""
import asyncio
from .config import settings
from .models import News


def notify_new_news(news: News) -> None:
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        return

    async def send():
        try:
            from aiogram import Bot
            bot = Bot(token=settings.telegram_bot_token)
            text = (
                f"📰 Новая новость на сайте:\n\n"
                f"<b>{news.title}</b>\n\n"
                f"{news.subtitle or news.content[:200]}..."
            )
            await bot.send_message(
                chat_id=settings.telegram_chat_id,
                text=text,
                parse_mode="HTML",
            )
            await bot.session.close()
        except Exception:
            pass  # не ломаем API при ошибке отправки

    try:
        asyncio.run(send())
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(send())
        loop.close()
