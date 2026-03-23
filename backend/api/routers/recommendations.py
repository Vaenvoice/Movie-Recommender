from fastapi import APIRouter, Depends
from core.recommendation import recommender
from api.routers.deps import get_current_user
from models.user_db import User

router = APIRouter(prefix="/recommend", tags=["recommendations"])

@router.get("/personalized")
async def personalized(current_user: User = Depends(get_current_user)):
    return await recommender.get_personalized_recommendations(
        current_user.history, current_user.likes
    )

@router.get("/because-you-watched/{movie_id}")
async def because_you_watched(movie_id: int):
    return await recommender.get_content_recommendations(movie_id)
