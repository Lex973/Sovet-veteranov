from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import TeamMember
from ..schemas import TeamMemberRead, TeamMemberCreate, TeamMemberUpdate

router = APIRouter(prefix="/team", tags=["team"])


@router.get("", response_model=List[TeamMemberRead])
def list_team(db: Session = Depends(get_db)):
    return db.query(TeamMember).order_by(TeamMember.id).all()


@router.get("/{member_id}", response_model=TeamMemberRead)
def get_team_member(member_id: int, db: Session = Depends(get_db)):
    item = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Член команды не найден")
    return item


@router.post("", response_model=TeamMemberRead, status_code=201)
def create_team_member(data: TeamMemberCreate, db: Session = Depends(get_db)):
    member = TeamMember(**data.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.patch("/{member_id}", response_model=TeamMemberRead)
def update_team_member(member_id: int, data: TeamMemberUpdate, db: Session = Depends(get_db)):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Член команды не найден")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(member, k, v)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/{member_id}", status_code=204)
def delete_team_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Член команды не найден")
    db.delete(member)
    db.commit()
    return None
