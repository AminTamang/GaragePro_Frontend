import {
  Wrench,
  BarChart2,
  Package,
  Users,
  FileText,
  Clock,
  Calendar,
  Bell,
  UserCog,
  ShoppingCart,
  UserPlus,
  ClipboardList,
  History,
  Gift,
  BellRing,
  LogOut,
  Settings,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navByRole = {
  Admin: [
    { icon: BarChart2, label: 'Dashboard', to: '/admin/dashboard' },
    { icon: UserCog, label: 'Staff Management', to: '/admin/staff' },
    { icon: Package, label: 'Parts Management', to: '/admin/parts' },
    { icon: ShoppingCart, label: 'Purchase / Stock', to: '/admin/purchases' },
    { icon: Users, label: 'Vendor Management', to: '/admin/vendors' },
    { icon: FileText, label: 'Reports', to: '/admin/reports/monthly' },
    { icon: BellRing, label: 'Notifications', to: '/admin/notifications' },
    { icon: Gift, label: 'Customer Analytics', to: '/admin/customer-analytics' },
    { icon: Settings, label: 'Settings / Profile', to: '/admin/settings' },
  ],
  Staff: [
    { icon: BarChart2, label: 'Dashboard', to: '/staff/dashboard' },
    { icon: UserPlus, label: 'Register Customer', to: '/staff/customers/register' },
    { icon: Users, label: 'Customer Details', to: '/staff/customers/details' },
    { icon: Clock, label: 'Search Customers', to: '/staff/customers/search' },
    { icon: FileText, label: 'Create Sale', to: '/staff/sales/create' },
    { icon: History, label: 'Sales History', to: '/staff/sales/history' },
    { icon: ClipboardList, label: 'Reports', to: '/staff/reports/high-spenders' },
    { icon: Bell, label: 'Notifications', to: '/staff/notifications' },
    { icon: Calendar, label: 'Appointments', to: '/staff/appointments' },
    { icon: Settings, label: 'Profile', to: '/staff/profile' },
  ],
  Customer: [
    { icon: BarChart2, label: 'Dashboard', to: '/customer/dashboard' },
    { icon: UserCog, label: 'My Profile', to: '/customer/profile' },
    { icon: Users, label: 'My Vehicles', to: '/customer/vehicles' },
    { icon: Calendar, label: 'Appointments', to: '/customer/appointments' },
    { icon: History, label: 'Purchase History', to: '/customer/purchase-history' },
    { icon: Package, label: 'Request Part', to: '/customer/request-part' },
    { icon: Gift, label: 'Loyalty Offers', to: '/customer/loyalty-offers' },
    { icon: Bell, label: 'Notifications', to: '/customer/notifications' },
    { icon: Settings, label: 'Settings', to: '/customer/settings' },
  ],
};

const TITLE_MAP = {
  '/admin/parts/add': 'Add Part',
  '/admin/staff/add': 'Add Staff',
  '/admin/vendors/add': 'Add Vendor',
  '/admin/purchases/create': 'Create Purchase',
  '/staff/sales/create': 'Create Sale',
  '/staff/sales/history': 'Sales History',
  '/staff/customers/register': 'Register Customer',
  '/staff/customers/details': 'Customer Details',
  '/customer/profile': 'My Profile',
  '/customer/purchase-history': 'Purchase History',
};

function titleFromPath(pathname, role) {
  for (const [path, title] of Object.entries(TITLE_MAP)) {
    if (pathname.startsWith(path)) return title;
  }
  if (pathname.includes('/edit')) return 'Edit Record';
  if (pathname.includes('/stock-history')) return 'Stock History';
  if (pathname.includes('/invoices/')) return 'Invoice Detail';
  const item = navByRole[role]?.find((nav) => pathname.startsWith(nav.to));
  return item?.label || `${role} Workspace`;
}

export default function Layout({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const links = navByRole[role] || [];

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to={`/${role.toLowerCase()}/dashboard`} className="logo">
          <div className="logo-icon">
            <Wrench size={18} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <span className="logo-text">GaragePro</span>
        </NavLink>

        <nav className="nav-section">
          <p className="nav-label">{role}</p>
          {links.map(({ icon: Icon, label, to }) => (
            <NavLink key={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} to={to}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">{user?.fullName?.slice(0, 2).toUpperCase() || role.slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="avatar-name">{user?.fullName || role}</div>
            <div className="avatar-role">{role}</div>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="page-title">
            <span className="breadcrumb">{role}</span>
            {titleFromPath(location.pathname, role)}
          </div>
          <div className="topbar-right">
            <button className="btn-ghost" onClick={() => navigate(`/${role.toLowerCase()}/notifications`)}>
              <Bell size={14} /> Notifications
            </button>
            <button className="btn-ghost" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </header>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
