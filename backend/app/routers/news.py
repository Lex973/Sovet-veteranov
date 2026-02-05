from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import News
from ..schemas import NewsRead, NewsCreate, NewsUpdate
from ..telegram_notify import notify_new_news

router = APIRouter(prefix="/news", tags=["news"])


@router.get("", response_model=List[NewsRead])
def list_news(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(News).order_by(News.date.desc()).offset(skip).limit(limit).all()
    return items


@router.get("/{news_id}", response_model=NewsRead)
def get_news(news_id: int, db: Session = Depends(get_db)):
    item = db.query(News).filter(News.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Новость не найдена")
    return item


@router.post("", response_model=NewsRead, status_code=201)
def create_news(data: NewsCreate, db: Session = Depends(get_db)):
    news = News(**data.model_dump())
    db.add(news)
    db.commit()
    db.refresh(news)
    notify_new_news(news)
    return news


@router.patch("/{news_id}", response_model=NewsRead)
def update_news(news_id: int, data: NewsUpdate, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="Новость не найдена")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(news, k, v)
    db.commit()
    db.refresh(news)
    return news


@router.delete("/{news_id}", status_code=204)
def delete_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="Новость не найдена")
    db.delete(news)
    db.commit()
    return None
