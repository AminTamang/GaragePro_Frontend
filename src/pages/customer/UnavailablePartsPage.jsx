// Feature 13: Customers can request unavailable parts
import Layout from '../../components/layout/Layout';
import { Wrench } from 'lucide-react';

export default function UnavailablePartsPage() {
  return (
    <Layout title="Part Requests">
      <div style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid #e5e7eb', padding: 32,
        maxWidth: 680,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Wrench size={20} color="#4f46e5" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Part Requests</h2>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Feature 13 — Coming soon.</p>
      </div>
    </Layout>
  );
}
