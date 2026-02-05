from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import DistrictOffice
from ..schemas import DistrictOfficeRead, DistrictOfficeCreate, DistrictOfficeUpdate

router = APIRouter(prefix="/district-offices", tags=["district-offices"])


@router.get("", response_model=List[DistrictOfficeRead])
def list_district_offices(db: Session = Depends(get_db)):
    return db.query(DistrictOffice).order_by(DistrictOffice.id).all()


@router.get("/{office_id}", response_model=DistrictOfficeRead)
def get_district_office(office_id: int, db: Session = Depends(get_db)):
    item = db.query(DistrictOffice).filter(DistrictOffice.id == office_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Районное отделение не найдено")
    return item


@router.post("", response_model=DistrictOfficeRead, status_code=201)
def create_district_office(data: DistrictOfficeCreate, db: Session = Depends(get_db)):
    office = DistrictOffice(**data.model_dump())
    db.add(office)
    db.commit()
    db.refresh(office)
    return office


@router.patch("/{office_id}", response_model=DistrictOfficeRead)
def update_district_office(office_id: int, data: DistrictOfficeUpdate, db: Session = Depends(get_db)):
    office = db.query(DistrictOffice).filter(DistrictOffice.id == office_id).first()
    if not office:
        raise HTTPException(status_code=404, detail="Районное отделение не найдено")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(office, k, v)
    db.commit()
    db.refresh(office)
    return office


@router.delete("/{office_id}", status_code=204)
def delete_district_office(office_id: int, db: Session = Depends(get_db)):
    office = db.query(DistrictOffice).filter(DistrictOffice.id == office_id).first()
    if not office:
        raise HTTPException(status_code=404, detail="Районное отделение не найдено")
    db.delete(office)
    db.commit()
    return None
