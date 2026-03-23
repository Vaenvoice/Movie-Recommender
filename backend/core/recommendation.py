from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from core.tmdb import tmdb_service
import pandas as pd
import numpy as np

class RecommendationEngine:
    async def get_content_recommendations(self, movie_id: int, n=10):
        # Fetch details to get genres and similar movies as features
        movie_details = await tmdb_service.get_movie_details(movie_id)
        similar_raw = movie_details.get("similar", {}).get("results", [])
        
        if not similar_raw:
            return []

        # In a real production app, we would have a pre-computed matrix 
        # for millions of movies. For this version, we use TMDB's similar movies 
        # and then re-rank them or provide them as a starting point.
        return similar_raw[:n]

    async def get_personalized_recommendations(self, history: list, likes: list):
        if not history and not likes:
            # Fallback to trending
            trending = await tmdb_service.get_trending()
            return trending.get("results", [])[:10]
        
        # Simple Logic: Recommend based on the most recent liked movie
        target_id = likes[-1] if likes else history[-1]
        return await self.get_content_recommendations(target_id)

recommender = RecommendationEngine()
