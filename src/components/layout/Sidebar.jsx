import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, CalendarDays, Wrench, Star, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logout as logoutApi } from '../../services/authService';

const STAFF_NAV = [
  { to: '/staff/register-customer', icon: UserPlus,       label: 'Register Customer' },
  { to: '/staff/customers',         icon: Users,           label: 'Customer Details'  },
];

const CUSTOMER_NAV = [
  { to: '/customer/appointments',     icon: CalendarDays, label: 'Appointments'   },
  { to: '/customer/unavailable-parts',icon: Wrench,       label: 'Part Requests'  },
  { to: '/customer/reviews',          icon: Star,         label: 'My Reviews'     },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const role = user?.role?.toLowerCase();
  const navItems = role === 'customer' ? CUSTOMER_NAV : STAFF_NAV;

  const handleLogout = async () => {
    try { await logoutApi(); } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  return (
    <aside style={{
      width: 220, background: '#fff', borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column', height: '100vh',
      position: 'sticky', top: 0, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: '#4f46e5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>G</span>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>GaragePro</p>
            <p style={{ fontSize: 10, color: '#9ca3af', textTransform: 'capitalize' }}>{role} portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8, textDecoration: 'none',
            fontSize: 13, fontWeight: 500,
            background: isActive ? '#eef2ff' : 'transparent',
            color: isActive ? '#4f46e5' : '#6b7280',
          })}>
            {({ isActive }) => (
              <>
                <Icon size={16} color={isActive ? '#4f46e5' : '#9ca3af'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid #f3f4f6' }}>
        <div style={{ padding: '8px 12px', marginBottom: 4 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: '#111827', marginBottom: 2 }}>
            {user?.fullName}
          </p>
          <p style={{ fontSize: 11, color: '#9ca3af' }}>{user?.email}</p>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 8, border: 'none',
          background: 'transparent', cursor: 'pointer', fontSize: 13,
          fontWeight: 500, color: '#ef4444',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={16} color="#ef4444" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
