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
  const API_URL = API_BASE_URL;

  useEffect(() => {
    if (user?.watchlist && user.watchlist.length > 0) {
      fetchWatchlist();
    } else {
      setMovies([]);
    }
  }, [user?.watchlist]);

  const fetchWatchlist = async () => {
    try {
      const moviePromises = user.watchlist.map(id => 
        axios.get(`${API_URL}/movies/${id}`).then(res => res.data)
      );
      
      const results = await Promise.allSettled(moviePromises);
      const successfulMovies = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
        
      setMovies(successfulMovies);
    } catch (error) {
      console.error("Error fetching watchlist", error);
      setMovies([]);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-24 font-sans text-white">
      <Navbar />
      
      <div className="pt-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Library</h2>
          <div className="glass px-6 py-2 rounded-full text-sm font-bold text-white/60">
            {movies.length} Title{movies.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        {movies.length > 0 ? (
          <div className="flex flex-wrap items-start gap-x-10 gap-y-16">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-32 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Plus className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Your Library is Empty</h3>
            <p className="text-white/40 max-w-xs">Add movies and shows to your library to watch them later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
