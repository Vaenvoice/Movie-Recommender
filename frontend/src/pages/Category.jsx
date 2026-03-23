import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import MovieCard from '../components/MovieCard';

const Category = ({ type }) => {
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchGenres();
  }, [type]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setShowFilters(false);
      if (sortRef.current && !sortRef.current.contains(event.target)) setShowSort(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [type, selectedGenre, sortBy]);

  const fetchGenres = async () => {
    try {
      const mediaType = type === 'tv' ? 'tv' : 'movie';
      // We need a way to get TV genres specifically if type is tv
      // I'll check if the backend has an endpoint for that or just update it
      const res = await axios.get(`${API_URL}/movies/genres/list?type=${mediaType}`);
      setGenres(res.data.genres || []);
    } catch (error) {
      console.error("Error fetching genres", error);
    }
  };

  const fetchMovies = async () => {
    try {
      let mediaType = type === 'tv' ? 'tv' : 'movie';
      const endpoint = selectedGenre || sortBy !== 'popularity.desc' 
        ? `${API_URL}/movies/discover?type=${mediaType}&genre_id=${selectedGenre}&sort_by=${sortBy}`
        : `${API_URL}/movies/popular?type=${mediaType}`;
      
      const res = await axios.get(endpoint);
      const results = res.data.results;
      console.log("Category fetched movies:", results?.length, "for", {type, selectedGenre, sortBy});
      setMovies(results || []);
      
      // Update hero movie only if it doesn't exist or is not in the current filter results
      if (results?.length > 0 && (!heroMovie || !results.some(m => m.id === heroMovie.id))) {
        setHeroMovie(results[Math.floor(Math.random() * results.length)]);
      }
    } catch (error) {
      console.error("Error fetching category data", error);
    }
  };

  const getTitle = () => {
    switch(type) {
      case 'tv': return 'TV Shows';
      case 'movie': return 'Movies';
      case 'new': return 'New & Popular';
      default: return 'Explore';
    }
  };

  return (
    <div className="bg-background min-h-screen pb-24 font-sans text-white">
      <Navbar />
      <Banner movie={heroMovie} />
      
      <div className="px-6 md:px-12 relative -mt-4 md:-mt-8 z-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{getTitle()}</h2>
          <div className="flex space-x-4">
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`glass px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center space-x-2 ${showFilters ? 'bg-white text-black border-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <span>{selectedGenre ? genres.find(g => g.id.toString() === selectedGenre)?.name : 'Filters'}</span>
                <span className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>▾</span>
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-3 w-64 glass-dark rounded-2xl shadow-2xl py-3 border border-white/10 z-[60] max-h-96 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                  <div 
                    onClick={() => { setSelectedGenre(''); setShowFilters(false); }}
                    className={`px-5 py-2.5 text-sm cursor-pointer transition-colors ${selectedGenre === '' ? 'text-appleBlue bg-white/5' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                  >
                    All Genres
                  </div>
                  {genres.map(genre => (
                    <div 
                      key={genre.id}
                      onClick={() => { setSelectedGenre(genre.id.toString()); setShowFilters(false); }}
                      className={`px-5 py-2.5 text-sm cursor-pointer transition-colors ${selectedGenre === genre.id.toString() ? 'text-appleBlue bg-white/5' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={sortRef}>
              <button 
                onClick={() => setShowSort(!showSort)}
                className={`glass px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center space-x-2 ${showSort ? 'bg-white text-black border-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                <span>Sort</span>
                <span className={`transition-transform duration-300 ${showSort ? 'rotate-180' : ''}`}>▾</span>
              </button>

              {showSort && (
                <div className="absolute right-0 mt-3 w-56 glass-dark rounded-2xl shadow-2xl py-3 border border-white/10 z-[60] animate-in fade-in zoom-in-95 duration-200">
                  {[
                    { label: 'Popularity', value: 'popularity.desc' },
                    { label: 'Newest First', value: 'release_date.desc' },
                    { label: 'Oldest First', value: 'release_date.asc' },
                    { label: 'Top Rated', value: 'vote_average.desc' },
                    { label: 'Alphabetical', value: 'original_title.asc' }
                  ].map(option => (
                    <div 
                      key={option.value}
                      onClick={() => { setSortBy(option.value); setShowSort(false); }}
                      className={`px-5 py-2.5 text-sm cursor-pointer transition-colors ${sortBy === option.value ? 'text-appleBlue bg-white/5' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-start gap-x-10 gap-y-16">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
