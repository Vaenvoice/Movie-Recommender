# Netflix-Style AI Movie Recommender

A high-performance, full-stack movie discovery and streaming platform built with **FastAPI**, **React**, and **PostgreSQL**. This project features personalized AI recommendations and a premium Netflix-inspired UI.

## 🚀 Features

- **Auth**: JWT-based Secure Login/Signup.
- **UI/UX**: Smooth Framer Motion animations, Hover-expansion cards, and Dark Theme.
- **AI Engine**: Content-based recommendations (Because you watched X).
- **Search**: Real-time debounced movie search via TMDB API.
- **Streaming**: Interactive video player for movie trailers.
- **Interactions**: Like/Dislike system to tune your recommendations.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Axios, React Player.
- **Backend**: FastAPI (Python), SQLAlchemy (Async), PostgreSQL, **Cachetools** (Caching).
- **Database**: PostgreSQL.
- **ML**: Scikit-Learn for recommendation similarity.

## ⚡ Performance Optimizations

This project has been optimized for speed and efficiency:
- **API Caching**: In-memory TTL caching for TMDB results (Trending, Popular, Genres) reduces latency by up to **11x**.
- **Connection Pooling**: Persistent HTTP clients prevent connection overhead.
- **Payload Compression**: Gzip compression enabled on the backend to minimize network transfer weight.
- **Lazy Loading**: Frontend images load only as they enter the viewport to improve initial TTI (Time to Interactive).

## 📦 Setup Instructions

### 1. Prerequisites
- Node.js & npm
- Python 3.10+
- **PostgreSQL**: Running locally or on a cloud provider.
- **TMDB API Key**: Register at [TMDB](https://www.themoviedb.org/) to get an API Key.

### 2. Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Create virtual environment: `python -m venv .venv`
3. Activate it:
   - Windows: `.\.venv\Scripts\activate`
   - Linux/Mac: `source .venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file (copy `.env.example`) and add your `TMDB_API_KEY` and `DATABASE_URL`.
6. Run server: `uvicorn main:app --reload`

### 3. Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open `http://localhost:5173` (Vite default) in your browser.

## 🧠 Recommendation Logic
The system tracks your "Liked" movies and "Watch History". It then uses a hybrid similarity approach against the TMDB discovery engine to find movies with similar genres, plots, and tags to provide a "Recommended for You" row.

---
Built with ❤️ for a premium movie experience.
