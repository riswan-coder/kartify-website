import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginApi, getProfile } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(form);
      const { access, refresh } = res.data;
      localStorage.setItem('access_token', access);
      const profileRes = await getProfile();
      const userData = profileRes.data;
      if (userData.role !== 'customer') {
        toast.error('Please use the admin portal for staff accounts');
        localStorage.removeItem('access_token');
        return;
      }
      loginUser(userData, access, refresh);
      toast.success(`Welcome back, ${userData.username}!`);
      navigate(from, { replace: true });
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: 16, background: '#f8fafc'
    }}>
      <div style={{
        background: '#fff', borderRadius: 20,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: 32, width: '100%', maxWidth: 400
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, background: '#4f46e5',
            borderRadius: 16, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 24 }}>T</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
            TrendKart
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>
            {from !== '/' ? 'Sign in to continue your order' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 500, color: '#374151', marginBottom: 6
            }}>Username</label>
            <input
              required
              type="text"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #e5e7eb', borderRadius: 10,
                fontSize: 14, outline: 'none', boxSizing: 'border-box'
              }}
              placeholder="Enter username"
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block', fontSize: 13,
              fontWeight: 500, color: '#374151', marginBottom: 6
            }}>Password</label>
            <input
              required
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid #e5e7eb', borderRadius: 10,
                fontSize: 14, outline: 'none', boxSizing: 'border-box'
              }}
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px',
              background: loading ? '#a5b4fc' : '#4f46e5',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 600, cursor: 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginTop: 20 }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            state={{ from }}
            style={{ color: '#4f46e5', fontWeight: 500, textDecoration: 'none' }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}