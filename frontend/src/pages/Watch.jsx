import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trailerUrl, setTrailerUrl] = useState('');
  const [movie, setMovie] = useState(null);
  const API_URL = "http://localhost:8000";

  useEffect(() => {
    fetchTrailer();
  }, [id]);

  const fetchTrailer = async () => {
    try {
      const response = await axios.get(`${API_URL}/movies/${id}`);
      setMovie(response.data);
      const videos = response.data.videos?.results || [];
      const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
      }
      
      // Add to watch history on backend
      await axios.post(`${API_URL}/user/history/add/${id}`);
    } catch (error) {
      console.error("Error fetching trailer", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden font-sans">
      <div className="absolute top-8 left-8 z-50 flex items-center space-x-6">
        <button 
          onClick={() => navigate(-1)}
          className="glass p-3 rounded-full hover:bg-white/20 transition-all active:scale-90"
        >
          <ArrowLeft className="text-white w-6 h-6" />
        </button>
        <div className="flex flex-col">
          <span className="text-white/40 text-xs font-bold uppercase tracking-widest leading-none mb-1">Now Playing</span>
          <h2 className="text-white text-2xl font-bold tracking-tight">
            {movie?.title}
          </h2>
        </div>
      </div>
      
      <div className="flex-1 w-full h-full">
        {trailerUrl ? (
          <ReactPlayer
            url={trailerUrl}
            width="100%"
            height="100%"
            playing
            controls
            onEnded={() => navigate(-1)}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white text-2xl">
            No trailer available for this title.
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;
