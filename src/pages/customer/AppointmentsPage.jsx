// Feature 13: Customers can book appointments
import Layout from '../../components/layout/Layout';
import { CalendarDays } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <Layout title="Appointments">
      <div style={{
        background: '#fff', borderRadius: 12,
        border: '1px solid #e5e7eb', padding: 32,
        maxWidth: 680,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <CalendarDays size={20} color="#4f46e5" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>Appointments</h2>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280' }}>Feature 13 — Coming soon.</p>
      </div>
    </Layout>
  );
}
