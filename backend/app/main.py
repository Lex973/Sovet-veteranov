from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base, get_db
from .routers import news, team, district_offices


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
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(news.router)
app.include_router(team.router)
app.include_router(district_offices.router)


@app.get("/")
def root():
    return {"message": "API Совета ветеранов", "docs": "/docs"}
