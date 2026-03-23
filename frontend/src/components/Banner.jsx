import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ReactPlayer from 'react-player/youtube';

const Banner = ({ movie }) => {
  const navigate = useNavigate();
  const { user, toggleWatchlist } = useAuth();
  const [trailerKey, setTrailerKey] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const bannerRef = useRef(null);
  const playerRef = useRef(null);

  // Track visibility with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    if (bannerRef.current) observer.observe(bannerRef.current);
    return () => observer.disconnect();
  }, []);

  // Forcefully mute/unmute the YouTube player when scrolling in/out of view
  useEffect(() => {
    if (!playerRef.current) return;
    try {
      const internal = playerRef.current.getInternalPlayer();
      if (!internal) return;
      if (!isVisible) {
        if (internal.mute) internal.mute();
      } else if (!isMuted) {
        if (internal.unMute) internal.unMute();
      }
    } catch (e) { /* ignore - player not ready yet */ }
  }, [isVisible, isMuted]);

  // Fetch trailer when movie changes, reset old trailer
  useEffect(() => {
    if (!movie) return;
    
    // Reset state for new movie
    setTrailerKey(null);
    setShowVideo(false);

    const fetchVideo = async () => {
      try {
        const mediaType = movie.media_type || (movie.name ? 'tv' : 'movie');
        const res = await axios.get(`http://127.0.0.1:8000/movies/video/${mediaType}/${movie.id}`);
        const videos = res.data.results || [];
        const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
        
        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setTrailerKey(null);
        }
      } catch (error) {
        console.error("Error fetching video for banner", error);
        setTrailerKey(null);
      }
    };

    fetchVideo();

    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [movie]);

  if (!movie) return <div className="h-[80vh] bg-black"></div>;

  const isInWatchlist = user?.watchlist?.includes(movie.id);

  // Should the trailer be actively playing right now?
  const shouldPlay = showVideo && isVisible;

  return (
    <header ref={bannerRef} className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-black">
        {(!showVideo || !trailerKey) && (
          <img 
            src={`https://image.tmdb.org/t/p/original${movie?.backdrop_path}`} 
            alt={movie?.title || movie?.name} 
            className={`w-full h-full object-cover transition-opacity duration-1000 ${showVideo && trailerKey ? 'opacity-0' : 'opacity-100'}`}
          />
        )}
        
        {trailerKey && (
           <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${showVideo ? 'opacity-100' : 'opacity-0'}`}>
             <ReactPlayer 
               ref={playerRef}
               url={`https://www.youtube.com/watch?v=${trailerKey}`}
               width="100%"
               height="120%"
               playing={shouldPlay}
               muted={!isVisible || isMuted}
               loop={true}
               config={{ youtube: { playerVars: { disablekb: 1, controls: 0, modestbranding: 1, rel: 0, showinfo: 0, iv_load_policy: 3 } } }}
               style={{ position: 'absolute', top: '-10%', left: 0, pointerEvents: 'none' }}
             />
           </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40 z-10 pointer-events-none"></div>

        {/* Sound Toggle Button */}
        {trailerKey && showVideo && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="absolute bottom-32 md:bottom-24 right-6 md:right-12 z-50 p-3 rounded-full bg-black/40 border border-white/20 hover:bg-black/80 transition-all duration-300 backdrop-blur-md group"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-white/80 group-hover:text-white" /> : <Volume2 className="w-5 h-5 text-white/80 group-hover:text-white" />}
          </button>
        )}
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pt-20 z-20 pointer-events-none">
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          {movie?.title || movie?.name}
        </h1>
        <p className="text-lg md:text-xl text-white/80 line-clamp-3 mb-10 max-w-2xl font-medium leading-relaxed">
          {movie?.overview}
        </p>
        
        <div className="flex items-center space-x-4 pointer-events-auto">
          <button 
            onClick={() => navigate(`/watch/${movie.id}`)}
            className="flex items-center space-x-3 bg-white text-black px-8 py-4 rounded-apple-lg font-bold hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Play Now</span>
          </button>
          
          <button 
            onClick={() => toggleWatchlist(movie.id)}
            className={`flex items-center space-x-3 text-white px-8 py-4 rounded-apple-lg font-bold transition-all duration-300 border border-white/20 active:scale-95 ${isInWatchlist ? 'bg-appleBlue border-appleBlue shadow-lg shadow-appleBlue/20' : 'glass hover:bg-white/20'}`}
          >
            {isInWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            <span>{isInWatchlist ? 'In Library' : 'Add to Library'}</span>
          </button>

          <button 
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="flex items-center space-x-3 glass text-white px-8 py-4 rounded-apple-lg font-bold md:hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <Info className="w-6 h-6" />
            <span>Details</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Banner;
