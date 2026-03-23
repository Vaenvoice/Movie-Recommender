import API_BASE_URL from '../api/config';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const cardRef = useRef(null);

  // Stop trailer when card scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
          setIsHovered(false);
          setTrailerKey(null);
        }
      },
      { threshold: 0.05 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);
  
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  const API_URL = API_BASE_URL;
  const mediaType = movie.media_type || (movie.name ? 'tv' : 'movie');

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(async () => {
      setIsHovered(true);
      if (!trailerKey) {
        try {
          const res = await axios.get(`${API_URL}/movies/video/${mediaType}/${movie.id}`);
          const videos = res.data.results || [];
          const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        } catch (error) {
          console.error("Error fetching card video", error);
        }
      }
    }, 600);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05, y: -5, zIndex: 50 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative flex-none w-48 md:w-64 aspect-video bg-appleGray rounded-apple-lg overflow-hidden cursor-pointer shadow-xl group"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <img 
        src={`${IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}`} 
        alt={movie.title || movie.name}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-700 ${isHovered && trailerKey ? 'opacity-0' : 'opacity-100'}`}
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
             config={{ youtube: { playerVars: { disablekb: 1, controls: 0, modestbranding: 1, rel: 0, showinfo: 0 } } }}
             style={{ position: 'absolute', top: '-15%', left: 0 }}
           />
         </div>
      )}

      {/* Subtle Overlay on Hover */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-white text-sm font-bold truncate">{movie.title || movie.name}</p>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-[10px] text-white/70">{movie.release_date?.split('-')[0] || '2024'}</span>
          <span className="text-[10px] text-appleBlue font-bold">★ {movie.vote_average?.toFixed(1)}</span>
        </div>
      </div>
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </motion.div>
  );
};

export default MovieCard;
