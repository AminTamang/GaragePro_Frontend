import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, AlertCircle, User, Phone, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/authService';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'Customer' // Default to Customer
  });
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoad(true); setError(null);
    try {
      // 1. Register the user
      await registerApi(form);
      
      // 2. Automatically log them in (assuming register doesn't return a token, we log in)
      // Actually, AuthResponse returns token on register too in most systems, but let's just 
      // redirect them to login page with a success message, or log them in directly.
      // The authController Register endpoint returns the exact same data as Login (token etc).
      // Let's try to just hit the login endpoint or use the token if returned.
      // We will just redirect to login for simplicity and safety.
      alert('Registration successful! Please sign in.');
      navigate('/login');
      
    } catch (err) {
      const msg = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        setError(errors.join(', '));
      } else {
        setError(msg || 'Registration failed.');
      }
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
      width: '100%', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f9fafb', padding: '40px 16px'
    }}>
      <div style={{ width: '100%', maxWidth: 450 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>G</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>Create an Account</h1>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Join GaragePro today</p>
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
              <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 10, left: 12, pointerEvents: 'none' }}>
                  <User size={14} color="#9ca3af" />
                </span>
                <input type="text" value={form.fullName} required
                  placeholder="John Doe"
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  style={inp} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 10, left: 12, pointerEvents: 'none' }}>
                    <Phone size={14} color="#9ca3af" />
                  </span>
                  <input type="tel" value={form.phoneNumber} required
                    placeholder="9800000000"
                    onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                    style={inp} />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
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
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 10, left: 12, pointerEvents: 'none' }}>
                    <Lock size={14} color="#9ca3af" />
                  </span>
                  <input type="password" value={form.confirmPassword} required
                    placeholder="••••••••"
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    style={inp} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Account Type</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 10, left: 12, pointerEvents: 'none' }}>
                  <Shield size={14} color="#9ca3af" />
                </span>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={inp}>
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff',
              border: 'none', borderRadius: 8, padding: '11px 0',
              fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 4,
            }}>
              <UserPlus size={15} />
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 20 }}>
          GaragePro · CS6004NI Coursework
        </p>
      </div>
    </div>
  );
}
