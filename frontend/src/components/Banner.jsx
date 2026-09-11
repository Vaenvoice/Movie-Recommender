import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { VolumeX, Volume2, Play, Check, Plus, Info } from 'lucide-react';
import API_BASE_URL from '../api/config';

const Banner = ({ movie }) => {
  const navigate = useNavigate();
  const { user, toggleWatchlist } = useAuth();
  const [trailerKey, setTrailerKey] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  
  useEffect(() => {
    if (!movie) return;

    setTrailerKey(null);
    setShowVideo(false);

    // Fetch trailer video key from TMDB API
    const fetchVideo = async () => {
      try {
        const mediaType = movie.media_type || (movie.name ? 'tv' : 'movie');
        const res = await axios.get(`${API_BASE_URL}/movies/video/${mediaType}/${movie.id}`);
        const videos = res.data.results || [];
        const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching banner trailer", error);
      }
    };

    fetchVideo();

    // Delayed auto-play trailer after 2.5 seconds
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [movie]);

  if (!movie) return <div className="h-[75vh] bg-zinc-950"></div>;

  const isInWatchlist = user?.watchlist?.includes(movie.id);

  return (
    <header className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image / Video Player */}
      <div className="absolute inset-0">
        {(!showVideo || !trailerKey) && (
          <img 
            src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} 
            alt={movie?.title || movie?.name} 
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
        )}

        {trailerKey && showVideo && (
          <div className="absolute inset-0 w-full h-full">
            <ReactPlayer 
              url={`https://www.youtube.com/watch?v=${trailerKey}`}
              width="100%"
              height="120%"
              playing={true}
              muted={isMuted}
              loop={true}
              config={{ youtube: { playerVars: { disablekb: 1, controls: 0, modestbranding: 1, rel: 0 } } }}
              style={{ position: 'absolute', top: '-10%', left: 0, pointerEvents: 'none' }}
            />
          </div>
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-transparent to-zinc-950/60 pointer-events-none"></div>

        {/* Sound Toggle Button */}
        {trailerKey && showVideo && (
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="absolute bottom-28 right-8 z-30 p-3 rounded-full bg-black/60 border border-white/20 hover:bg-black/80 transition-all text-white"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Banner Movie Info */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pt-16 z-20 pointer-events-none">
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 tracking-tight leading-tight">
          {movie?.title || movie?.name}
        </h1>
        <p className="text-base md:text-lg text-white/80 line-clamp-3 mb-8 max-w-2xl font-light">
          {movie?.overview}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 pointer-events-auto">
          <button 
            onClick={() => navigate(`/watch/${movie.id}`)}
            className="flex items-center space-x-2 bg-white text-black px-7 py-3.5 rounded-xl font-bold hover:bg-white/90 transition-transform active:scale-95 shadow-lg"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Play</span>
          </button>

          <button 
            onClick={() => toggleWatchlist(movie.id)}
            className={`flex items-center space-x-2 px-7 py-3.5 rounded-xl font-bold transition-colors border border-white/20 text-white ${isInWatchlist ? 'bg-blue-600 border-blue-600' : 'bg-white/10 hover:bg-white/20 backdrop-blur-md'}`}
          >
            {isInWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            <span>{isInWatchlist ? 'In Library' : 'Add to Library'}</span>
          </button>

          <button 
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-7 py-3.5 rounded-xl font-bold transition-colors border border-white/20"
          >
            <Info className="w-5 h-5" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Banner;
