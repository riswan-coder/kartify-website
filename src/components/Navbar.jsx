import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      background: '#000000', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 8px rgba(161, 5, 5, 0.75)'
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{
            width: 34, height: 34, background: '#af0000',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: '#ffffff', fontWeight: 800, fontSize: 18 }}>T</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>
            TrendKart
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }} className="desktop-nav">
          <Link to="/" style={{ color: '#c7d2fe', fontSize: 14, textDecoration: 'none' }}>Home</Link>
          <Link to="/products" style={{ color: '#c7d2fe', fontSize: 14, textDecoration: 'none' }}>Products</Link>
          {user ? (
            <>
              <Link to="/orders" style={{ color: '#c7d2fe', fontSize: 14, textDecoration: 'none' }}>My Orders</Link>
              <span style={{ color: '#c7d2fe', fontSize: 13 }}>Hi, {user.username}</span>
              <button
                onClick={logoutUser}
                style={{
                  background: '#fff', color: '#b10707',
                  border: 'none', borderRadius: 8,
                  padding: '6px 14px', fontSize: 13,
                  fontWeight: 500, cursor: 'pointer'
                }}
              >Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#c7d2fe', fontSize: 14, textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{
                background: '#fff', color: '#a70505',
                padding: '6px 14px', borderRadius: 8,
                fontSize: 13, fontWeight: 500, textDecoration: 'none'
              }}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'rgba(180, 0, 0, 0.81)', border: 'none',
            color: '#fff', borderRadius: 8, padding: '6px 10px',
            fontSize: 18, cursor: 'pointer',
            display: 'none'
          }}
          className="mobile-menu-btn"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          background: '#4338ca',
          padding: '8px 16px 16px',
          display: 'flex', flexDirection: 'column', gap: 4
        }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={{
            color: '#fff', padding: '10px 0',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            textDecoration: 'none', fontSize: 14
          }}>🏠 Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} style={{
            color: '#fff', padding: '10px 0',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            textDecoration: 'none', fontSize: 14
          }}>🔍 Products</Link>
          {user ? (
            <>
              <Link to="/orders" onClick={() => setMenuOpen(false)} style={{
                color: '#fff', padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none', fontSize: 14
              }}>📦 My Orders</Link>
              <button onClick={logoutUser} style={{
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: 'none', borderRadius: 8, padding: '10px',
                fontSize: 14, cursor: 'pointer', marginTop: 4,
                textAlign: 'left'
              }}>🚪 Logout ({user.username})</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{
                color: '#fff', padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none', fontSize: 14
              }}>🔑 Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                background: '#fff', color: '#4f46e5',
                padding: '10px', borderRadius: 8,
                textDecoration: 'none', fontSize: 14,
                fontWeight: 600, textAlign: 'center',
                marginTop: 4, display: 'block'
              }}>Register</Link>
            </>
          )}
        </div>
      )}

      {/* CSS for responsive */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}