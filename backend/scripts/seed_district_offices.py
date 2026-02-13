"""
Подставить актуальный список районных отделений (главный офис + 7 районов).
Заменяет все текущие записи в district_offices на этот список.
Запуск из папки backend: python -m scripts.seed_district_offices
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal
from app.models import DistrictOffice

DATA = [
    {
        "name": "Челябинский городской Совет ветеранов",
        "address": "г. Челябинск, пл. Революции, дом 2, к. 510",
        "phone": "8 (351) 266-62-88",
        "email": "veteranov41@mail.ru",
        "description": "Сайт: советветеранов.рф",
    },
    {"name": "Калининский Совет ветеранов", "address": "ул. Кирова, 10", "phone": "791-65-91", "email": "kalinsovetvet@yandex.ru", "description": ""},
    {"name": "Курчатовский Совет ветеранов", "address": "ул. Ворошилова, 31-71", "phone": "793-02-33", "email": "veteranu7474@mail.ru", "description": ""},
    {"name": "Ленинский Совет ветеранов", "address": "ул. Гагарина, 23", "phone": "256-24-05", "email": "veteranlen@mail.ru", "description": ""},
    {"name": "Металлургический Совет ветеранов", "address": "ул. Б. Хмельницкого, 6", "phone": "723-09-08", "email": "rsvmetall@mail.ru", "description": ""},
    {"name": "Советский Совет ветеранов", "address": "ул. Цвиллинга, 58", "phone": "237-06-98", "email": "sovetveteran97@mail.ru", "description": ""},
    {"name": "Тракторозаводский Совет ветеранов", "address": "ул. 1-ой Пятилетки, 43", "phone": "775-34-05", "email": "tzrsv@yandex.ru", "description": ""},
    {"name": "Центральный Совет ветеранов", "address": "ул. Коммуны, 135", "phone": "225-41-31", "email": "sovetveteranov74a@yandex.ru", "description": ""},
]


def main():
    db = SessionLocal()
    try:
        db.query(DistrictOffice).delete()
        for item in DATA:
            db.add(DistrictOffice(**item))
        db.commit()
        print(f"Записано районных отделений: {len(DATA)} (главный офис + 7 районов).")
    finally:
        db.close()


if __name__ == "__main__":
    main()
