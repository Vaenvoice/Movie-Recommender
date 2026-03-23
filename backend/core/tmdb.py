import httpx
from core.config import settings
from typing import List, Optional

from cachetools import TTLCache
import time

class TMDBService:
    BASE_URL = "https://api.themoviedb.org/3"
    
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        self._client: Optional[httpx.AsyncClient] = None
        # Cache for 1 hour, max 100 items
        self._cache = TTLCache(maxsize=100, ttl=3600)

    async def get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=10.0)
        return self._client

    async def close(self):
        if self._client is not None:
            await self._client.aclose()
            self._client = None

    async def _get(self, endpoint: str, params: dict = {}):
        # Create a cache key from endpoint and params
        cache_key = f"{endpoint}:{str(sorted(params.items()))}"
        if cache_key in self._cache:
            return self._cache[cache_key]

        full_params = params.copy()
        full_params["api_key"] = self.api_key
        
        client = await self.get_client()
        try:
            response = await client.get(f"{self.BASE_URL}/{endpoint}", params=full_params)
            response.raise_for_status()
            data = response.json()
            
            # Only cache successful responses
            self._cache[cache_key] = data
            return data
        except Exception as e:
            # Fallback for errors or re-raise
            raise e

    async def get_trending(self, media_type: str = "movie", time_window: str = "day"):
        return await self._get(f"trending/{media_type}/{time_window}")

    async def get_popular(self, media_type: str = "movie"):
        return await self._get(f"{media_type}/popular")

    async def get_top_rated(self, media_type: str = "movie"):
        return await self._get(f"{media_type}/top_rated")

    async def get_tv_genres(self):
        return await self._get("genre/tv/list")

    async def get_movie_details(self, movie_id: int):
        return await self._get(f"movie/{movie_id}", params={"append_to_response": "videos,credits,similar"})

    async def search_movies(self, query: str):
        return await self._get("search/movie", params={"query": query})

    async def get_discover_movies(self, media_type: str = "movie", sort_by: str = "popularity.desc", with_genres: Optional[str] = None):
        params = {
            "sort_by": sort_by,
            "include_adult": "false",
            "include_video": "false",
            "page": 1
        }
        if with_genres:
            params["with_genres"] = with_genres
        return await self._get(f"discover/{media_type}", params=params)

    async def get_genres(self):
        return await self._get("genre/movie/list")

    async def get_videos(self, media_type: str, item_id: int):
        return await self._get(f"{media_type}/{item_id}/videos")

tmdb_service = TMDBService()
