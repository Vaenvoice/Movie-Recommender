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
      const response = await axios.get(`${API_BASE_URL}/auth/me`, { timeout: 30000 });
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
      // Send login request with 60-second timeout for Render backend cold start
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: email,
        password: password
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      setToken(access_token);
    } catch (error) {
      console.error("Login failed:", error);
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error("Server is waking up (Render cold start). Please wait 10 seconds and click Sign In again.");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup handler
  const signup = async (userData) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, userData, {
        timeout: 60000
      });
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error("Server is waking up (Render cold start). Please wait 10 seconds and try again.");
      }
      throw error;
    }
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
