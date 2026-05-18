// Feature 13: Customers can book and cancel appointments
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { CalendarDays, Clock, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { bookAppointment, getAppointments, cancelAppointment } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

const statusStyle = {
  Scheduled: { background: '#dbeafe', color: '#1d4ed8' },
  Completed:  { background: '#dcfce7', color: '#15803d' },
  Cancelled:  { background: '#fee2e2', color: '#b91c1c' },
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const customerId = user?.customerId;
  const [appointments, setAppointments] = useState([]);
  const [form, setForm]   = useState({ apptDate: '', apptNotes: '' });
  const [loading, setLoad] = useState(false);
  const [toast, setToast]  = useState(null);

  const showToast = (type, text) => { setToast({ type, text }); setTimeout(() => setToast(null), 4000); };

  const load = async () => {
    if (!customerId) return;
    try { const r = await getAppointments(customerId); setAppointments(r.data?.data || []); }
    catch { setAppointments([]); }
  };

  useEffect(() => { load(); }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!customerId) { showToast('error', 'Customer ID not found. Please log in again.'); return; }
    setLoad(true);
    try {
      await bookAppointment(customerId, { ...form, apptDate: new Date(form.apptDate).toISOString() });
      showToast('success', 'Appointment booked!');
      setForm({ apptDate: '', apptNotes: '' });
      load();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Booking failed.');
    } finally { setLoad(false); }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try { await cancelAppointment(customerId, id); load(); }
    catch (err) { showToast('error', err.response?.data?.message || 'Could not cancel.'); }
  };

  const inp = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '9px 12px 9px 36px', fontSize: 13, outline: 'none' };

  return (
    <Layout title="Appointments">
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
          {toast.type === 'success' ? <CheckCircle size={15} color="#22c55e" /> : <AlertCircle size={15} color="#ef4444" />}
          {toast.text}
        </div>
      )}

      <div style={{ maxWidth: 680 }}>
        {/* Book form */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Book New Appointment
          </p>
          <form onSubmit={handleBook} style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Date & Time *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 9, left: 10 }}><Clock size={14} color="#9ca3af" /></span>
                <input type="datetime-local" value={form.apptDate} required
                  onChange={e => setForm({ ...form, apptDate: e.target.value })} style={inp} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Notes</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 9, left: 10 }}><FileText size={14} color="#9ca3af" /></span>
                <textarea rows={3} value={form.apptNotes} placeholder="Describe what service you need..."
                  onChange={e => setForm({ ...form, apptNotes: e.target.value })}
                  style={{ ...inp, resize: 'none' }} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff', border: 'none',
              borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <CalendarDays size={15} />
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        </div>

        {/* List */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Your Appointments
          </p>
          {appointments.length === 0
            ? <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>No appointments yet.</p>
            : appointments.map(a => (
              <div key={a.appointmentId} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#f9fafb', borderRadius: 8, padding: '12px 14px', marginBottom: 8,
              }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{new Date(a.apptDate).toLocaleString()}</p>
                  {a.apptNotes && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{a.apptNotes}</p>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ ...(statusStyle[a.apptStatus] || {}), fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>
                    {a.apptStatus}
                  </span>
                  {a.apptStatus === 'Scheduled' && (
                    <button onClick={() => handleCancel(a.appointmentId)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </Layout>
  );
}
