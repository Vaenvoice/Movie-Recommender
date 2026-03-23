import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const API_URL = API_BASE_URL;

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async (movieId) => {
    if (!user) return;
    const isInWatchlist = user.watchlist?.includes(movieId);
    const endpoint = isInWatchlist ? `/user/watchlist/remove/${movieId}` : `/user/watchlist/add/${movieId}`;
    
    try {
      await axios.post(`${API_URL}${endpoint}`);
      // Refresh user data to get updated watchlist
      await fetchCurrentUser();
    } catch (error) {
      console.error("Error toggling watchlist", error);
    }
  };

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await axios.post(`${API_URL}/auth/login`, formData);
    const { access_token } = response.data;
    localStorage.setItem('token', access_token);
    setToken(access_token);
  };

  const signup = async (userData) => {
    await axios.post(`${API_URL}/auth/signup`, userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, toggleWatchlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
