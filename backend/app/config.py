from pathlib import Path
from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings

# Папка backend — бот и API всегда используют одну и ту же БД.
_BACKEND_DIR = Path(__file__).resolve().parent.parent
_DB_FILE = _BACKEND_DIR / "sovet_veteranov.db"
_DEFAULT_DB = f"sqlite:///{_DB_FILE.as_posix()}"


class Settings(BaseSettings):
    database_url: str = _DEFAULT_DB
    telegram_bot_token: str | None = None
    telegram_chat_id: str | None = None
    # Канал для дублирования новостей (например @sovetveteranov74 или -100xxxxxxxxxx)
    telegram_channel: str | None = None
    admin_password: str = ""
    # Ссылка на сайт для сообщений в боте (админка = site_url + /admin)
    site_url: str = "https://xn--74-6kchabsba5fehxhsc.xn--p1ai"
    # URL бэкенда для вызовов API из бота (создание новостей, загрузка фото)
    api_base_url: str = "http://127.0.0.1:8000"

    class Config:
        env_file = str(_BACKEND_DIR / ".env")
        env_file_encoding = "utf-8"

    @model_validator(mode="after")
    def _normalize_sqlite_path(self):
        """Относительный путь из .env заменить на абсолютный (одна БД для бота и API)."""
        url = self.database_url.strip()
        if url == "sqlite:///./sovet_veteranov.db" or url.startswith("sqlite:///./"):
            self.database_url = _DEFAULT_DB
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
