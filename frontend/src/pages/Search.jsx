import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search as SearchIcon } from 'lucide-react';
import API_BASE_URL from '../api/config';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchTrending = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/trending`);
      setTrendingMovies(response.data.results || []);
    } catch (error) {
      console.error("Error fetching trending search items:", error);
    }
  };

  const performSearch = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/search`, { params: { query } });
      setResults(response.data.results || []);
    } catch (error) {
      console.error("Search API error:", error);
    }
  };

  const displayMovies = query ? results : trendingMovies;
  const sectionTitle = query ? (results.length > 0 ? 'Search Results' : '') : 'Trending Now';

  return (
    <div className="bg-zinc-950 min-h-screen pb-24 text-white font-sans">
      <Navbar />

      <div className="pt-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Search Movies & TV</h1>
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by title, genre..." 
              className="w-full bg-zinc-900 text-white pl-12 pr-4 py-4 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {displayMovies.length > 0 ? (
          <div>
            <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-6">{sectionTitle}</h3>
            <div className="flex flex-wrap items-start gap-6">
              {displayMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center text-white/40 mt-20">
            <p className="text-xl">No results found for "{query}"</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
