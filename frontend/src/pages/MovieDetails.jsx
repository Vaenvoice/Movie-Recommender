import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Row from '../components/Row';
import { Play, Plus, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWatchlist } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const API_URL = "http://127.0.0.1:8000";

  const isInWatchlist = user?.watchlist?.includes(Number(id));

  useEffect(() => {
    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/${id}`);
      setMovie(response.data);
      setSimilar(response.data.similar?.results || []);
    } catch (error) {
      console.error("Error fetching movie details", error);
    }
  };

  if (!movie) return <div className="h-screen bg-background flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-background min-h-screen pb-24 font-sans text-white">
      <Navbar />
      
      {/* Immersive Backdrop Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <img 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60"></div>
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-24 right-8 glass p-3 rounded-full hover:bg-white/20 transition-all z-50 group active:scale-90"
        >
          <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
        </button>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-12">
          <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tight leading-none drop-shadow-2xl">
            {movie.title}
          </h1>
          
          <div className="flex items-center space-x-6 mb-8 text-sm md:text-lg font-medium text-white/80">
            <span className="text-appleBlue font-bold tracking-wider">★ {movie.vote_average.toFixed(1)}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>{movie.release_date?.split('-')[0]}</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="px-2 py-0.5 border border-white/20 rounded-sm text-xs font-bold">4K</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span>{movie.runtime} min</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            <button 
              onClick={() => navigate(`/watch/${id}`)}
              className="flex items-center space-x-3 bg-white text-black px-10 py-4 rounded-apple-lg font-bold hover:scale-105 transition-all shadow-xl active:scale-95"
            >
              <Play className="fill-current w-6 h-6" />
              <span>Watch Now</span>
            </button>
            <button 
              onClick={() => toggleWatchlist(Number(id))}
              className={`flex items-center space-x-3 text-white px-10 py-4 rounded-apple-lg font-bold transition-all border border-white/10 active:scale-95 ${isInWatchlist ? 'bg-appleBlue border-appleBlue shadow-lg shadow-appleBlue/20' : 'glass hover:bg-white/20'}`}
            >
              {isInWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              <span>{isInWatchlist ? 'In Library' : 'Add to Library'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview & Credits Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 relative z-30">
        <div className="glass-dark p-8 md:p-12 rounded-apple-lg border border-white/5 shadow-2xl">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             <div className="md:col-span-2">
               <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-4">Overview</h3>
               <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                 {movie.overview}
               </p>
             </div>
             
             <div className="space-y-8">
               <div>
                 <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-3">Starring</h3>
                 <div className="flex flex-wrap gap-2">
                   {movie.credits?.cast?.slice(0, 5).map(person => (
                     <span key={person.id} className="text-white/90 hover:text-appleBlue cursor-pointer transition-colors">
                       {person.name}
                     </span>
                   )).reduce((prev, curr) => [prev, <span className="text-white/20">•</span>, curr])}
                 </div>
               </div>
               
               <div>
                  <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-3">Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/50">Genre</span>
                      <span>{movie.genres?.map(g => g.name).join(', ')}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-white/50">Status</span>
                      <span>{movie.status || 'Released'}</span>
                    </div>
                  </div>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="mt-24">
        <Row title="Recommended collection" movies={similar} />
      </div>
    </div>
  );
};

export default MovieDetails;
