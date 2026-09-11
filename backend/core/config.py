import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

class Settings:
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Netflix AI Recommender")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "student_secret_key_12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    TMDB_API_KEY: str = os.getenv("TMDB_API_KEY", "fa9213eff7dfff85e9a80711d1d23d2d")
    
    # Database URL configuration (defaults to local SQLite database)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    @property
    def async_database_url(self) -> str:
        url = self.DATABASE_URL.strip()
        
        # If no database URL is set, use simple local SQLite database file
        if not url:
            return "sqlite+aiosqlite:///./movies.db"
        
        # Format PostgreSQL URLs for asyncpg if PostgreSQL is supplied
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            
        return url

settings = Settings()
