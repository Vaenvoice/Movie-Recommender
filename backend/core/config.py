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
        
        import os
        # Check for deployment environment
        is_render = "RENDER" in os.environ
        is_railway = "RAILWAY_PROJECT_ID" in os.environ or "RAILWAY_SERVICE_ID" in os.environ
        
        if (is_render or is_railway):
            if not url:
                print(f"CRITICAL: DATABASE_URL environment variable is MISSING on {'Render' if is_render else 'Railway'}!")
                raise ValueError("DATABASE_URL is missing in deployment environment.")
            else:
                provider = "Render" if is_render else "Railway"
                print(f"INFO: DATABASE_URL detected from {provider} Environment")
        
        if not url:
            # Local fallback for development ONLY
            return "postgresql+asyncpg://postgres:postgres@localhost:5432/netflix_db"
        
        # Most cloud providers (Render, Railway, Supabase) use postgres:// but asyncpg needs postgresql+asyncpg://
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        
        if "postgresql+asyncpg://" not in url:
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        
        # Remove sslmode from URL as asyncpg doesn't support it as a query param
        # We handle SSL in database.py via connect_args
        if "sslmode=" in url:
            import re
            url = re.sub(r"\?sslmode=[^&]*", "", url)
            url = re.sub(r"&sslmode=[^&]*", "", url)
        
        return url

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
