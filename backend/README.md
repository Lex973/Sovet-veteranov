# Бэкенд — Совет ветеранов

API на **FastAPI** + **SQLAlchemy** (SQLite по умолчанию). Опционально: уведомления в Telegram через **aiogram** при добавлении новостей.

## Установка

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate
pip install -r requirements.txt
```

## Запуск

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Документация API: http://localhost:8000/docs

## Первичное заполнение БД

```bash
python -m scripts.seed_db
```

## Переменные окружения

Скопируй `.env.example` в `.env` и при необходимости задай:

- `DATABASE_URL` — строка подключения к БД (по умолчанию `sqlite:///./sovet_veteranov.db`).
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — для отправки уведомлений о новых новостях в Telegram (необязательно).

## Эндпоинты

- **Новости:** `GET/POST /news`, `GET/PATCH/DELETE /news/{id}`
- **Команда:** `GET/POST /team`, `GET/PATCH/DELETE /team/{id}`
- **Районные отделения:** `GET/POST /district-offices`, `GET/PATCH/DELETE /district-offices/{id}`

Дальше можно подключить фронт к этим API вместо статических данных.
