import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

// Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set default authorization header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchCurrentUser();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Fetch current user details from backend
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await axios.post(`${API_BASE_URL}/auth/login`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const signup = async (userData) => {
    await axios.post(`${API_BASE_URL}/auth/signup`, userData);
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Toggle movie in user watchlist
  const toggleWatchlist = async (movieId) => {
    if (!user) return;
    const isInWatchlist = user.watchlist?.includes(movieId);
    const endpoint = isInWatchlist
      ? `/user/watchlist/remove/${movieId}`
      : `/user/watchlist/add/${movieId}`;

    try {
      await axios.post(`${API_BASE_URL}${endpoint}`);
      await fetchCurrentUser();
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, toggleWatchlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
