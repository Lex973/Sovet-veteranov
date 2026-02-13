from sqlalchemy import Column, Integer, String, Text, Date, DateTime, JSON, Boolean
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
    image = Column(String(500), default="")  # URL фото (например /media/uploads/...)
    position = Column(Integer, default=0)  # порядок отображения (меньше — выше)
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


class Feedback(Base):
    """Обращения граждан через форму на сайте."""
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(300), nullable=False)
    email = Column(String(300), default="")
    phone = Column(String(100), default="")
    question = Column(Text, nullable=False)
    status = Column(String(50), default="new")  # new, in_progress, done
    published = Column(Boolean, default=False)  # показывать в блоке «Решения вопросов»
    solution_text = Column(Text, default="")  # текст решения
    solution_image = Column(String(500), default="")  # URL фото к решению
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Partner(Base):
    """Партнёры в подвале сайта: логотип + ссылка."""
    __tablename__ = "partners"

    id = Column(Integer, primary_key=True, index=True)
    image = Column(String(500), default="")  # URL логотипа
    link = Column(String(500), default="")  # ссылка при клике
    position = Column(Integer, default=0)  # порядок
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class BotSubscriber(Base):
    """Получатели уведомлений Telegram-бота."""
    __tablename__ = "bot_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(300), default="")
    chat_id = Column(String(100), unique=True, index=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
