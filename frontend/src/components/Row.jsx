import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const Row = ({ title, movies = [], isLargeRow = false }) => {
  const rowRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);

  const handleClick = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const onScroll = () => {
    if (rowRef.current) {
      setShowLeft(rowRef.current.scrollLeft > 0);
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-4 px-6 md:px-12 my-12 group/row">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-white/90">
          {title}
        </h2>
        <span className="text-appleBlue text-sm font-medium cursor-pointer hover:underline">See All</span>
      </div>
      
      <div className="group relative">
        <div 
          onClick={() => handleClick('left')}
          className={`absolute top-0 bottom-0 left-0 z-40 m-auto h-12 w-12 cursor-pointer opacity-0 group-hover/row:opacity-100 transition-all flex items-center justify-center glass rounded-full -ml-6 border border-white/5 active:scale-90 ${!showLeft && 'hidden'}`}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </div>

        <div 
          ref={rowRef}
          onScroll={onScroll}
          className="flex items-center space-x-5 overflow-x-scroll no-scrollbar scroll-smooth py-4"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <div 
          onClick={() => handleClick('right')}
          className="absolute top-0 bottom-0 right-0 z-40 m-auto h-12 w-12 cursor-pointer opacity-0 group-hover/row:opacity-100 transition-all flex items-center justify-center glass rounded-full -mr-6 border border-white/5 active:scale-90"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Row;
