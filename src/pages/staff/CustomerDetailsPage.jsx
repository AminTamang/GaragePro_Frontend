import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Users, Search, Mail, Phone, Car, CalendarDays, Star, ChevronRight } from 'lucide-react';
import { getCustomerById, searchCustomers } from '../../services/customerService';
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
  <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '30px 0' }}>{text}</p>
);

export default function CustomerDetailsPage() {
  const [query, setQuery]         = useState('');
  const [customerList, setCustomerList] = useState([]);
  const [data, setData]           = useState(null);
  const [appointments, setAppts]  = useState([]);
  const [reviews, setReviews]     = useState([]);
  
  const [loadingList, setLoadList] = useState(false);
  const [loadingDetails, setLoadDetails] = useState(false);
  const [error, setError]         = useState(null);

  const fetchList = async (q = '') => {
    setLoadList(true); setError(null);
    try {
      const res = await searchCustomers(q);
      setCustomerList(res.data?.data || []);
    } catch (err) {
      setError('Failed to load customers.');
    } finally {
      setLoadList(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchList(query);
  };

  const handleSelect = async (id) => {
    setLoadDetails(true); setError(null); setData(null); setAppts([]); setReviews([]);
    try {
      const res = await getCustomerById(id);
      const customer = res.data?.data;
      if (!customer) throw new Error('Customer not found.');
      setData(customer);

      const [apptRes, revRes] = await Promise.allSettled([
        getAppointments(id),
        getReviews(id),
      ]);
      if (apptRes.status === 'fulfilled') setAppts(apptRes.value.data?.data || []);
      if (revRes.status === 'fulfilled')  setReviews(revRes.value.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Customer not found.');
    } finally {
      setLoadDetails(false);
    }
  };

  return (
    <Layout title="Customer Management">
      <div style={{ display: 'flex', gap: 24, maxWidth: 1100, alignItems: 'flex-start' }}>
        
        {/* Left Side: Search & List */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', top: 10, left: 12, pointerEvents: 'none' }}>
                <Search size={14} color="#9ca3af" />
              </span>
              <input
                value={query} onChange={e => {
                  setQuery(e.target.value);
                  if (e.target.value === '') fetchList(''); // auto fetch all if cleared
                }}
                placeholder="Search name, phone, plate..."
                style={{ width: '100%', padding: '9px 12px 9px 36px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', background: '#fff' }}
              />
            </div>
            <button type="submit" disabled={loadingList} style={{
              background: '#4f46e5', color: '#fff', border: 'none',
              borderRadius: 8, padding: '0 16px', fontSize: 13, fontWeight: 600,
              cursor: loadingList ? 'not-allowed' : 'pointer', opacity: loadingList ? 0.7 : 1,
            }}>
              Search
            </button>
          </form>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Customer List
              </p>
            </div>
            
            <div style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              {loadingList ? (
                <Empty text="Loading customers..." />
              ) : customerList.length > 0 ? (
                customerList.map(c => (
                  <div key={c.id} onClick={() => handleSelect(c.id)} style={{
                    padding: 16, borderBottom: '1px solid #f3f4f6', cursor: 'pointer',
                    background: data?.id === c.id ? '#eef2ff' : '#fff',
                    transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}
                  onMouseOver={e => { if (data?.id !== c.id) e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseOut={e => { if (data?.id !== c.id) e.currentTarget.style.background = '#fff'; }}
                  >
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: data?.id === c.id ? '#4f46e5' : '#111827', marginBottom: 4 }}>
                        {c.fullName}
                      </p>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#6b7280' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={11} /> {c.phoneNumber || 'N/A'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Car size={11} /> {c.vehicles?.length || 0}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} color={data?.id === c.id ? '#4f46e5' : '#d1d5db'} />
                  </div>
                ))
              ) : (
                <Empty text="No customers found." />
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Details */}
        <div style={{ flex: 1 }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#991b1b', marginBottom: 16 }}>
              {error}
            </div>
          )}

          {loadingDetails ? (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 40, textAlign: 'center' }}>
              <p style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Loading details...</p>
            </div>
          ) : !data ? (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px dashed #d1d5db', padding: 60, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Users size={28} color="#9ca3af" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>No Customer Selected</p>
              <p style={{ fontSize: 13, color: '#6b7280' }}>Select a customer from the list to view their profile, vehicles, and history.</p>
            </div>
          ) : (
            <>
              {/* Profile */}
              <Card title="Profile Overview" icon={Users}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', background: '#eef2ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 700, color: '#4f46e5', flexShrink: 0,
                  }}>
                    {data.fullName?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: 18, color: '#111827', marginBottom: 6 }}>{data.fullName}</p>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4b5563' }}>
                        <Mail size={14} color="#9ca3af" /> {data.email}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4b5563' }}>
                        <Phone size={14} color="#9ca3af" /> {data.phoneNumber || 'No phone'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Vehicles */}
              <Card title="Registered Vehicles" icon={Car}>
                {data.vehicles?.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    {data.vehicles.map(v => (
                      <div key={v.vehiclePlate} style={{ background: '#f9fafb', borderRadius: 8, padding: '12px 16px', border: '1px solid #f3f4f6' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{v.vehiclePlate}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: 12 }}>{v.vehicleType}</span>
                        </div>
                        <p style={{ fontSize: 13, color: '#6b7280' }}>
                          {v.make} {v.model} {v.manufactureYear ? `(${v.manufactureYear})` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : <Empty text="No vehicles registered for this customer." />}
              </Card>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Appointments */}
                <Card title="Appointments" icon={CalendarDays}>
                  {appointments.length > 0 ? appointments.map(a => (
                    <div key={a.appointmentId} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                      background: '#f9fafb', borderRadius: 8, padding: '12px', marginBottom: 8,
                    }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                          {new Date(a.apptDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </p>
                        {a.apptNotes && <p style={{ fontSize: 12, color: '#6b7280', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{a.apptNotes}</p>}
                      </div>
                      <Badge status={a.apptStatus} />
                    </div>
                  )) : <Empty text="No appointment history." />}
                </Card>

                {/* Reviews */}
                <Card title="Reviews" icon={Star}>
                  {reviews.length > 0 ? reviews.map(r => (
                    <div key={r.reviewId} style={{ background: '#f9fafb', borderRadius: 8, padding: '12px', marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ color: '#f59e0b', fontSize: 14, letterSpacing: 2 }}>
                          {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                        </span>
                        <span style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(r.reviewDate).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: 13, color: '#4b5563', fontStyle: 'italic' }}>"{r.comment}"</p>
                    </div>
                  )) : <Empty text="No reviews submitted." />}
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
