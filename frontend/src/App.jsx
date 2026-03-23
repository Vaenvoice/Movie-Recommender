import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MovieDetails from './pages/MovieDetails';
import Watch from './pages/Watch';
import Search from './pages/Search';

import Category from './pages/Category';
import MyList from './pages/MyList';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-black text-white">Loading...</div>;
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="bg-background min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/tv-shows" element={<PrivateRoute><Category type="tv" /></PrivateRoute>} />
          <Route path="/movies" element={<PrivateRoute><Category type="movie" /></PrivateRoute>} />
          <Route path="/new-popular" element={<PrivateRoute><Category type="new" /></PrivateRoute>} />
          <Route path="/my-list" element={<PrivateRoute><MyList /></PrivateRoute>} />
          <Route path="/movie/:id" element={<PrivateRoute><MovieDetails /></PrivateRoute>} />
          <Route path="/watch/:id" element={<PrivateRoute><Watch /></PrivateRoute>} />
          <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
