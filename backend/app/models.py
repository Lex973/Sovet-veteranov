from sqlalchemy import Column, Integer, String, Text, Date, DateTime, JSON
from sqlalchemy.sql import func
from .database import Base


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    subtitle = Column(String(1000), default="")
    image = Column(String(500), default="")  # главное фото (первое из images или отдельно)
    images = Column(JSON, default=lambda: [])  # до 10 фото: список URL/путей
    content = Column(Text, nullable=False)  # HTML с форматированием
    date = Column(Date, nullable=False)
    hashtag = Column(String(200), default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(300), nullable=False)
    description = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DistrictOffice(Base):
    """Районные отделения / контакты."""
    __tablename__ = "district_offices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(300), nullable=False)
    address = Column(String(500), default="")
    phone = Column(String(100), default="")
    email = Column(String(200), default="")
    description = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
