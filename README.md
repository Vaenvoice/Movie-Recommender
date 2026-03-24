# Vaen TV+ 🎬

[![Live Demo](https://img.shields.io/badge/Live-Demo-0071e3?style=for-the-badge&logo=vercel)](https://vaentv.vercel.app/)

A premium, high-fidelity movie discovery and streaming platform inspired by the sleek aesthetics of Apple TV. Built with a modern full-stack architecture, featuring personalized AI recommendations and an immersive user experience.

![Vaen TV+ Dashboard](docs/dashboard_real.png)

## ✨ Premium Experience

Vaen TV+ is designed for those who appreciate visual excellence. With a focus on **glassmorphism**, **vibrant typography**, and **fluid animations**, it offers more than just a movie list—it offers a cinematic journey.

### 🌟 Key Features

- **Vaen ID Auth**: Secure, unified authentication system (Rebranded from Apple ID).
- **Immersive UI**: Glassmorphic components, backdrop-driven dynamic themes, and smooth Framer Motion transitions.
- **AI-Powered Discovery**: Intelligent "Recommended for You" engine using content-based filtering.
- **Cinematic Trailers**: Integrated high-definition video player with auto-play previews.
- **Smart Search**: Real-time, debounced global search across thousands of titles via TMDB.
- **Personal Library**: One-click watchlist management to save your favorite movies and shows.

---

## 🚀 Quick Start

### Live Link
Access the production deployment here: [**https://vaentv.vercel.app/**](https://vaentv.vercel.app/)

### Local Installation

#### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# Activate venv: .\.venv\Scripts\activate (Windows) or source .venv/bin/activate (Unix)
pip install -r requirements.txt
# Configure .env with TMDB_API_KEY and DATABASE_URL
uvicorn main:app --reload
```

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🛠️ Tech Stack

- **Frontend**: `React 18`, `Vite`, `Tailwind CSS`, `Framer Motion`, `Lucide React`.
- **Backend**: `FastAPI`, `SQLAlchemy`, `PostgreSQL`, `Scikit-Learn` (ML).
- **External API**: `TMDB API` for real-time movie metadata.

---

## 🏗️ Project Architecture

The platform follows a modern full-stack decoupled architecture:

```mermaid
graph TD
    User((User)) -->|Interacts| FE[React Frontend]
    FE -->|API Calls / JWT| BE[FastAPI Backend]
    BE -->|SQLAlchemy| DB[(PostgreSQL)]
    BE -->|External Data| TMDB[TMDB API]
    BE -->|Content Filtering| RE[Recommendation Engine]
    RE -.->|Scikit-Learn| BE
```

### 💻 Frontend (Client)
- **Framework**: `React 18` with `Vite` for ultra-fast HMR.
- **Styling**: `Tailwind CSS` for a bespoke premium look.
- **Animations**: `Framer Motion` for fluid cinematic transitions.
- **Navigation**: `react-router-dom` for seamless SPA experience.
- **Auth**: Rebranded "Vaen ID" authentication context.

### ⚙️ Backend (Server)
- **Framework**: `FastAPI` (Python) for high-performance async processing.
- **ORM**: `SQLAlchemy` for robust database management.
- **Data**: `PostgreSQL` for persistent user and watchlist storage.
- **Security**: JWT-based authentication and GZip compression.

### 🤖 AI Recommendation Engine
- **Model**: Content-based filtering using `Scikit-Learn`.
- **Logic**: Analyzes movie genres, overviews, and keywords to calculate cosine similarity.
- **Integration**: Real-time suggestion generation based on user's current view and history.

---

## 🔄 Workflow

### 🛠️ Development Lifecycle
1.  **Feature Inception**: Define new cinematic features or UI enhancements.
2.  **Environment Setup**: Activate `.venv` (Backend) and `npm install` (Frontend).
3.  **Local Testing**: Run `uvicorn main:app` and `npm run dev` concurrently.
4.  **Schema Migrations**: Update SQLAlchemy models for any new data requirements.

### 🚀 Deployment Strategy
- **Frontend**: Automated CI/CD via **Vercel** (triggering on `main` branch push).
- **Backend**: Hosted on **Render** with a managed PostgreSQL instance.
- **Static Assets**: Movie posters and backdrops served directly from TMDB CDN.

---

## 🎨 Design Philosophy

The project adheres to "Google Health" inspired minimalism merged with "Apple" premium aesthetics:
- **SF Pro** inspired typography for maximum readability.
- **Subtle Gradients** and depth through multi-layered shadows.
- **Micro-interactions** that make the interface feel alive.

Created with passion for the ultimate viewing experience. 🍿
