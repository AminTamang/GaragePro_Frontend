import Layout from '../components/layout/Layout';
import { IndianRupee, ShoppingBag, AlertTriangle, Users } from 'lucide-react';

const statCards = [
  { label: "Today's Sales",   value: 'Rs. 0', sub: 'No sales yet',     Icon: IndianRupee,   color: '#4f46e5' },
  { label: 'Open Orders',     value: '0',     sub: 'No open orders',   Icon: ShoppingBag,   color: '#0891b2' },
  { label: 'Low Stock Items', value: '0',     sub: 'All stock healthy', Icon: AlertTriangle, color: '#d97706' },
  { label: 'Customers',       value: '0',     sub: 'No customers yet', Icon: Users,         color: '#059669' },
];

export default function DashboardPage() {
  return (
    <Layout title="Dashboard">

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {statCards.map(({ label, value, sub, Icon, color }) => (
          <div key={label} style={{
            background: '#fff', borderRadius: 12,
            border: '1px solid #e5e7eb', padding: '20px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          }}>
            <div>
              <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{value}</p>
              <span style={{
                fontSize: 11, color: '#9ca3af',
                background: '#f9fafb', padding: '2px 8px', borderRadius: 20,
              }}>{sub}</span>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: color + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} color={color} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        {/* Recent Customers */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #e5e7eb', padding: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Recent Customers</h2>
            <span style={{ fontSize: 12, color: '#4f46e5', cursor: 'pointer' }}>View all</span>
          </div>
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: 13 }}>
            No customers registered yet.
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #e5e7eb', padding: 20,
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Recent Activity</h2>
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: 13 }}>
            No activity yet.
          </div>
        </div>
      </div>

    </Layout>
  );
}
