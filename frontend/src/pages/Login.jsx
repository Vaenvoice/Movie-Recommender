import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Redirect handled by useEffect
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden flex items-center justify-center font-sans">
      <div className="absolute inset-0 bg-gradient-to-b from-appleGray/20 to-black"></div>
      
      <div className="relative z-10 w-full max-w-[440px] px-6">
        <div className="glass-dark p-10 md:p-14 rounded-apple-lg border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-10">
            <div className="flex items-center space-x-1">
              <span className="text-white text-4xl font-bold tracking-tight">Vaen</span>
              <span className="text-white/60 text-4xl font-light tracking-tighter">TV+</span>
            </div>
          </div>

          <h1 className="text-white text-3xl font-bold mb-2 text-center">Sign In</h1>
          <p className="text-white/50 text-center mb-10 text-sm">Enter your Vaen ID to continue</p>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-apple mb-6 text-sm text-center">{error}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input 
              type="email" 
              placeholder="Email or Vaen ID" 
              className="p-4 bg-white/5 border border-white/10 rounded-apple text-white focus:outline-none focus:ring-2 focus:ring-appleBlue/50 transition-all placeholder:text-white/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="p-4 bg-white/5 border border-white/10 rounded-apple text-white focus:outline-none focus:ring-2 focus:ring-appleBlue/50 transition-all placeholder:text-white/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className={`bg-white text-black p-4 rounded-apple font-bold hover:bg-white/90 active:scale-[0.98] transition-all mt-6 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-10 text-center">
            <Link to="/signup" className="text-appleBlue hover:text-blue-400 transition-colors text-sm font-medium">Create New Vaen ID</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
