// Feature 6: Staff can register new customers with vehicle details
import Layout from '../../components/layout/Layout';
import { UserPlus } from 'lucide-react';

export default function RegisterCustomerPage() {
  return (
    <Layout title="Register Customer">
      <div style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid #e5e7eb', padding: 32,
        maxWidth: 680,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <UserPlus size={20} color="#4f46e5" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Register New Customer</h2>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Feature 6 — Coming soon.</p>
      </div>
    </Layout>
  );
}
