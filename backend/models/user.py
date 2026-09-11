from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Pydantic schemas for data validation

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    watchlist: List[int] = []
    history: List[int] = []
    likes: List[int] = []
    dislikes: List[int] = []
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
