"""
Миграция: feedback — колонки published, solution_text, solution_image; таблица partners.
Запуск из папки backend: python -m scripts.migrate_feedback_and_partners
"""
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import text
from app.database import engine
from app.config import settings


def main():
    if "sqlite" not in settings.database_url:
        print("Скрипт поддерживает только SQLite.")
        return

    with engine.connect() as conn:
        # Feedback: добавить колонки, если нет
        r = conn.execute(text("PRAGMA table_info(feedback)"))
        cols = [row[1] for row in r.fetchall()]
        if "published" not in cols:
            conn.execute(text("ALTER TABLE feedback ADD COLUMN published INTEGER DEFAULT 0"))
            conn.commit()
            print("feedback: добавлена колонка published.")
        if "solution_text" not in cols:
            conn.execute(text("ALTER TABLE feedback ADD COLUMN solution_text TEXT DEFAULT ''"))
            conn.commit()
            print("feedback: добавлена колонка solution_text.")
        if "solution_image" not in cols:
            conn.execute(text("ALTER TABLE feedback ADD COLUMN solution_image VARCHAR(500) DEFAULT ''"))
            conn.commit()
            print("feedback: добавлена колонка solution_image.")

        # Partners: создать таблицу, если нет
        r = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='partners'"))
        if r.fetchone() is None:
            conn.execute(text("""
                CREATE TABLE partners (
                    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                    image VARCHAR(500) DEFAULT '',
                    link VARCHAR(500) DEFAULT '',
                    position INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """))
            conn.commit()
            print("Создана таблица partners.")
        else:
            print("Таблица partners уже есть.")

    print("Готово.")


if __name__ == "__main__":
    main()
