import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Play, Check, Plus, X } from 'lucide-react';
import API_BASE_URL from '../api/config';
import Navbar from '../components/Navbar';
import Row from '../components/Row';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleWatchlist } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);

  const isInWatchlist = user?.watchlist?.includes(Number(id));

  useEffect(() => {
    fetchMovieDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
      setMovie(response.data);
      setSimilar(response.data.similar?.results || []);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  if (!movie) return <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="bg-zinc-950 min-h-screen pb-24 text-white font-sans">
      <Navbar />

      {/* Hero Backdrop Banner */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        <img 
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-24 right-8 bg-black/60 p-3 rounded-full hover:bg-black/90 transition-colors z-50 text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-12">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 drop-shadow-lg">
            {movie.title}
          </h1>

          <div className="flex items-center space-x-4 mb-6 text-sm text-white/80 font-medium">
            <span className="text-blue-400 font-bold">★ {movie.vote_average?.toFixed(1)}</span>
            <span>•</span>
            <span>{movie.release_date?.split('-')[0]}</span>
            <span>•</span>
            <span>{movie.runtime} min</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => navigate(`/watch/${id}`)}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-white/90 active:scale-95 transition-transform shadow-lg"
            >
              <Play className="fill-current w-5 h-5" />
              <span>Watch Now</span>
            </button>
            <button 
              onClick={() => toggleWatchlist(Number(id))}
              className={`flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold transition-colors border border-white/20 text-white ${isInWatchlist ? 'bg-blue-600 border-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              <span>{isInWatchlist ? 'In Library' : 'Add to Library'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Movie Information & Overview */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-30">
        <div className="bg-zinc-900/90 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-3">Overview</h3>
              <p className="text-lg text-white/90 leading-relaxed font-light">
                {movie.overview}
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">Genres</h3>
                <p className="text-white/90">{movie.genres?.map(g => g.name).join(', ')}</p>
              </div>

              <div>
                <h3 className="text-white/40 uppercase tracking-widest text-xs font-bold mb-2">Cast</h3>
                <p className="text-white/90">{movie.credits?.cast?.slice(0, 5).map(c => c.name).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Row */}
      <div className="mt-16">
        <Row title="Recommended Collection" movies={similar} />
      </div>
    </div>
  );
};

export default MovieDetails;
