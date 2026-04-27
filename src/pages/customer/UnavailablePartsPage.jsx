// Feature 13: Customers can request unavailable parts
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Wrench, Package, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { requestUnavailablePart, getUnavailablePartRequests } from '../../services/appointmentService';
import { useAuth } from '../../context/AuthContext';

export default function UnavailablePartsPage() {
  const { user } = useAuth();
  const customerId = user?.customerId;
  const [requests, setRequests] = useState([]);
  const [form, setForm]   = useState({ partName: '', description: '' });
  const [loading, setLoad] = useState(false);
  const [toast, setToast]  = useState(null);

  const showToast = (type, text) => { setToast({ type, text }); setTimeout(() => setToast(null), 4000); };

  const load = async () => {
    try { const r = await getUnavailablePartRequests(customerId); setRequests(r.data || []); }
    catch { setRequests([]); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      await requestUnavailablePart(customerId, form);
      showToast('success', 'Request submitted! We will notify you when available.');
      setForm({ partName: '', description: '' });
      load();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Request failed.');
    } finally { setLoad(false); }
  };

  const inp = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '9px 12px 9px 36px', fontSize: 13, outline: 'none' };

  return (
    <Layout title="Part Requests">
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
        {/* Request form */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Request a Part
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Part Name *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 9, left: 10 }}><Package size={14} color="#9ca3af" /></span>
                <input type="text" value={form.partName} required
                  placeholder="e.g. Brake Pad — Toyota Corolla 2019"
                  onChange={e => setForm({ ...form, partName: e.target.value })} style={inp} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Description</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 9, left: 10 }}><FileText size={14} color="#9ca3af" /></span>
                <textarea rows={3} value={form.description} placeholder="Any extra details about the part..."
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={{ ...inp, resize: 'none' }} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff', border: 'none',
              borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Wrench size={15} />
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Requests list */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Your Requests
          </p>
          {requests.length === 0
            ? <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>No part requests yet.</p>
            : requests.map(r => (
              <div key={r.requestId} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: '#f9fafb', borderRadius: 8, padding: '12px 14px', marginBottom: 8,
              }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{r.partName}</p>
                  {r.description && <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{r.description}</p>}
                  <p style={{ fontSize: 11, color: '#d1d5db', marginTop: 2 }}>{new Date(r.requestDate).toLocaleDateString()}</p>
                </div>
                <span style={{ background: '#fef9c3', color: '#854d0e', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>
                  {r.status}
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </Layout>
  );
}
