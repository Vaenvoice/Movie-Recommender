from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Netflix AI Recommender"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/netflix_db"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60
    TMDB_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
