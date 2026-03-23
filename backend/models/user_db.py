from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    watchlist = Column(JSON, default=list)
    history = Column(JSON, default=list)
    likes = Column(JSON, default=list)
    dislikes = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
