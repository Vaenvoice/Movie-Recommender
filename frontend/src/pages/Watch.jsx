import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player/youtube';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import API_BASE_URL from '../api/config';

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trailerUrl, setTrailerUrl] = useState('');
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetchTrailer();
  }, [id]);

  const fetchTrailer = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${id}`);
      setMovie(response.data);
      const videos = response.data.videos?.results || [];
      const trailer = videos.find(v => v.type === 'Trailer') || videos[0];
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
      }

      // Record watch history
      await axios.post(`${API_BASE_URL}/user/history/add/${id}`);
    } catch (error) {
      console.error("Error fetching watch trailer:", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden font-sans">
      <div className="absolute top-6 left-6 z-50 flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="bg-black/60 p-3 rounded-full hover:bg-black/80 text-white transition-colors border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest block">Now Playing</span>
          <h2 className="text-white text-xl font-bold">{movie?.title}</h2>
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
          <div className="h-full w-full flex items-center justify-center text-white/60 text-lg">
            Trailer video not available for this movie.
          </div>
        )}
      </div>
    </div>
  );
};

export default Watch;
