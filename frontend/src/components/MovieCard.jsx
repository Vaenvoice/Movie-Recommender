import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import API_BASE_URL from '../api/config';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const mediaType = movie.media_type || (movie.name ? 'tv' : 'movie');

  // Handle mouse enter with slight delay before fetching trailer preview
  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(async () => {
      setIsHovered(true);
      if (!trailerKey) {
        try {
          const res = await axios.get(`${API_BASE_URL}/movies/video/${mediaType}/${movie.id}`);
          const videos = res.data.results || [];
          const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        } catch (error) {
          console.error("Card video fetch error:", error);
        }
      }
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="relative flex-none w-48 md:w-64 aspect-video bg-zinc-900 rounded-xl overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:scale-105 hover:z-30 group"
    >
      <img 
        src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`} 
        alt={movie.title || movie.name}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-500 ${isHovered && trailerKey ? 'opacity-0' : 'opacity-100'}`}
      />

      {isHovered && trailerKey && (
        <div className="absolute inset-0 w-full h-full bg-black pointer-events-none">
          <ReactPlayer 
            url={`https://www.youtube.com/watch?v=${trailerKey}`}
            width="100%"
            height="130%"
            playing={true}
            muted={true}
            loop={true}
            config={{ youtube: { playerVars: { disablekb: 1, controls: 0, modestbranding: 1, rel: 0 } } }}
            style={{ position: 'absolute', top: '-15%', left: 0 }}
          />
        </div>
      )}

      {/* Overlay details */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs md:text-sm font-bold truncate">{movie.title || movie.name}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-[10px] text-white/70">{movie.release_date?.split('-')[0] || '2024'}</span>
          <span className="text-[10px] text-blue-400 font-bold">★ {movie.vote_average?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
