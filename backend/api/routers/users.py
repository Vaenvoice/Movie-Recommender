from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified
from core.database import get_db
from api.routers.deps import get_current_user
from models.user_db import User

router = APIRouter(prefix="/user", tags=["user"])

# Add movie to user watchlist
@router.post("/watchlist/add/{movie_id}")
async def add_to_watchlist(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    watchlist = current_user.watchlist or []
    if movie_id not in watchlist:
        current_user.watchlist = [*watchlist, movie_id]
        flag_modified(current_user, "watchlist")
        await db.commit()
    return {"message": "Added to watchlist"}

# Remove movie from user watchlist
@router.post("/watchlist/remove/{movie_id}")
async def remove_from_watchlist(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    watchlist = current_user.watchlist or []
    if movie_id in watchlist:
        current_user.watchlist = [m for m in watchlist if m != movie_id]
        flag_modified(current_user, "watchlist")
        await db.commit()
    return {"message": "Removed from watchlist"}

# Add movie to watch history
@router.post("/history/add/{movie_id}")
async def add_to_history(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    history = current_user.history or []
    if movie_id not in history:
        current_user.history = [*history, movie_id]
        flag_modified(current_user, "history")
        await db.commit()
    return {"message": "Added to history"}

# Like a movie
@router.post("/like/{movie_id}")
async def like_movie(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    likes = current_user.likes or []
    dislikes = current_user.dislikes or []
    if movie_id not in likes:
        current_user.likes = [*likes, movie_id]
        if movie_id in dislikes:
            current_user.dislikes = [m for m in dislikes if m != movie_id]
            flag_modified(current_user, "dislikes")
        flag_modified(current_user, "likes")
        await db.commit()
    return {"message": "Liked movie"}

# Dislike a movie
@router.post("/dislike/{movie_id}")
async def dislike_movie(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    dislikes = current_user.dislikes or []
    likes = current_user.likes or []
    if movie_id not in dislikes:
        current_user.dislikes = [*dislikes, movie_id]
        if movie_id in likes:
            current_user.likes = [m for m in likes if m != movie_id]
            flag_modified(current_user, "likes")
        flag_modified(current_user, "dislikes")
        await db.commit()
    return {"message": "Disliked movie"}
