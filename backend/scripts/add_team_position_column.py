"""
Однократная миграция: добавить колонку position в team_members, если её ещё нет.
Существующим записям присваивается position = id (сохраняем текущий порядок).
Запуск из папки backend: python -m scripts.add_team_position_column
"""
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import text
from app.database import engine
from app.config import settings


def main():
    db_path = settings.database_url.replace("sqlite:///", "").split("?")[0]
    print(f"БД: {db_path}")

    with engine.connect() as conn:
        if "sqlite" not in settings.database_url:
            print("Скрипт поддерживает только SQLite.")
            return
        r = conn.execute(text("PRAGMA table_info(team_members)"))
        rows = r.fetchall()
        has_position = any(row[1] == "position" for row in rows)
        if has_position:
            print("Колонка position уже есть.")
            return
        conn.execute(text("ALTER TABLE team_members ADD COLUMN position INTEGER DEFAULT 0"))
        conn.commit()
        conn.execute(text("UPDATE team_members SET position = id WHERE position = 0"))
        conn.commit()
        print("Колонка position добавлена в team_members, существующие записи обновлены.")


if __name__ == "__main__":
    main()
