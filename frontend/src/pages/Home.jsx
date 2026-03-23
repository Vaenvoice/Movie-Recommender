import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [personalized, setPersonalized] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  
  const API_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const endpoints = [
        `${API_URL}/movies/discover?genre_id=878`,
        `${API_URL}/movies/trending`,
        `${API_URL}/movies/top-rated`,
        `${API_URL}/recommend/personalized`
      ];

      const results = await Promise.allSettled(endpoints.map(url => axios.get(url)));
      
      const [originalRes, trendRes, topRes, recommendRes] = results;

      if (originalRes.status === 'fulfilled') setTrending(originalRes.value.data.results || []);
      if (trendRes.status === 'fulfilled') {
        const movies = trendRes.value.data.results || [];
        setPopular(movies);
        if (movies.length > 0) {
          setHeroMovie(movies[Math.floor(Math.random() * movies.length)]);
        }
      }
      if (topRes.status === 'fulfilled') setTopRated(topRes.value.data.results || []);
      if (recommendRes.status === 'fulfilled') setPersonalized(recommendRes.value.data || []);

    } catch (error) {
      console.error("Error fetching homepage data", error);
    }
  };

  return (
    <div className="relative pb-24 bg-background min-h-screen">
      <Navbar />
      <Banner movie={heroMovie} />
      
      <div className="relative -mt-4 md:-mt-8 z-20 max-w-7xl mx-auto">
        <div className="space-y-16">
          <Row title="Vaen Originals" movies={trending} />
          <Row title="Recently Added" movies={popular} />
          <Row title="Critics' Choice" movies={topRated} />
          <Row title="Selected for You" movies={personalized} />
        </div>
      </div>
    </div>
  );
};

export default Home;
