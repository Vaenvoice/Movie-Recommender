import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ast

# Load and process data (same as recommender.py)
@st.cache_data
def load_data():
    df = pd.read_csv("data/tmdb_5000_movies.csv")
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

    return movies

@st.cache_resource
def compute_similarity(movies):
    cv = CountVectorizer(max_features=5000, stop_words='english')
    vectors = cv.fit_transform(movies['tags']).toarray()
    similarity = cosine_similarity(vectors)
    return similarity

# Recommend function
def recommend(movie_title, movies, similarity):
    movie_title = movie_title.lower()
    try:
        index = movies[movies['title'].str.lower() == movie_title].index[0]
    except IndexError:
        return []

    distances = list(enumerate(similarity[index]))
    sorted_movies = sorted(distances, key=lambda x: x[1], reverse=True)
    return [movies.iloc[i[0]].title for i in sorted_movies[1:6]]

# ----------------------------
# Streamlit UI Starts Here
# ----------------------------
st.set_page_config(page_title="Movie Recommender", layout="centered")

st.title("🎬 Movie Recommender System")
st.write("Select a movie to get similar movie suggestions.")

# Load data and similarity matrix
movies = load_data()
similarity = compute_similarity(movies)

# Dropdown
movie_list = movies['title'].values
selected_movie = st.selectbox("Choose a movie", movie_list)

# Recommend button
if st.button("Show Recommendations"):
    recommendations = recommend(selected_movie, movies, similarity)
    if recommendations:
        st.success("Because you liked **{}**, you might also like:".format(selected_movie))
        for rec in recommendations:
            st.write("✅ " + rec)
    else:
        st.warning("Movie not found.")
