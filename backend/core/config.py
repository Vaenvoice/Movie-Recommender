from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Netflix AI Recommender"
    DATABASE_URL: Optional[str] = None
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60
    TMDB_API_KEY: str = ""

    @property
    def async_database_url(self) -> str:
        url = self.DATABASE_URL
        
        # Explicit debugging for the user in Render logs
        import os
        if "RENDER" in os.environ:
            if not url:
                print("CRITICAL: DATABASE_URL environment variable is MISSING on Render!")
                print("Please go to the Render Dashboard -> Environment -> Add Environment Variable")
                # Intentionally not falling back to localhost on Render
                raise ValueError("DATABASE_URL is missing in Render environment.")
            else:
                print(f"INFO: DATABASE_URL detected from Render Environment (protocol: {url.split(':')[0]})")
        
        if not url:
            # Local fallback for development ONLY
            return "postgresql+asyncpg://postgres:postgres@localhost:5432/netflix_db"
        
        # Render and other providers often use postgres:// but asyncpg needs postgresql+asyncpg://
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and "+asyncpg" not in url:
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        
        return url

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
