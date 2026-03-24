import asyncio
import sys
import os
from unittest.mock import AsyncMock, MagicMock

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from core.recommendation import RecommendationEngine

async def test_recommender():
    print("Testing Recommendation Engine...")
    recommender = RecommendationEngine()
    
    # Mock data
    source_movie = {
        "id": 1,
        "title": "Space Adventure",
        "overview": "A thrilling journey through the stars and galaxies.",
        "genres": [{"name": "Sci-Fi"}, {"name": "Adventure"}]
    }
    
    similar_movies = [
        {
            "id": 2, 
            "title": "Romance in Paris", 
            "overview": "A love story set in the city of lights.", 
            "genres": [{"name": "Romance"}]
        },
        {
            "id": 3, 
            "title": "Star Wars Legacy", 
            "overview": "Galactic battles and space exploration in a far away galaxy.", 
            "genres": [{"name": "Sci-Fi"}, {"name": "Action"}]
        },
        {
            "id": 4, 
            "title": "Cooking with Joy", 
            "overview": "A documentary about professional chefs.", 
            "genres": [{"name": "Documentary"}]
        }
    ]
    
    # Mock TMDB service
    from core.tmdb import tmdb_service
    tmdb_service.get_movie_details = AsyncMock(side_effect=lambda id: {
        1: source_movie,
        2: similar_movies[0],
        3: similar_movies[1],
        4: similar_movies[2],
        100: {"id": 100, "overview": "Space travel", "genres": [{"name": "Sci-Fi"}]},
        200: {"id": 200, "overview": "Galaxy exploration", "genres": [{"name": "Sci-Fi"}]}
    }.get(id, {"id": id, "overview": "", "genres": []}))
    
    source_movie["similar"] = {"results": similar_movies}
    
    # Test Content Recommendations
    print("\n[1] Testing Content Recommendations (Re-ranking)...")
    results = await recommender.get_content_recommendations(1)
    
    print(f"Top recommendation: {results[0]['title']}")
    # "Star Wars Legacy" (id 3) should be top due to Sci-Fi/Space keywords
    assert results[0]['id'] == 3
    print("✓ Content re-ranking works (Star Wars Legacy ranked higher than Romance).")

    # Test Personalized Recommendations
    print("\n[2] Testing Personalized Recommendations...")
    # Mock trending
    tmdb_service.get_trending = AsyncMock(return_value={"results": similar_movies})
    
    # User likes Sci-Fi movies
    likes = [100, 200]
    history = []
    
    results = await recommender.get_personalized_recommendations(history, likes)
    print(f"Personalized Top recommendation: {results[0]['title']}")
    assert results[0]['id'] == 3 # Should still favor the sci-fi one
    print("✓ Personalization works (Sci-Fi profile favors Sci-Fi candidates).")

if __name__ == "__main__":
    asyncio.run(test_recommender())
