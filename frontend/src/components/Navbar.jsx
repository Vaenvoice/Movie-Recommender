import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-8 flex items-center justify-between ${isScrolled ? 'py-4 bg-black/80 backdrop-blur-md' : 'py-6 bg-gradient-to-b from-black/80 to-transparent'}`}>
      {/* Brand Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-1 group">
          <span className="text-white text-2xl font-bold tracking-tight group-hover:text-blue-400 transition-colors">Vaen</span>
          <span className="text-white/60 text-2xl font-light tracking-tighter">TV+</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 flex justify-center">
        <div className="flex items-center space-x-8 text-[15px] font-medium text-white/70">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/tv-shows" className="hover:text-white transition-colors">TV Shows</Link>
          <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
          <Link to="/new-popular" className="hover:text-white transition-colors">New</Link>
          <Link to="/my-list" className="hover:text-white transition-colors">Library</Link>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center space-x-6">
        <Search 
          className="w-5 h-5 cursor-pointer text-white/60 hover:text-white transition-colors" 
          onClick={() => navigate('/search')} 
        />
        
        <div className="relative" ref={dropdownRef}>
          <div 
            className="cursor-pointer flex items-center justify-center w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user?.name ? (
              <span className="text-white font-bold text-sm uppercase">{user.name[0]}</span>
            ) : (
              <User className="w-5 h-5 text-white/70" />
            )}
          </div>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-3 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-5 py-4 border-b border-white/10">
                <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">Logged in as</p>
                <p className="text-white font-medium truncate">{user?.name || 'User'}</p>
              </div>
              <button 
                onClick={logout} 
                className="w-full text-left px-5 py-4 hover:bg-white/5 flex items-center space-x-3 text-sm text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
