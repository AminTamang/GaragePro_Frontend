// Feature 13: Customers can submit and view reviews
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Star, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { submitReview, getReviews } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';

export default function ReviewsPage() {
  const { user } = useAuth();
  const customerId = user?.customerId;
  const [reviews, setReviews] = useState([]);
  const [form, setForm]   = useState({ rating: 5, comment: '' });
  const [loading, setLoad] = useState(false);
  const [toast, setToast]  = useState(null);

  const showToast = (type, text) => { setToast({ type, text }); setTimeout(() => setToast(null), 4000); };

  const load = async () => {
    try { const r = await getReviews(customerId); setReviews(r.data || []); }
    catch { setReviews([]); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    try {
      await submitReview(customerId, form);
      showToast('success', 'Review submitted — thank you!');
      setForm({ rating: 5, comment: '' });
      load();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Could not submit review.');
    } finally { setLoad(false); }
  };

  return (
    <Layout title="Reviews">
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
        {/* Submit form */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Leave a Review
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>

            {/* Star rating */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 8 }}>Rating *</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                      color: s <= form.rating ? '#f59e0b' : '#d1d5db',
                    }}>
                    <Star size={28} fill={s <= form.rating ? '#f59e0b' : 'none'} />
                  </button>
                ))}
                <span style={{ fontSize: 12, color: '#6b7280', alignSelf: 'center', marginLeft: 8 }}>
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Comment *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', top: 9, left: 10 }}><MessageSquare size={14} color="#9ca3af" /></span>
                <textarea rows={4} value={form.comment} required
                  placeholder="Share your experience with GaragePro..."
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '9px 12px 9px 36px', fontSize: 13, outline: 'none', resize: 'none' }} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff', border: 'none',
              borderRadius: 8, padding: '10px 0', fontSize: 13, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Star size={15} />
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>

        {/* Reviews list */}
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
            Your Reviews
          </p>
          {reviews.length === 0
            ? <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>No reviews yet.</p>
            : reviews.map(r => (
              <div key={r.reviewId} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} color="#f59e0b" fill={s <= r.rating ? '#f59e0b' : 'none'} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(r.reviewDate).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: 13, color: '#374151' }}>{r.comment}</p>
              </div>
            ))
          }
        </div>
      </div>
    </Layout>
  );
}
