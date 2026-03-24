from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from core.tmdb import tmdb_service
import pandas as pd
import numpy as np
import logging
import asyncio

logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def _prepare_content_string(self, movie: dict) -> str:
        """Combine overview and genres into a single string for vectorization."""
        overview = movie.get("overview", "") or ""
        genres = " ".join([g.get("name", "") for g in movie.get("genres", [])]) if movie.get("genres") else ""
        # Also include keywords if available in the future
        return f"{overview} {genres}".strip()

    async def get_content_recommendations(self, movie_id: int, n=10):
        """
        AI-Powered Recommendations:
        1. Fetch candidates from TMDB's similarity API.
        2. Fetch full details for all candidates to get overviews/genres.
        3. Use TF-IDF and Cosine Similarity to re-rank candidates locally.
        """
        # Fetch target movie details
        target_movie = await tmdb_service.get_movie_details(movie_id)
        similar_raw = target_movie.get("similar", {}).get("results", [])
        
        if not similar_raw:
            return []

        # We combine the target movie with the candidates to build a similarity matrix
        candidates = similar_raw[:20]  # Take top 20 candidates for re-ranking
        all_movies = [target_movie] + candidates
        
        content_strings = [self._prepare_content_string(m) for m in all_movies]
        
        if not any(content_strings):
            return similar_raw[:n]

        try:
            tfidf_matrix = self.vectorizer.fit_transform(content_strings)
            # Compare target (index 0) with candidates (indices 1 to end)
            cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])
            
            # Get scores and sort
            scores = list(enumerate(cosine_sim[0]))
            scores = sorted(scores, key=lambda x: x[1], reverse=True)
            
            # Re-order candidates based on local similarity scores
            ranked_candidates = [candidates[i] for i, score in scores]
            return ranked_candidates[:n]
        except Exception as e:
            logger.error(f"Error in local similarity computation: {e}")
            # Fallback to raw TMDB order
            return similar_raw[:n]

    async def get_personalized_recommendations(self, history: list, likes: list):
        if not history and not likes:
            trending = await tmdb_service.get_trending()
            return trending.get("results", [])[:10]
        
        # Aggregate user profile: Use all liked movies to build a "User Vector"
        liked_ids = likes[-3:] if likes else history[-1:] # Take last 3 relevant IDs
        
        # Parallel fetch details for liked movies
        liked_details = await asyncio.gather(*(tmdb_service.get_movie_details(mid) for mid in liked_ids), return_exceptions=True)
        liked_details = [m for m in liked_details if not isinstance(m, Exception) and m]
        
        # Get candidates (trending and similar to last like)
        trending = await tmdb_service.get_trending()
        trending_results = trending.get("results", [])[:20]
        
        similar_to_last = []
        if liked_ids:
            try:
                last_details = await tmdb_service.get_movie_details(liked_ids[-1])
                similar_to_last = last_details.get("similar", {}).get("results", [])[:20]
            except:
                pass
            
        # Deduplicate candidates
        candidate_map = {m['id']: m for m in (trending_results + similar_to_last)}
        candidates = list(candidate_map.values())
        
        if not liked_details or not candidates:
            return trending_results[:10]

        # Local re-ranking
        all_content = [self._prepare_content_string(m) for m in liked_details] + \
                      [self._prepare_content_string(m) for m in candidates]
        
        try:
            tfidf_matrix = self.vectorizer.fit_transform(all_content)
            num_liked = len(liked_details)
            # User profile is the mean vector of liked movies
            user_profile = tfidf_matrix[:num_liked].mean(axis=0)
            candidate_vectors = tfidf_matrix[num_liked:]
            
            # Reshape user_profile to be 2D for cosine_similarity
            user_profile_arr = np.asarray(user_profile).reshape(1, -1)
            
            cosine_sim = cosine_similarity(user_profile_arr, candidate_vectors)
            scores = list(enumerate(cosine_sim[0]))
            scores = sorted(scores, key=lambda x: x[1], reverse=True)
            
            ranked_candidates = [candidates[i] for i, score in scores]
            return ranked_candidates[:10]
        except Exception as e:
            logger.error(f"Error in personalized recommendation: {e}")
            return trending_results[:10]

recommender = RecommendationEngine()
