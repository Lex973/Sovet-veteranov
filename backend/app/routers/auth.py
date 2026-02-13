from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from ..config import get_settings

router = APIRouter(prefix="/admin", tags=["admin"])


class LoginBody(BaseModel):
    password: str


@router.post("/login")
def login(body: LoginBody):
    settings = get_settings()
    if not settings.admin_password:
        raise HTTPException(status_code=503, detail="Вход в админку не настроен (не задан ADMIN_PASSWORD)")
    if body.password != settings.admin_password:
        raise HTTPException(status_code=401, detail="Неверный пароль")
    return {"ok": True}
