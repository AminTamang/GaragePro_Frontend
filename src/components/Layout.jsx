import { useState } from 'react';
import {
  Wrench,
  BarChart2,
  Package,
  Users,
  FileText,
  Clock,
  Calendar,
  Bell,
  Download,
  UserCog,
  ShoppingCart,
  UserPlus,
  ClipboardList,
  History,
  Gift,
  BellRing,
} from 'lucide-react';
import { navItems } from '../data/MockData';
import { getAuthToken, setAuthToken } from '../services/apiClient';

const sidebarLinks = [
  { icon: BarChart2, label: 'Financial Reports', id: 'financials' },
  { icon: UserCog, label: 'Staff Management', id: 'staffManagement' },
  { icon: Package, label: 'Parts Management', id: 'partsManagement' },
  { icon: ShoppingCart, label: 'Purchase / Stock', id: 'purchaseStock' },
  { icon: Users, label: 'Vendor Management', id: 'vendors' },
  { icon: UserPlus, label: 'Register + Vehicle', id: 'registerVehicle' },
  { icon: FileText, label: 'Sales & Invoices', id: 'salesInvoice' },
  { icon: Users, label: 'Customer Details', id: 'customerDetails' },
  { icon: ClipboardList, label: 'Customer Reports', id: 'customerReports' },
  { icon: Clock, label: 'Customer Search', id: 'customers' },
  { icon: FileText, label: 'Invoice Email', id: 'invoiceEmail' },
  { icon: UserPlus, label: 'Customer Registration', id: 'customerRegistration' },
  { icon: Calendar, label: 'Appointments / Reviews', id: 'appointmentsRequestsReviews' },
  { icon: History, label: 'Service History', id: 'purchaseHistory' },
  { icon: BellRing, label: 'Notifications', id: 'notifications' },
  { icon: Gift, label: 'Loyalty Offers', id: 'loyaltyOffers' },
];

export default function Layout({ activePage, setActivePage, children }) {
  const [token, setToken] = useState(getAuthToken());
  const activeMeta = navItems.find((n) => n.id === activePage);

  function saveToken() {
    setAuthToken(token);
  }

  function exportPageInfo() {
    const blob = new Blob([JSON.stringify(activeMeta, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activePage}-page-info.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">
            <Wrench size={18} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <span className="logo-text">GaragePro</span>
        </div>

        <nav className="nav-section">
          <p className="nav-label">Main</p>
          {sidebarLinks.map(({ icon: Icon, label, id }) => (
            <button
              key={label}
              className={`nav-item ${activePage === id && id !== null ? 'active' : ''}`}
              onClick={() => id && setActivePage(id)}
              style={{ cursor: id ? 'pointer' : 'default' }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="avatar">AD</div>
          <div>
            <div className="avatar-name">Admin</div>
            <div className="avatar-role">Super Admin</div>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="page-title">
            <span className="breadcrumb">
              {activeMeta?.role} / {activeMeta?.feature}
            </span>
            {activeMeta?.label}
          </div>
          <div className="topbar-right">
            <label className="token-field">
              <input
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Paste JWT token"
              />
            </label>
            <button className="btn-primary" onClick={saveToken}>
              Save Token
            </button>
            <button className="btn-ghost" onClick={() => setActivePage('notifications')}>
              <Bell size={14} /> Notifications
            </button>
            <button className="btn-ghost" onClick={exportPageInfo}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </header>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}
