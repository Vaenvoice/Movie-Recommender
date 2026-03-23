from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified
from core.database import get_db
from api.routers.deps import get_current_user
from models.user_db import User
from typing import List

router = APIRouter(prefix="/user", tags=["user"])

@router.post("/watchlist/add/{movie_id}")
async def add_to_watchlist(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if movie_id not in current_user.watchlist:
        current_user.watchlist = [*current_user.watchlist, movie_id]
        flag_modified(current_user, "watchlist")
        await db.commit()
    return {"message": "Added to watchlist"}

@router.post("/watchlist/remove/{movie_id}")
async def remove_from_watchlist(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if movie_id in current_user.watchlist:
        current_user.watchlist = [m for m in current_user.watchlist if m != movie_id]
        flag_modified(current_user, "watchlist")
        await db.commit()
    return {"message": "Removed from watchlist"}

@router.post("/history/add/{movie_id}")
async def add_to_history(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if movie_id not in current_user.history:
        current_user.history = [*current_user.history, movie_id]
        flag_modified(current_user, "history")
        await db.commit()
    return {"message": "Added to history"}

@router.post("/like/{movie_id}")
async def like_movie(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if movie_id not in current_user.likes:
        current_user.likes = [*current_user.likes, movie_id]
        if movie_id in current_user.dislikes:
            current_user.dislikes = [m for m in current_user.dislikes if m != movie_id]
            flag_modified(current_user, "dislikes")
        flag_modified(current_user, "likes")
        await db.commit()
    return {"message": "Liked movie"}

@router.post("/dislike/{movie_id}")
async def dislike_movie(movie_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if movie_id not in current_user.dislikes:
        current_user.dislikes = [*current_user.dislikes, movie_id]
        if movie_id in current_user.likes:
            current_user.likes = [m for m in current_user.likes if m != movie_id]
            flag_modified(current_user, "likes")
        flag_modified(current_user, "dislikes")
        await db.commit()
    return {"message": "Disliked movie"}
