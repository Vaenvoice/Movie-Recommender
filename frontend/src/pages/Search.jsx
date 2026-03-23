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
  const API_URL = API_BASE_URL;

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchTrending = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/trending`);
      setTrendingMovies(response.data.results || []);
    } catch (error) {
      console.error("Error fetching trending", error);
    }
  };

  const performSearch = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/search`, { params: { query } });
      setResults(response.data.results || []);
    } catch (error) {
      console.error("Search error", error);
    }
  };

  const displayMovies = query ? results : trendingMovies;
  const sectionTitle = query
    ? (results.length > 0 ? 'Top Results' : null)
    : 'Trending Now';

  return (
    <div className="bg-background min-h-screen pb-24 font-sans">
      <Navbar />
      
      <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="relative w-full max-w-3xl mx-auto mb-20 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-8 tracking-tight">Search</h1>
          <div className="relative group">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-6 h-6 group-focus-within:text-appleBlue transition-colors" />
            <input 
              type="text" 
              placeholder="Movies, TV Shows, and More" 
              className="w-full glass bg-white/5 text-white p-5 pl-16 rounded-apple-lg focus:outline-none focus:ring-4 focus:ring-appleBlue/20 text-xl transition-all placeholder:text-white/20"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {displayMovies.length > 0 ? (
          <div>
            <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-8">{sectionTitle}</h3>
            <div className="flex flex-wrap items-start gap-x-10 gap-y-16">
              {displayMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center text-white/40 mt-32">
            <p className="text-2xl font-light italic">No results found for "{query}"</p>
            <p className="mt-2 text-sm">Check the spelling or try a different title.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;

