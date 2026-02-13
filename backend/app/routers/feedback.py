from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Feedback
from ..schemas import FeedbackCreate, FeedbackRead, FeedbackUpdate, FeedbackPublishedRead
from ..telegram_notify import notify_new_feedback


router = APIRouter(prefix="/feedback", tags=["feedback"])


@router.get("", response_model=List[FeedbackRead])
def list_feedback(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = (
        db.query(Feedback)
        .order_by(Feedback.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return items


@router.get("/published", response_model=List[FeedbackPublishedRead])
def list_published_feedback(db: Session = Depends(get_db)):
    """Публичный список: только обращения, опубликованные в «Решения вопросов»."""
    return (
        db.query(Feedback)
        .filter(Feedback.published.is_(True))
        .order_by(Feedback.created_at.desc())
        .all()
    )


@router.get("/{feedback_id}", response_model=FeedbackRead)
def get_feedback(feedback_id: int, db: Session = Depends(get_db)):
    item = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Обращение не найдено")
    return item


@router.post("", response_model=FeedbackRead, status_code=201)
def create_feedback(data: FeedbackCreate, db: Session = Depends(get_db)):
    item = Feedback(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    notify_new_feedback(item)
    return item


@router.patch("/{feedback_id}", response_model=FeedbackRead)
def update_feedback(feedback_id: int, data: FeedbackUpdate, db: Session = Depends(get_db)):
    item = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Обращение не найдено")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item

