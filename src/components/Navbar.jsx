import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
            <span className="text-primary-600 font-bold text-lg">k</span>
          </div>
          <span className="text-xl font-bold tracking-wide">kartifys</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm hover:text-primary-100 transition-colors">Home</Link>
          <Link to="/products" className="text-sm hover:text-primary-100 transition-colors">Products</Link>
          {user ? (
            <>
              <Link to="/orders" className="text-sm hover:text-primary-100 transition-colors">My Orders</Link>
              <div className="flex items-center gap-3">
                <span className="text-sm text-primary-100">Hi, {user.username}</span>
                <button
                  onClick={logoutUser}
                  className="text-sm bg-white text-primary-600 px-3 py-1.5 rounded-lg font-medium hover:bg-primary-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm hover:text-primary-100 transition-colors">Login</Link>
              <Link to="/register" className="text-sm bg-white text-primary-600 px-3 py-1.5 rounded-lg font-medium hover:bg-primary-50 transition-colors">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-700 px-4 py-3 space-y-2">
          <Link to="/" className="block text-sm py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="block text-sm py-2" onClick={() => setMenuOpen(false)}>Products</Link>
          {user ? (
            <>
              <Link to="/orders" className="block text-sm py-2" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <button onClick={logoutUser} className="block text-sm py-2 text-red-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm py-2" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block text-sm py-2" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}