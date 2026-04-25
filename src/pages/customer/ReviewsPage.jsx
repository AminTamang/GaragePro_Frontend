// Feature 13: Customers can submit reviews
import Layout from '../../components/layout/Layout';
import { Star } from 'lucide-react';

export default function ReviewsPage() {
  return (
    <Layout title="Reviews">
      <div style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid #e5e7eb', padding: 32,
        maxWidth: 680,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Star size={20} color="#4f46e5" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Reviews</h2>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Feature 13 — Coming soon.</p>
      </div>
    </Layout>
  );
}
