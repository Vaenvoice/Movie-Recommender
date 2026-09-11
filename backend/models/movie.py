from pydantic import BaseModel
from typing import List, Optional

# Movie data models for API responses

class MovieBase(BaseModel):
    id: int  # TMDB Movie/TV ID
    title: str
    overview: str
    poster_path: Optional[str] = None
    backdrop_path: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: float
    genre_ids: List[int] = []

class MovieDetail(MovieBase):
    genres: List[dict] = []
    runtime: Optional[int] = None
    tagline: Optional[str] = None
    status: Optional[str] = None
