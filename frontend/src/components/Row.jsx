import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

const Row = ({ title, movies = [] }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="space-y-3 px-6 md:px-12 my-8 group/row">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
      </div>

      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute top-0 bottom-0 left-0 z-40 my-auto h-10 w-10 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center bg-black/70 hover:bg-black text-white rounded-full -ml-4 border border-white/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div 
          ref={rowRef}
          className="flex items-center space-x-4 overflow-x-scroll no-scrollbar scroll-smooth py-3"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute top-0 bottom-0 right-0 z-40 my-auto h-10 w-10 opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center bg-black/70 hover:bg-black text-white rounded-full -mr-4 border border-white/10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Row;
