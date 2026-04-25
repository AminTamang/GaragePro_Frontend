import { Search } from 'lucide-react';

export default function Header({ title }) {
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

        {/* Avatar */}
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: '#4f46e5', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer',
        }}>R</div>
      </div>
    </header>
  );
}
