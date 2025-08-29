# 🎬 Movie Recommender System

A content-based movie recommender system built using **Python**, **pandas**, **scikit-learn**, and **Streamlit**.

🔗 **Live App:**  
👉 [Click to try the app](https://movie-recommender-jw8sknxeths3kwlwmjysku.streamlit.app/)

---

## 📂 Project Structure

Movie-Recommender/
├── Data/
│ └── tmdb_5000_movies.csv # Movie metadata dataset
├── app.py # Streamlit UI and main app
├── recommender.py # Recommender logic (optional if separate)
├── requirements.txt # Dependencies
├── .gitignore # Git ignored files
└── README.md # This documentation

---

## 🚀 Features

- Suggests **5 similar movies** based on your selected title
- Uses **genres, keywords, and plot overview** for content-based filtering
- Fast and interactive interface via **Streamlit**
- Powered by **CountVectorizer** and **cosine similarity**

---

## 🧠 How It Works

1. **Data Parsing:**  
   - Parses `genres`, `keywords`, and `overview` from the TMDB dataset  
   - Converts them into a combined `tags` field

2. **Vectorization & Similarity:**  
   - Uses `CountVectorizer` to turn text into numerical vectors  
   - Calculates pairwise **cosine similarity** between movies

3. **Recommendation:**  
   - When a user selects a movie, shows top 5 most similar titles based on vector similarity

---

## 💻 Running the App Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Vaenvoice/Movie-Recommender.git
   cd Movie-Recommender

2. Install dependencies:
   ```bash
   pip install -r requirements.txt

3. Run the Streamlit app:
   ```bash
   streamlit run app.py

# Core packages:

pandas
scikit-learn
streamlit

# 📊 Dataset

Source: Kaggle - TMDB 5000 Movie Dataset

File used: tmdb_5000_movies.csv  

# 📝 Requirements
 Listed in requirements.txt. Install them with:
   ```bash
    pip install -r requirements.txt


