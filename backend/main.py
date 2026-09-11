from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from core.config import settings
from core.database import init_db
from core.tmdb import tmdb_service
from api.routers import auth, movies, users, recommendations

# Lifespan context manager for startup & shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    await init_db()
    yield
    # Shutdown: close TMDB httpx client
    await tmdb_service.close()

# Create FastAPI App Instance
app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# Setup CORS Middleware for local and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://vaentv.vercel.app",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(users.router)
app.include_router(recommendations.router)

# Health & Root Check Endpoints
@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
