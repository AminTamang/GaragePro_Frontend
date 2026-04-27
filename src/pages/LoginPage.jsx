import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/authService';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true); setError(null);
    try {
      const res  = await loginApi(form);
      const data = res.data?.data;   // ApiResponse wrapper
      login(data);

      // Redirect based on role
      const role = data?.role?.toLowerCase();
      if (role === 'customer')       navigate('/customer/appointments');
      else if (role === 'staff')     navigate('/staff/register-customer');
      else if (role === 'admin')     navigate('/staff/register-customer');
      else                           navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoad(false);
    }
  };

  const inp = {
    width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
    padding: '10px 12px 10px 38px', fontSize: 13, outline: 'none',
    background: '#fff', color: '#111827',
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f9fafb',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 16px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>G</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>GaragePro</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fef2f2', border: '1px solid #fca5a5',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              fontSize: 13, color: '#991b1b',
            }}>
              <AlertCircle size={14} color="#ef4444" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 10, left: 12, pointerEvents: 'none' }}>
                  <Mail size={14} color="#9ca3af" />
                </span>
                <input type="email" value={form.email} required
                  placeholder="you@example.com"
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inp} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 10, left: 12, pointerEvents: 'none' }}>
                  <Lock size={14} color="#9ca3af" />
                </span>
                <input type="password" value={form.password} required
                  placeholder="••••••••"
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={inp} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff',
              border: 'none', borderRadius: 8, padding: '11px 0',
              fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 4,
            }}>
              <LogIn size={15} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 20 }}>
          GaragePro · CS6004NI Coursework
        </p>
      </div>
    </div>
  );
}
