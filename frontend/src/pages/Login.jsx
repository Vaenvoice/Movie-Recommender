import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login UI error:", err);
      const msg = err.response?.data?.detail || "Invalid email or password";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center font-sans px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-1">
            <span className="text-white text-3xl font-bold tracking-tight">Vaen</span>
            <span className="text-white/60 text-3xl font-light">TV+</span>
          </div>
        </div>

        <h1 className="text-white text-2xl font-bold mb-2 text-center">Sign In</h1>
        <p className="text-white/40 text-center mb-6 text-sm">Enter your account details to continue</p>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input 
            type="email" 
            placeholder="Email address" 
            className="p-3.5 bg-zinc-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-3.5 bg-zinc-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-white text-black p-3.5 rounded-xl font-bold hover:bg-white/90 active:scale-95 transition-transform mt-4 text-sm"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-white/40">Don't have an account? </span>
          <Link to="/signup" className="text-blue-400 font-medium hover:underline">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
