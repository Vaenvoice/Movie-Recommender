from fastapi import APIRouter, HTTPException, Query
from core.tmdb import tmdb_service
from typing import Optional

router = APIRouter(prefix="/movies", tags=["movies"])

# Get trending movies/TV
@router.get("/trending")
async def trending():
    try:
        return await tmdb_service.get_trending()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get popular movies or TV shows
@router.get("/popular")
async def popular(type: str = "movie"):
    try:
        return await tmdb_service.get_popular(type)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get top rated movies
@router.get("/top-rated")
async def top_rated():
    try:
        return await tmdb_service.get_top_rated()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Search movies by query string
@router.get("/search")
async def search(query: str = Query(..., min_length=1)):
    try:
        return await tmdb_service.search_movies(query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get list of genres
@router.get("/genres/list")
async def genres(type: str = "movie"):
    try:
        if type == "tv":
            return await tmdb_service.get_tv_genres()
        return await tmdb_service.get_genres()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Discover movies by filters
@router.get("/discover")
async def discover_movies(
    type: str = "movie", 
    sort_by: str = "popularity.desc", 
    genre_id: Optional[str] = None
):
    try:
        return await tmdb_service.get_discover_movies(
            media_type=type, 
            sort_by=sort_by, 
            with_genres=genre_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get trailer videos for a movie/TV item
@router.get("/video/{media_type}/{item_id}")
async def get_video(media_type: str, item_id: int):
    try:
        return await tmdb_service.get_videos(media_type, item_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get detailed information for a single movie
@router.get("/{movie_id}")
async def movie_details(movie_id: int):
    try:
        return await tmdb_service.get_movie_details(movie_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Movie not found")
