import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';

const Home = () => {
  const [originals, setOriginals] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const endpoints = [
        `${API_BASE_URL}/movies/discover?genre_id=878`,
        `${API_BASE_URL}/movies/trending`,
        `${API_BASE_URL}/movies/top-rated`,
        `${API_BASE_URL}/recommend/personalized`
      ];

      const results = await Promise.allSettled(endpoints.map(url => axios.get(url)));
      const [origRes, trendRes, topRes, recRes] = results;

      if (origRes.status === 'fulfilled') setOriginals(origRes.value.data.results || []);
      if (trendRes.status === 'fulfilled') {
        const movies = trendRes.value.data.results || [];
        setPopular(movies);
        if (movies.length > 0) {
          setHeroMovie(movies[Math.floor(Math.random() * movies.length)]);
        }
      }
      if (topRes.status === 'fulfilled') setTopRated(topRes.value.data.results || []);
      if (recRes.status === 'fulfilled') setPersonalized(recRes.value.data || []);

    } catch (error) {
      console.error("Error fetching home page data:", error);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen pb-20 text-white font-sans">
      <Navbar />
      <Banner movie={heroMovie} />
      
      <div className="relative -mt-10 z-20 max-w-7xl mx-auto">
        <div className="space-y-8">
          <Row title="Vaen Originals" movies={originals} />
          <Row title="Trending Now" movies={popular} />
          <Row title="Top Rated" movies={topRated} />
          <Row title="Selected For You" movies={personalized} />
        </div>
      </div>
    </div>
  );
};

export default Home;
