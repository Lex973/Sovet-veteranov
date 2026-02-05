"""
Скрипт первичного заполнения БД данными из фронта (новости, команда).
Запуск из корня backend: python -m scripts.seed_db
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from datetime import date
from app.database import SessionLocal
from app.models import Base, engine, News, TeamMember, DistrictOffice

# Примеры новостей (как на фронте)
NEWS_DATA = [
    {
        "title": "Городской марафон 2024",
        "subtitle": "Параграф, текст прараграфа текст прараграфа текст прараграфа текст прараграфа ",
        "image": "/images/sport-marathon.jpg",
        "content": "Приглашаем всех желающих принять участие в ежегодном городском марафоне. Дистанции: 5км, 10км, 21км. Регистрация открыта до 1 февраля.",
        "date": date(2024, 1, 15),
        "hashtag": "#Спорт",
    },
    {
        "title": "Новый спортивный комплекс",
        "subtitle": "Параграф, текст прараграфа текст прараграфа текст прараграфа текст прараграфа ",
        "image": "/images/sport-complex.jpg",
        "content": "В микрорайоне \"Северный\" завершается строительство современного спортивного комплекса с бассейном и тренажерным залом.",
        "date": date(2024, 1, 14),
        "hashtag": "#Спорт",
    },
    {
        "title": "Зимний фестиваль в центре города",
        "subtitle": "Параграф, текст прараграфа текст прараграфа текст прараграфа текст прараграфа ",
        "image": "/images/winter-festival.jpg",
        "content": "На центральной площади города с 20 по 28 января пройдет зимний фестиваль с горками, катком, горячими напитками и концертной программой.",
        "date": date(2024, 1, 16),
        "hashtag": "#Отдых",
    },
]

TEAM_DATA = [
    {"name": "Иванов Иван Иванович", "description": "Текст параграфа описывающий члена команды текст параграфа описывающий члена команды текст параграфа описывающий члены команды."},
    {"name": "Петров Петр Петрович", "description": "Текст параграфа описывающий члена команды текст параграфа описывающий члена команды текст параграфа описывающий члены команды."},
    {"name": "Сидоров Сидор Сидорович", "description": "Текст параграфа описывающий члена команды текст параграфа описывающий члена команды текст параграфа описывающий члены команды."},
    {"name": "Матвеев Артем Хренов", "description": "Текст параграфа описывающий члена команды текст параграфа описывающий члена команды текст параграфа описывающий члены команды."},
]

DISTRICT_OFFICES_DATA = [
    {"name": "Калининский Совет ветеранов", "address": "ул. Кирова, 10", "phone": "791-65-91", "email": "kalinsovetvet@yandex.ru"},
    {"name": "Курчатовский Совет ветеранов", "address": "ул. Ворошилова, 31-71", "phone": "793-02-33", "email": "veteranu7474@mail.ru"},
    {"name": "Ленинский Совет ветеранов", "address": "ул. Гагарина, 23", "phone": "256-24-05", "email": "veteranlen@mail.ru"},
    {"name": "Металлургический Совет ветеранов", "address": "ул. Б. Хмельницкого", "phone": "723-09-08", "email": "rsvmetall@mail.ru"},
    {"name": "Советский Совет ветеранов", "address": "ул. Цвиллинга, 58", "phone": "237-06-98", "email": "sovetveteran97@mail.ru"},
    {"name": "Тракторозаводский Совет ветеранов", "address": "ул. 1-ой Пятилетки", "phone": "775-34-05", "email": "tzrsv@yandex.ru"},
    {"name": "Центральный Совет ветеранов", "address": "ул. Коммуны, 135", "phone": "225-41-31", "email": "sovetveteranov74a@yandex.ru"},
]


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(News).first() is None:
            for item in NEWS_DATA:
                db.add(News(**item))
            db.commit()
            print("Добавлены новости.")
        else:
            print("Новости уже есть, пропуск.")

        if db.query(TeamMember).first() is None:
            for item in TEAM_DATA:
                db.add(TeamMember(**item))
            db.commit()
            print("Добавлены члены команды.")
        else:
            print("Команда уже есть, пропуск.")

        if db.query(DistrictOffice).first() is None:
            for item in DISTRICT_OFFICES_DATA:
                db.add(DistrictOffice(**item))
            db.commit()
            print("Добавлены районные отделения.")
        else:
            print("Районные отделения уже есть, пропуск.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
