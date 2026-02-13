from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import BotSubscriber
from ..schemas import BotSubscriberCreate, BotSubscriberRead, BotSubscriberUpdate


router = APIRouter(prefix="/bot-subscribers", tags=["bot-subscribers"])


@router.get("", response_model=List[BotSubscriberRead])
def list_subscribers(db: Session = Depends(get_db)):
    return (
        db.query(BotSubscriber)
        .order_by(BotSubscriber.created_at.desc())
        .all()
    )


@router.post("", response_model=BotSubscriberRead, status_code=201)
def create_subscriber(data: BotSubscriberCreate, db: Session = Depends(get_db)):
    # если такой chat_id уже есть, просто обновим имя и статус
    existing = db.query(BotSubscriber).filter(BotSubscriber.chat_id == data.chat_id).first()
    if existing:
        for k, v in data.model_dump().items():
            setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        return existing

    sub = BotSubscriber(**data.model_dump())
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


@router.patch("/{subscriber_id}", response_model=BotSubscriberRead)
def update_subscriber(subscriber_id: int, data: BotSubscriberUpdate, db: Session = Depends(get_db)):
    sub = db.query(BotSubscriber).filter(BotSubscriber.id == subscriber_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Подписчик не найден")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(sub, k, v)
    db.commit()
    db.refresh(sub)
    return sub


@router.delete("/{subscriber_id}", status_code=204)
def delete_subscriber(subscriber_id: int, db: Session = Depends(get_db)):
    sub = db.query(BotSubscriber).filter(BotSubscriber.id == subscriber_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Подписчик не найден")
    db.delete(sub)
    db.commit()
    return None

