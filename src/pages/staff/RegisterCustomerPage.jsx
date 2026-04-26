// Feature 6: Staff can register new customers with vehicle details
import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { UserPlus, User, Phone, Mail, Car, Hash, CheckCircle, AlertCircle } from 'lucide-react';
import { registerCustomer } from '../../services/customerService';

const field = (label, name, type, placeholder, icon, value, onChange, required = true) => ({
  label, name, type, placeholder, icon, value, onChange, required,
});

export default function RegisterCustomerPage() {
  const [customer, setCustomer] = useState({ customerName: '', customerEmail: '', customerPhone: '' });
  const [vehicle, setVehicle]   = useState({ vehiclePlate: '', vehicleMake: '', vehicleModel: '', vehicleYear: '' });
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null);

  const setC = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });
  const setV = (e) => setVehicle({ ...vehicle, [e.target.name]: e.target.value });

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerCustomer({ ...customer, vehicle });
      showToast('success', 'Customer registered successfully!');
      setCustomer({ customerName: '', customerEmail: '', customerPhone: '' });
      setVehicle({ vehiclePlate: '', vehicleMake: '', vehicleModel: '', vehicleYear: '' });
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
    padding: '9px 12px 9px 36px', fontSize: 13, color: '#111827',
    outline: 'none', background: '#fff',
  };
  const iconWrap = { position: 'relative' };
  const iconPos  = { position: 'absolute', top: 9, left: 10, pointerEvents: 'none' };

  return (
    <Layout title="Register Customer">

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 999,
          display: 'flex', alignItems: 'center', gap: 10,
          background: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${toast.type === 'success' ? '#86efac' : '#fca5a5'}`,
          borderRadius: 10, padding: '12px 16px', fontSize: 13,
          color: toast.type === 'success' ? '#166534' : '#991b1b',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          {toast.type === 'success'
            ? <CheckCircle size={16} color="#22c55e" />
            : <AlertCircle size={16} color="#ef4444" />}
          {toast.text}
        </div>
      )}

      <div style={{ maxWidth: 680 }}>
        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#eef2ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <UserPlus size={18} color="#4f46e5" />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Register New Customer</h2>
            <p style={{ fontSize: 12, color: '#6b7280' }}>Staff Portal · Feature 6</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Customer Details Card */}
          <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
            padding: 24, marginBottom: 16,
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              Customer Details
            </p>
            <div style={{ display: 'grid', gap: 14 }}>

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Full Name *</label>
                <div style={iconWrap}>
                  <span style={iconPos}><User size={14} color="#9ca3af" /></span>
                  <input name="customerName" type="text" placeholder="e.g. John Smith"
                    value={customer.customerName} onChange={setC} required style={inputStyle} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email Address *</label>
                <div style={iconWrap}>
                  <span style={iconPos}><Mail size={14} color="#9ca3af" /></span>
                  <input name="customerEmail" type="email" placeholder="e.g. john@email.com"
                    value={customer.customerEmail} onChange={setC} required style={inputStyle} />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Phone Number *</label>
                <div style={iconWrap}>
                  <span style={iconPos}><Phone size={14} color="#9ca3af" /></span>
                  <input name="customerPhone" type="tel" placeholder="e.g. 9800000000"
                    value={customer.customerPhone} onChange={setC} required style={inputStyle} />
                </div>
              </div>

            </div>
          </div>

          {/* Vehicle Details Card */}
          <div style={{
            background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
            padding: 24, marginBottom: 20,
          }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              Vehicle Details
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

              {/* Plate — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>License Plate *</label>
                <div style={iconWrap}>
                  <span style={iconPos}><Hash size={14} color="#9ca3af" /></span>
                  <input name="vehiclePlate" type="text" placeholder="e.g. BA 1 CHA 1234"
                    value={vehicle.vehiclePlate} onChange={setV} required style={inputStyle} />
                </div>
              </div>

              {/* Make */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Make *</label>
                <div style={iconWrap}>
                  <span style={iconPos}><Car size={14} color="#9ca3af" /></span>
                  <input name="vehicleMake" type="text" placeholder="e.g. Toyota"
                    value={vehicle.vehicleMake} onChange={setV} required style={inputStyle} />
                </div>
              </div>

              {/* Model */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Model *</label>
                <div style={iconWrap}>
                  <span style={iconPos}><Car size={14} color="#9ca3af" /></span>
                  <input name="vehicleModel" type="text" placeholder="e.g. Corolla"
                    value={vehicle.vehicleModel} onChange={setV} required style={inputStyle} />
                </div>
              </div>

              {/* Year — full width */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Year *</label>
                <input name="vehicleYear" type="number" placeholder="e.g. 2019"
                  min="1900" max={new Date().getFullYear()}
                  value={vehicle.vehicleYear} onChange={setV} required
                  style={{ ...inputStyle, paddingLeft: 12 }} />
              </div>

            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#a5b4fc' : '#4f46e5',
            color: '#fff', border: 'none', borderRadius: 8, padding: '11px 0',
            fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <UserPlus size={15} />
            {loading ? 'Registering...' : 'Register Customer'}
          </button>

        </form>
      </div>
    </Layout>
  );
}
