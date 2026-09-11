import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import MovieCard from '../components/MovieCard';

const Category = ({ type }) => {
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  useEffect(() => {
    fetchGenres();
  }, [type]);

  useEffect(() => {
    fetchMovies();
  }, [type, selectedGenre, sortBy]);

  const fetchGenres = async () => {
    try {
      const mediaType = type === 'tv' ? 'tv' : 'movie';
      const res = await axios.get(`${API_BASE_URL}/movies/genres/list?type=${mediaType}`);
      setGenres(res.data.genres || []);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchMovies = async () => {
    try {
      const mediaType = type === 'tv' ? 'tv' : 'movie';
      const endpoint = (selectedGenre || sortBy !== 'popularity.desc')
        ? `${API_BASE_URL}/movies/discover?type=${mediaType}&genre_id=${selectedGenre}&sort_by=${sortBy}`
        : `${API_BASE_URL}/movies/popular?type=${mediaType}`;

      const res = await axios.get(endpoint);
      const results = res.data.results || [];
      setMovies(results);

      if (results.length > 0 && !heroMovie) {
        setHeroMovie(results[Math.floor(Math.random() * results.length)]);
      }
    } catch (error) {
      console.error("Error fetching category movies:", error);
    }
  };

  const getPageTitle = () => {
    switch (type) {
      case 'tv': return 'TV Shows';
      case 'movie': return 'Movies';
      case 'new': return 'New & Popular';
      default: return 'Explore';
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen pb-24 text-white font-sans">
      <Navbar />
      <Banner movie={heroMovie} />

      <div className="px-6 md:px-12 relative -mt-8 z-20 max-w-7xl mx-auto">
        {/* Category Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{getPageTitle()}</h2>
          
          <div className="flex flex-wrap gap-4">
            {/* Genre Filter */}
            <select 
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-zinc-900 border border-white/20 text-white text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>

            {/* Sort Filter */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-white/20 text-white text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popularity.desc">Most Popular</option>
              <option value="release_date.desc">Newest First</option>
              <option value="release_date.asc">Oldest First</option>
              <option value="vote_average.desc">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Movie Grid */}
        <div className="flex flex-wrap items-start gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
