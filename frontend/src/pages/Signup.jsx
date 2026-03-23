import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, login, token } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) navigate('/');
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup({ name, email, password });
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
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

          <h1 className="text-white text-3xl font-bold mb-2 text-center">Create Vaen ID</h1>
          <p className="text-white/50 text-center mb-10 text-sm">Join the Vaen TV+ community</p>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-apple mb-6 text-sm text-center">{error}</div>}
          
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="p-4 bg-white/5 border border-white/10 rounded-apple text-white focus:outline-none focus:ring-2 focus:ring-appleBlue/50 transition-all placeholder:text-white/20"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input 
              type="email" 
              placeholder="Email address" 
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
              {loading ? 'Creating Account...' : 'Continue'}
            </button>
          </form>
          
          <div className="mt-10 text-center">
             <span className="text-white/40 text-sm">Already have an Apple ID? </span>
            <Link to="/login" className="text-appleBlue hover:text-blue-400 transition-colors text-sm font-medium">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
