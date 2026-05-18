import { Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ title }) {
  const { user } = useAuth();
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header style={{
      height: 60, background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
    }}>
      <h1 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>{title}</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#f9fafb', border: '1px solid #e5e7eb',
          borderRadius: 8, padding: '6px 12px',
        }}>
          <Search size={14} color="#9ca3af" />
          <input
            placeholder="Search customers, parts..."
            style={{
              border: 'none', background: 'transparent',
              fontSize: 13, color: '#374151', outline: 'none', width: 200,
            }}
          />
        </div>

        {/* Notification bell */}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Bell size={18} color="#9ca3af" />
        </button>

        {/* Avatar with real initials */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: '#4f46e5', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer',
          title: user?.fullName,
        }}>{initials}</div>
      </div>
    </header>
  );
}

