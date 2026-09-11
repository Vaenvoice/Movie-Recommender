from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from core.tmdb import tmdb_service
import numpy as np
import logging
import asyncio

logger = logging.getLogger(__name__)

# Content-Based Recommendation Engine using TF-IDF and Cosine Similarity
class RecommendationEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def _prepare_text(self, movie: dict) -> str:
        """Combine movie overview and genres into a single text block for vector matching."""
        overview = movie.get("overview", "") or ""
        genres = " ".join([g.get("name", "") for g in movie.get("genres", [])]) if movie.get("genres") else ""
        return f"{overview} {genres}".strip()

    async def get_content_recommendations(self, movie_id: int, n=10):
        """
        Get similar movies to a specific movie ID using TF-IDF text similarity.
        """
        try:
            target_movie = await tmdb_service.get_movie_details(movie_id)
            similar_raw = target_movie.get("similar", {}).get("results", [])
            
            if not similar_raw:
                return []

            candidates = similar_raw[:20]
            all_movies = [target_movie] + candidates
            
            text_corpus = [self._prepare_text(m) for m in all_movies]
            
            if not any(text_corpus):
                return similar_raw[:n]

            # Vectorize plot overviews and genres
            tfidf_matrix = self.vectorizer.fit_transform(text_corpus)
            
            # Compute similarity between target (index 0) and candidates (1 to end)
            cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]
            
            # Sort candidates by similarity score
            scores = list(enumerate(cosine_sim))
            scores.sort(key=lambda x: x[1], reverse=True)
            
            ranked_movies = [candidates[i] for i, score in scores]
            return ranked_movies[:n]
        except Exception as e:
            logger.error(f"Recommendation error: {e}")
            return []

    async def get_personalized_recommendations(self, history: list, likes: list):
        """
        Build a user taste profile based on liked/watched movies and rank recommendations.
        """
        # If user has no history or likes yet, fallback to trending movies
        if not history and not likes:
            trending = await tmdb_service.get_trending()
            return trending.get("results", [])[:10]

        # Use recent liked/watched movie IDs
        user_ids = likes[-3:] if likes else history[-2:]

        try:
            # Fetch details of user's liked movies in parallel
            user_movies = await asyncio.gather(
                *(tmdb_service.get_movie_details(mid) for mid in user_ids),
                return_exceptions=True
            )
            user_movies = [m for m in user_movies if isinstance(m, dict) and m.get("id")]

            # Get candidate movies (trending)
            trending = await tmdb_service.get_trending()
            candidates = trending.get("results", [])[:20]

            if not user_movies or not candidates:
                return trending.get("results", [])[:10]

            # Build text corpus for user movies + candidate movies
            all_texts = [self._prepare_text(m) for m in user_movies] + [self._prepare_text(m) for m in candidates]
            tfidf_matrix = self.vectorizer.fit_transform(all_texts)

            num_user_movies = len(user_movies)
            
            # Compute average user vector from liked movies
            user_profile = np.asarray(tfidf_matrix[:num_user_movies].mean(axis=0))
            candidate_vectors = tfidf_matrix[num_user_movies:]

            # Compute similarity scores
            scores = cosine_similarity(user_profile, candidate_vectors)[0]
            ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)

            return [movie for movie, score in ranked][:10]
        except Exception as e:
            logger.error(f"Personalized recommendation error: {e}")
            trending = await tmdb_service.get_trending()
            return trending.get("results", [])[:10]

recommender = RecommendationEngine()
