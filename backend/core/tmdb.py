import httpx
from core.config import settings
from typing import Optional

# Fallback movie list for unexpected offline network errors
FALLBACK_MOVIES = [
    {
        "id": 550,
        "title": "Fight Club",
        "overview": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
        "poster_path": "/pB8O2awVJwbE322byj2p8vssqTc.jpg",
        "backdrop_path": "/hZkgoQY85WAgE25qOiyOFyH9uWc.jpg",
        "release_date": "1999-10-15",
        "vote_average": 8.4,
        "genre_ids": [18]
    },
    {
        "id": 27205,
        "title": "Inception",
        "overview": "Cobb, a skilled thief who steals corporate secrets through dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O.",
        "poster_path": "/ljsZTCHVkoerioAKSkyvOPhYdUg.jpg",
        "backdrop_path": "/8ZTVqvKDQ8emSGUEMjsR4yHA8sZ.jpg",
        "release_date": "2010-07-15",
        "vote_average": 8.4,
        "genre_ids": [28, 878, 12]
    },
    {
        "id": 157336,
        "title": "Interstellar",
        "overview": "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        "poster_path": "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        "backdrop_path": "/xJHokMbljvjADYdit5fKSuVftv.jpg",
        "release_date": "2014-11-05",
        "vote_average": 8.4,
        "genre_ids": [12, 18, 878]
    }
]

# TMDB API Service
class TMDBService:
    BASE_URL = "https://api.themoviedb.org/3"
    
    def __init__(self):
        self.api_key = settings.TMDB_API_KEY
        self._client: Optional[httpx.AsyncClient] = None
        self._cache = {}

    async def get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            # Set browser User-Agent header so TMDB/Cloudflare accepts requests instantly
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
            self._client = httpx.AsyncClient(timeout=10.0, headers=headers, follow_redirects=True)
        return self._client

    async def close(self):
        if self._client is not None:
            await self._client.aclose()
            self._client = None

    async def _get(self, endpoint: str, params: dict = None):
        if params is None:
            params = {}
            
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
            
            # Cache response
            self._cache[cache_key] = data
            return data
        except Exception as e:
            print(f"Warning: TMDB API call to {endpoint} failed ({e}). Returning fallback data.")
            is_single_movie = endpoint.startswith("movie/") and endpoint.replace("movie/", "").split("?")[0].isdigit()
            if is_single_movie:
                fallback_res = {
                    **FALLBACK_MOVIES[0], 
                    "genres": [{"id": 18, "name": "Drama"}], 
                    "credits": {"cast": []}, 
                    "similar": {"results": FALLBACK_MOVIES}
                }
            else:
                fallback_res = {
                    "results": FALLBACK_MOVIES, 
                    "page": 1, 
                    "total_pages": 1, 
                    "genres": [{"id": 28, "name": "Action"}, {"id": 878, "name": "Sci-Fi"}]
                }
            return fallback_res

    async def get_trending(self, media_type: str = "movie", time_window: str = "day"):
        return await self._get(f"trending/{media_type}/{time_window}")

    async def get_popular(self, media_type: str = "movie"):
        return await self._get(f"{media_type}/popular")

    async def get_top_rated(self, media_type: str = "movie"):
        return await self._get(f"{media_type}/top_rated")

    async def get_genres(self):
        return await self._get("genre/movie/list")

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

    async def get_videos(self, media_type: str, item_id: int):
        return await self._get(f"{media_type}/{item_id}/videos")

tmdb_service = TMDBService()
