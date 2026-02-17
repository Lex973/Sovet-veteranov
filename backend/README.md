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

## Telegram-бот (подписчики для уведомлений)

Из папки **backend** (или из корня проекта):

```bash
python -m bot.main
```

Бот при команде `/start` сохраняет пользователя в таблицу `bot_subscribers`. Список виден в админке. Файл **`.env` должен лежать в папке `backend/`** — и API, и бот читают его оттуда и пишут в одну и ту же БД (`backend/sovet_veteranov.db`).

## Переменные окружения

Скопируй `.env.example` в **`backend/.env`** и при необходимости задай:

- `DATABASE_URL` — подключение к БД (по умолчанию используется `backend/sovet_veteranov.db`).
- `TELEGRAM_BOT_TOKEN` — токен бота для подписчиков и уведомлений (обязателен для бота).
- `TELEGRAM_CHANNEL` — канал для дублирования новостей (например `@sovetveteranov74`). Бот должен быть админом канала. При создании новости пост уходит в канал (длинный текст разбивается на части); при удалении новости в админке пост удаляется и из канала. Ошибки логируются и дублируются админам в Telegram.
- `ADMIN_PASSWORD` — пароль для входа в админ-панель (без него вход в админку вернёт 503).

## Эндпоинты

- **Новости:** `GET/POST /news`, `GET/PATCH/DELETE /news/{id}`
- **Команда:** `GET/POST /team`, `GET/PATCH/DELETE /team/{id}`
- **Районные отделения:** `GET/POST /district-offices`, `GET/PATCH/DELETE /district-offices/{id}`

Дальше можно подключить фронт к этим API вместо статических данных.
