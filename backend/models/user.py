from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

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
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
        json_encoders = {datetime: lambda v: v.isoformat()}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
