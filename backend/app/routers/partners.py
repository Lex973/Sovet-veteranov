from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Partner
from ..schemas import PartnerRead, PartnerCreate, PartnerUpdate


router = APIRouter(prefix="/partners", tags=["partners"])


@router.get("", response_model=List[PartnerRead])
def list_partners(db: Session = Depends(get_db)):
    return db.query(Partner).order_by(Partner.position.asc(), Partner.id.asc()).all()


@router.get("/{partner_id}", response_model=PartnerRead)
def get_partner(partner_id: int, db: Session = Depends(get_db)):
    item = db.query(Partner).filter(Partner.id == partner_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Партнёр не найден")
    return item


@router.post("", response_model=PartnerRead, status_code=201)
def create_partner(data: PartnerCreate, db: Session = Depends(get_db)):
    payload = data.model_dump()
    max_pos = db.query(Partner.position).order_by(Partner.position.desc()).first()
    payload["position"] = (max_pos[0] + 1) if max_pos is not None else 0
    item = Partner(**payload)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/{partner_id}", response_model=PartnerRead)
def update_partner(partner_id: int, data: PartnerUpdate, db: Session = Depends(get_db)):
    item = db.query(Partner).filter(Partner.id == partner_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Партнёр не найден")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{partner_id}", status_code=204)
def delete_partner(partner_id: int, db: Session = Depends(get_db)):
    item = db.query(Partner).filter(Partner.id == partner_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Партнёр не найден")
    db.delete(item)
    db.commit()
    return None
