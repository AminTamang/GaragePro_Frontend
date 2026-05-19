import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../components/ToastProvider';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    vehiclePlate: '',
    make: '',
    model: '',
    vehicleType: 'Car',
    manufactureYear: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const { loading, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function update(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!form.fullName || !form.email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }
    if (!form.phoneNumber || !form.vehiclePlate || !form.make || !form.model) {
      setError('Phone and vehicle details are required.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register(form);
      showToast('Customer account created.', 'success');
      navigate('/customer/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <Link className="logo-text auth-logo" to="/">GaragePro</Link>
        <h1>Customer Registration</h1>
        <p>Create a customer login for profile, vehicles, appointments, and history.</p>
        {error && <div className="form-error">{error}</div>}
        <label>
          Full Name
          <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </label>
        <label>
          Phone
          <input value={form.phoneNumber} onChange={(e) => update('phoneNumber', e.target.value)} />
        </label>
        <label>
          Address
          <input value={form.address} onChange={(e) => update('address', e.target.value)} />
        </label>
        <label>
          Vehicle Plate
          <input value={form.vehiclePlate} onChange={(e) => update('vehiclePlate', e.target.value)} />
        </label>
        <label>
          Make
          <input value={form.make} onChange={(e) => update('make', e.target.value)} />
        </label>
        <label>
          Model
          <input value={form.model} onChange={(e) => update('model', e.target.value)} />
        </label>
        <label>
          Vehicle Type
          <select value={form.vehicleType} onChange={(e) => update('vehicleType', e.target.value)}>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Jeep">Jeep</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <label>
          Manufacture Year
          <input type="number" min="1990" max="2035" value={form.manufactureYear} onChange={(e) => update('manufactureYear', e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} />
        </label>
        <label>
          Confirm Password
          <input type="password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
        </label>
        <button className="btn-primary" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        <div className="auth-links"><Link to="/login">Already have an account?</Link></div>
      </form>
    </main>
  );
}
