from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database import engine, Base, get_db
from .routers import news, team, district_offices, feedback, bot_subscribers, files, partners, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield
    # при необходимости — закрытие ресурсов


app = FastAPI(
    title="Совет ветеранов — API",
    description="Бэкенд для сайта Совета ветеранов: новости, команда, районные отделения.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://советветеранов74.рф",
        "http://советветеранов74.рф",
        "https://xn--74-6kcae2a2a2a.xn--p1ai",
        "http://xn--74-6kcae2a2a2a.xn--p1ai",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(news.router)
app.include_router(team.router)
app.include_router(district_offices.router)
app.include_router(feedback.router)
app.include_router(bot_subscribers.router)
app.include_router(files.router)
app.include_router(partners.router)
app.include_router(auth.router)

# Статика для загруженных файлов (изображений)
_media_dir = Path(__file__).resolve().parent.parent / "media"
_media_dir.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=str(_media_dir)), name="media")


@app.get("/")
def root():
    return {"message": "API Совета ветеранов", "docs": "/docs"}
