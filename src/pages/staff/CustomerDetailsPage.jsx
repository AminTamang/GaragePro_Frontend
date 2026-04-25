// Feature 8: Staff can view customer details, history, and vehicle info
import Layout from '../../components/layout/Layout';
import { Users } from 'lucide-react';

export default function CustomerDetailsPage() {
  return (
    <Layout title="Customer Details">
      <div style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid #e5e7eb', padding: 32,
        maxWidth: 800,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Users size={20} color="#4f46e5" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Customer Details</h2>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Feature 8 — Coming soon.</p>
      </div>
    </Layout>
  );
}
