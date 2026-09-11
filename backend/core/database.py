from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from core.config import settings
import os

# Set engine options based on whether we use SQLite or PostgreSQL
db_url = settings.async_database_url
is_sqlite = db_url.startswith("sqlite")

connect_args = {}
if is_sqlite:
    connect_args["check_same_thread"] = False

# Create database engine
engine = create_async_engine(
    db_url,
    echo=False,
    connect_args=connect_args
)

# Session factory for creating async database sessions
SessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for SQLAlchemy models
class Base(DeclarativeBase):
    pass

# Dependency function to get database session in API routes
async def get_db():
    async with SessionLocal() as session:
        yield session

# Initialize database tables on startup
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)