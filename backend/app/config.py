from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str = "sqlite:///./sovet_veteranov.db"
    # Опционально: для уведомлений в Telegram при добавлении новостей
    telegram_bot_token: str | None = None
    telegram_chat_id: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
