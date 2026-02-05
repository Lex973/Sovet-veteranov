from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, field_validator

# Алиас, чтобы не затенять тип в полях с именем date
DateType = date


# --- News ---
class NewsBase(BaseModel):
    title: str
    subtitle: str = ""
    image: str = ""
    images: list[str] = []  # до 10 фото
    content: str = ""
    date: DateType
    hashtag: str = ""

    @field_validator("images")
    @classmethod
    def images_max_10(cls, v: list) -> list:
        if len(v) > 10:
            raise ValueError("Не более 10 изображений")
        return v


class NewsCreate(NewsBase):
    pass


class NewsUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image: Optional[str] = None
    images: Optional[list[str]] = None
    content: Optional[str] = None
    date: Optional[DateType] = None
    hashtag: Optional[str] = None

    @field_validator("images")
    @classmethod
    def images_max_10(cls, v: Optional[list]) -> Optional[list]:
        if v is not None and len(v) > 10:
            raise ValueError("Не более 10 изображений")
        return v


class NewsRead(NewsBase):
    id: int
    created_at: Optional[datetime] = None

    @field_validator("images", mode="before")
    @classmethod
    def images_default(cls, v):
        return v if v is not None else []

    class Config:
        from_attributes = True


# --- Team ---
class TeamMemberBase(BaseModel):
    name: str
    description: str = ""


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class TeamMemberRead(TeamMemberBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# --- District offices ---
class DistrictOfficeBase(BaseModel):
    name: str
    address: str = ""
    phone: str = ""
    email: str = ""
    description: str = ""


class DistrictOfficeCreate(DistrictOfficeBase):
    pass


class DistrictOfficeUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None


class DistrictOfficeRead(DistrictOfficeBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
