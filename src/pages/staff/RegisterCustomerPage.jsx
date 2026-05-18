// Feature 6: Staff registers a new customer then attaches their vehicle
import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { UserPlus, User, Phone, Mail, Car, Hash, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { registerCustomer, addVehicle } from '../../services/customerService';

export default function RegisterCustomerPage() {
  // Field names match CustomerRegisterRequest + AddVehicleRequest
  const [customer, setCustomer] = useState({ fullName: '', email: '', phoneNumber: '', address: '' });
  const [vehicle, setVehicle]   = useState({ vehiclePlate: '', make: '', model: '', manufactureYear: '', vehicleType: '' });
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null);

  const setC = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });
  const setV = (e) => setVehicle({ ...vehicle, [e.target.name]: e.target.value });

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1 — register customer
      const res = await registerCustomer(customer);
      const customerId = res.data?.data?.id;

      // Step 2 — attach vehicle if plate provided
      if (customerId && vehicle.vehiclePlate) {
        await addVehicle(customerId, {
          vehiclePlate: vehicle.vehiclePlate,
          make:          vehicle.make,
          model:         vehicle.model,
          vehicleType:   vehicle.vehicleType || null,
          manufactureYear: vehicle.manufactureYear ? parseInt(vehicle.manufactureYear) : null,
        });
      }

      showToast('success', 'Customer & vehicle registered successfully!');
      setCustomer({ fullName: '', email: '', phoneNumber: '', address: '' });
      setVehicle({ vehiclePlate: '', make: '', model: '', manufactureYear: '', vehicleType: '' });
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
    padding: '9px 12px 9px 36px', fontSize: 13, color: '#111827',
    outline: 'none', background: '#fff',
  };
  const iconPos = { position: 'absolute', top: 9, left: 10, pointerEvents: 'none' };

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
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserPlus size={18} color="#4f46e5" />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Register New Customer</h2>
            <p style={{ fontSize: 12, color: '#6b7280' }}>Staff Portal · Feature 6</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Customer Card */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              Customer Details
            </p>
            <div style={{ display: 'grid', gap: 14 }}>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Full Name *</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconPos}><User size={14} color="#9ca3af" /></span>
                  <input name="fullName" type="text" placeholder="e.g. John Smith"
                    value={customer.fullName} onChange={setC} required style={inp} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconPos}><Mail size={14} color="#9ca3af" /></span>
                  <input name="email" type="email" placeholder="e.g. john@email.com"
                    value={customer.email} onChange={setC} required style={inp} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Phone Number *</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconPos}><Phone size={14} color="#9ca3af" /></span>
                  <input name="phoneNumber" type="tel" placeholder="e.g. 9800000000"
                    value={customer.phoneNumber} onChange={setC} required style={inp} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Address</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconPos}><MapPin size={14} color="#9ca3af" /></span>
                  <input name="address" type="text" placeholder="e.g. Kathmandu, Nepal"
                    value={customer.address} onChange={setC} style={inp} />
                </div>
              </div>

            </div>
          </div>

          {/* Vehicle Card */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Vehicle Details
            </p>
            <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 16 }}>Optional — can be added later</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>License Plate</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconPos}><Hash size={14} color="#9ca3af" /></span>
                  <input name="vehiclePlate" type="text" placeholder="e.g. BA 1 CHA 1234"
                    value={vehicle.vehiclePlate} onChange={setV} style={inp} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Make</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconPos}><Car size={14} color="#9ca3af" /></span>
                  <input name="make" type="text" placeholder="e.g. Toyota"
                    value={vehicle.make} onChange={setV} style={inp} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Model</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconPos}><Car size={14} color="#9ca3af" /></span>
                  <input name="model" type="text" placeholder="e.g. Corolla"
                    value={vehicle.model} onChange={setV} style={inp} />
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Year</label>
                <input name="manufactureYear" type="number" placeholder="e.g. 2019"
                  min="1900" max={new Date().getFullYear()}
                  value={vehicle.manufactureYear} onChange={setV}
                  style={{ ...inp, paddingLeft: 12 }} />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Vehicle Type</label>
                <select name="vehicleType" value={vehicle.vehicleType} onChange={setV}
                  style={{ ...inp, paddingLeft: 12 }}>
                  <option value="">Select type (optional)...</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>
          </div>

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
