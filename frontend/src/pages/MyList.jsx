import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus } from 'lucide-react';
import API_BASE_URL from '../api/config';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';

const MyList = () => {
  const [movies, setMovies] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.watchlist && user.watchlist.length > 0) {
      fetchWatchlist();
    } else {
      setMovies([]);
    }
  }, [user?.watchlist]);

  const fetchWatchlist = async () => {
    try {
      const promises = user.watchlist.map(id => 
        axios.get(`${API_BASE_URL}/movies/${id}`).then(res => res.data)
      );

      const results = await Promise.allSettled(promises);
      const successfulMovies = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);

      setMovies(successfulMovies);
    } catch (error) {
      console.error("Error fetching library watchlist:", error);
      setMovies([]);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen pb-24 text-white font-sans">
      <Navbar />

      <div className="pt-28 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Library</h2>
          <span className="text-sm text-white/50 bg-white/10 px-4 py-1.5 rounded-full font-medium">
            {movies.length} Title{movies.length !== 1 ? 's' : ''}
          </span>
        </div>

        {movies.length > 0 ? (
          <div className="flex flex-wrap items-start gap-6">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-24 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-xl font-bold mb-1">Your Library is Empty</h3>
            <p className="text-white/40 text-sm max-w-xs">Save your favorite movies and shows here to watch anytime.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
