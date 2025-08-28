print("🚀 recommender.py is running")
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ast

df = pd.read_csv('data/tmdb_5000_movies.csv')
movies = df[['title', 'genres', 'keywords', 'overview']]

def convert(text):
    try:
        L = ast.literal_eval(text)
        return [d['name'] for d in L]
    except:
        return []

movies['genres'] = movies['genres'].apply(convert)
movies['keywords'] = movies['keywords'].apply(convert)
movies['overview'] = movies['overview'].apply(lambda x: x.split() if isinstance(x, str) else [])

movies['tags'] = movies['genres'] + movies['keywords'] + movies['overview']
movies['tags'] = movies['tags'].apply(lambda x: " ".join(x))

cv = CountVectorizer(max_features=5000, stop_words='english')
vectors = cv.fit_transform(movies['tags']).toarray()

similarity = cosine_similarity(vectors)

def recommend(movie_title):
    movie_title = movie_title.lower()
    try:
        index = movies[movies['title'].str.lower() == movie_title].index[0]
    except IndexError:
        print(f"\nMovie '{movie_title}' not found in dataset.")
        return

    distances = list(enumerate(similarity[index]))
    sorted_movies = sorted(distances, key=lambda x: x[1], reverse=True)

    print(f"\nBecause you liked '{movies.loc[index, 'title']}', you might also like:\n")
    for i in sorted_movies[1:6]:
        print(f"- {movies.iloc[i[0]].title}")

if __name__ == "__main__":
    movie_input = input("Enter a movie title: ")
    recommend(movie_input)
