"""
Однократная миграция: добавить колонку image в team_members, если её ещё нет.
Запуск из папки backend: python -m scripts.add_team_image_column
"""
import sys
from pathlib import Path

# backend/scripts -> backend
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import text
from app.database import engine
from app.config import settings


def main():
    db_path = settings.database_url.replace("sqlite:///", "").split("?")[0]
    print(f"БД: {db_path}")

    with engine.connect() as conn:
        if "sqlite" in settings.database_url:
            r = conn.execute(text("PRAGMA table_info(team_members)"))
            rows = r.fetchall()
            # sqlite: (cid, name, type, notnull, default_value, pk)
            has_image = any(row[1] == "image" for row in rows)
            if has_image:
                print("Колонка image уже есть.")
                return
            conn.execute(text("ALTER TABLE team_members ADD COLUMN image VARCHAR(500) DEFAULT ''"))
            conn.commit()
            print("Колонка image добавлена в team_members.")
        else:
            print("Скрипт поддерживает только SQLite. Для других СУБД добавьте колонку вручную.")


if __name__ == "__main__":
    main()
