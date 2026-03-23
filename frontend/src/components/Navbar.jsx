import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-8 flex items-center justify-between ${isScrolled ? 'py-4' : 'py-6'}`} style={isScrolled ? { background: 'transparent' } : {}}>
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-1 group">
          <span className="text-white text-2xl font-bold tracking-tight group-hover:text-appleBlue transition-colors">Vaen</span>
          <span className="text-white/60 text-2xl font-light tracking-tighter">TV+</span>
        </Link>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center space-x-10 text-[15px] font-medium text-white/70">
          <Link to="/" className="hover:text-white transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-appleBlue group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/tv-shows" className="hover:text-white transition-colors relative group">
            TV Shows
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-appleBlue group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/movies" className="hover:text-white transition-colors relative group">
            Movies
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-appleBlue group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/new-popular" className="hover:text-white transition-colors relative group">
            New
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-appleBlue group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link to="/my-list" className="hover:text-white transition-colors relative group">
            Library
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-appleBlue group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-8">
        <Search 
          className="w-5 h-5 cursor-pointer text-white/50 hover:text-white transition-all hover:scale-110 active:scale-90" 
          onClick={() => navigate('/search')} 
        />
        <div className="group relative" ref={dropdownRef}>
          <div 
            className="cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center min-w-[40px] min-h-[40px] bg-white/5 rounded-full hover:bg-white/10"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
             {user?.name ? (
               <span className="text-white/50 hover:text-white font-bold text-sm uppercase tracking-widest">{user.name[0]}</span>
             ) : (
               <User className="w-5 h-5 text-white/50 hover:text-white" />
             )}
          </div>
          <div className={`absolute right-0 top-full mt-4 w-60 glass-dark rounded-apple-lg shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200 ${showUserDropdown ? 'block' : 'hidden'}`}>
            <div className="px-6 py-5 border-b border-white/5 bg-white/5">
              <p className="text-[11px] text-white/40 uppercase tracking-[2px] font-bold mb-1">Vaen ID</p>
              <p className="text-white font-semibold flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{user?.name}</span>
              </p>
            </div>
            <button onClick={logout} className="w-full text-left px-6 py-5 hover:bg-white/10 flex items-center space-x-3 text-sm text-white/90 transition-colors group/logout">
              <LogOut className="w-4 h-4 text-appleBlue group-hover/logout:translate-x-1 transition-transform" />
              <span>Sign Out Settings</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
