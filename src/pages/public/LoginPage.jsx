import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../components/ToastProvider';

const roleHome = {
  Admin: '/admin/dashboard',
  Staff: '/staff/dashboard',
  Customer: '/customer/dashboard',
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: 'admin@garagepro.local', password: 'Password123!' });
  const [error, setError] = useState('');
  const { isAuthenticated, loading, login, role } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to={roleHome[role] || '/'} replace />;
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const user = await login(form.email, form.password);
      showToast(`Welcome, ${user.fullName}.`, 'success');
      navigate(location.state?.from?.pathname || roleHome[user.role] || '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed.');
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link className="logo-text auth-logo" to="/">GaragePro</Link>
        <h1>Login</h1>
        <p>Use your Admin, Staff, or Customer account to continue.</p>
        {error && <div className="form-error">{error}</div>}
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
        </label>
        <button className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <Link to="/register">Create customer account</Link>
        </div>
      </form>
    </main>
  );
}
