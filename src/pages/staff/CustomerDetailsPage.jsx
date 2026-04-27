// Feature 8: Staff views customer profile, vehicles, appointments and reviews
import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Users, Search, Mail, Phone, Car, CalendarDays, Star } from 'lucide-react';
import { getCustomerById } from '../../services/customerService';
import { getAppointments } from '../../services/appointmentService';
import { getReviews } from '../../services/reviewService';

const Badge = ({ status }) => {
  const map = {
    Scheduled: ['#dbeafe', '#1d4ed8'],
    Completed:  ['#dcfce7', '#15803d'],
    Cancelled:  ['#fee2e2', '#b91c1c'],
  };
  const [bg, color] = map[status] || ['#f3f4f6', '#374151'];
  return (
    <span style={{ background: bg, color, fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>
      {status}
    </span>
  );
};

const Card = ({ title, icon: Icon, children }) => (
  <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 20, marginBottom: 16 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <Icon size={15} color="#4f46e5" />
      <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{title}</p>
    </div>
    {children}
  </div>
);

const Empty = ({ text }) => (
  <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>{text}</p>
);

export default function CustomerDetailsPage() {
  const [query, setQuery]         = useState('');
  const [data, setData]           = useState(null);
  const [appointments, setAppts]  = useState([]);
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoad]        = useState(false);
  const [error, setError]         = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const id = parseInt(query.trim());
    if (!id) return;
    setLoad(true); setError(null); setData(null); setAppts([]); setReviews([]);
    try {
      // Fetch customer profile + vehicles
      const res = await getCustomerById(id);
      const customer = res.data?.data;   // ApiResponse wrapper → .data
      if (!customer) throw new Error('Customer not found.');
      setData(customer);

      // Fetch appointments and reviews in parallel
      const [apptRes, revRes] = await Promise.allSettled([
        getAppointments(id),
        getReviews(id),
      ]);
      if (apptRes.status === 'fulfilled') setAppts(apptRes.value.data?.data || []);
      if (revRes.status === 'fulfilled')  setReviews(revRes.value.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Customer not found.');
    } finally {
      setLoad(false);
    }
  };

  return (
    <Layout title="Customer Details">
      <div style={{ maxWidth: 820 }}>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', top: 10, left: 12, pointerEvents: 'none' }}>
              <Search size={14} color="#9ca3af" />
            </span>
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Enter Customer ID..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            background: '#4f46e5', color: '#fff', border: 'none',
            borderRadius: 8, padding: '0 20px', fontSize: 13, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Profile — uses fullName / email / phoneNumber (Amin's CustomerResponse) */}
            <Card title="Profile" icon={Users}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', background: '#eef2ff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 700, color: '#4f46e5', flexShrink: 0,
                }}>
                  {data.fullName?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 4 }}>{data.fullName}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                      <Mail size={12} />{data.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6b7280' }}>
                      <Phone size={12} />{data.phoneNumber}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Vehicles — uses make / model / manufactureYear (Amin's VehicleResponse) */}
            <Card title="Vehicles" icon={Car}>
              {data.vehicles?.length > 0 ? data.vehicles.map(v => (
                <div key={v.vehiclePlate} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#f9fafb', borderRadius: 8, padding: '10px 14px', marginBottom: 8,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{v.vehiclePlate}</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {v.make} {v.model}{v.manufactureYear ? ` · ${v.manufactureYear}` : ''}
                  </span>
                </div>
              )) : <Empty text="No vehicles registered." />}
            </Card>

            {/* Appointments — from Ryan's GET /api/customers/{id}/appointments */}
            <Card title="Appointments" icon={CalendarDays}>
              {appointments.length > 0 ? appointments.map(a => (
                <div key={a.appointmentId} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: '#f9fafb', borderRadius: 8, padding: '10px 14px', marginBottom: 8,
                }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>
                      {new Date(a.apptDate).toLocaleString()}
                    </p>
                    {a.apptNotes && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{a.apptNotes}</p>}
                  </div>
                  <Badge status={a.apptStatus} />
                </div>
              )) : <Empty text="No appointments." />}
            </Card>

            {/* Reviews — from Ryan's GET /api/customers/{id}/reviews */}
            <Card title="Reviews" icon={Star}>
              {reviews.length > 0 ? reviews.map(r => (
                <div key={r.reviewId} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 12, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ color: '#f59e0b', fontSize: 14, letterSpacing: 2 }}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(r.reviewDate).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151' }}>{r.comment}</p>
                </div>
              )) : <Empty text="No reviews yet." />}
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
