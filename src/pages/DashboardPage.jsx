import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, BellRing, Package, Users, FileText, History, Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import AlertBanner from '../components/AlertBanner';
import LoadingState from '../components/LoadingState';
import { apiRequest } from '../services/apiClient';
import { useAuth } from '../auth/AuthContext';
import { buildPagedQuery, unwrapPagedData } from '../utils/pagedApi';
import { getPreferences } from '../utils/userPreferences';

const dashboards = {
  Admin: [
    { title: 'Parts & Inventory', copy: 'Manage stock, purchases, and vendors.', icon: Package, to: '/admin/parts', color: 'ki-blue' },
    { title: 'Financial Reports', copy: 'Daily, monthly, and yearly revenue.', icon: BarChart2, to: '/admin/reports/monthly', color: 'ki-green' },
    { title: 'Staff & Customers', copy: 'Team management and analytics.', icon: Users, to: '/admin/staff', color: 'ki-purple' },
    { title: 'Notifications', copy: 'Low stock alerts and credit reminders.', icon: BellRing, to: '/admin/notifications', color: 'ki-amber' },
  ],
  Staff: [
    { title: 'Create Sale', copy: 'New invoice and stock deduction.', icon: FileText, to: '/staff/sales/create', color: 'ki-blue' },
    { title: 'Sales History', copy: 'Browse completed sales and invoices.', icon: History, to: '/staff/sales/history', color: 'ki-green' },
    { title: 'Find Customers', copy: 'Search and open customer profiles.', icon: Users, to: '/staff/customers/search', color: 'ki-purple' },
    { title: 'Appointments', copy: 'View customer appointment requests.', icon: Calendar, to: '/staff/appointments', color: 'ki-amber' },
  ],
  Customer: [
    { title: 'Book Service', copy: 'Schedule your next garage visit.', icon: Calendar, to: '/customer/appointments', color: 'ki-blue' },
    { title: 'My Vehicles', copy: 'Registered cars and bikes.', icon: Package, to: '/customer/vehicles', color: 'ki-green' },
    { title: 'Purchase History', copy: 'Invoices and past services.', icon: History, to: '/customer/purchase-history', color: 'ki-purple' },
    { title: 'Loyalty Offers', copy: 'Discounts and rewards.', icon: BellRing, to: '/customer/loyalty-offers', color: 'ki-amber' },
  ],
};

export default function DashboardPage({ role = 'Admin' }) {
  const { user } = useAuth();
  const [adminSummary, setAdminSummary] = useState(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [staffSummary, setStaffSummary] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifiedLowStock, setNotifiedLowStock] = useState(false);
  const cards = dashboards[role] || dashboards.Admin;
  const prefs = useMemo(() => getPreferences(role), [role]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    async function loadAdmin() {
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const [financial, inventory] = await Promise.all([
          apiRequest(`/api/admin/reports/financial?type=monthly&year=${year}&month=${month}`),
          apiRequest(`/api/admin/reports/inventory`),
        ]);
        if (!active) return;
        setAdminSummary(financial.data || financial);
        const inventorySummary = inventory.data || {};
        setLowStockCount(inventorySummary.lowStockCount || 0);
      } catch (err) {
        if (!active) return;
        setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    async function loadStaff() {
      try {
        const query = buildPagedQuery({ page: 1, pageSize: 6, sortBy: 'date', sortDir: 'desc' });
        const payload = await apiRequest(`/api/staff/sales?${query}`);
        const paged = unwrapPagedData(payload);
        if (!active) return;
        const today = new Date().toISOString().slice(0, 10);
        const todays = paged.items.filter((item) => (item.invoiceDate || '').slice(0, 10) === today);
        const total = todays.reduce((sum, item) => sum + Number(item.finalTotal ?? item.invoiceTotal ?? 0), 0);
        setStaffSummary({
          todayCount: todays.length,
          todayTotal: total,
        });
        setRecentInvoices(paged.items.slice(0, 5));
      } catch (err) {
        if (!active) return;
        setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    async function loadCustomer() {
      try {
        const customerId = user?.customerId;
        if (!customerId) {
          setError('Your account is not linked to a customer profile.');
          return;
        }
        const payload = await apiRequest(`/api/customers/appointments?customerId=${customerId}`);
        const rows = Array.isArray(payload.data) ? payload.data : [];
        const upcoming = rows.filter((row) => new Date(row.appointmentDate || row.apptDate).getTime() >= Date.now());
        if (!active) return;
        setAppointments(upcoming.slice(0, 4));
      } catch (err) {
        if (!active) return;
        setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (role === 'Admin') loadAdmin();
    if (role === 'Staff') loadStaff();
    if (role === 'Customer') loadCustomer();

    return () => {
      active = false;
    };
  }, [role, user]);

  useEffect(() => {
    if (role !== 'Admin' || notifiedLowStock || !prefs.emailAlerts) return;
    if (lowStockCount > 0) {
      (async () => {
        try {
          await apiRequest('/api/system/notifications/check-low-stock', { method: 'POST' });
          setNotifiedLowStock(true);
        } catch (err) {
          setError(err.message);
        }
      })();
    }
  }, [role, lowStockCount, prefs.emailAlerts, notifiedLowStock]);

  return (
    <>
      <PageHeader
        eyebrow={`${role} Dashboard`}
        title={`Welcome back${user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}`}
        description="Quick access to your most-used workflows."
      />

      <AlertBanner type="error">{error}</AlertBanner>

      {loading && <LoadingState />}

      {role === 'Admin' && !loading && (
        <>
          {lowStockCount > 0 && (
            <AlertBanner type="warning">
              {lowStockCount} parts are below the low-stock threshold ({prefs.lowStockThreshold}). Review inventory and reorder.
            </AlertBanner>
          )}
          {adminSummary && (
            <section className="kpi-grid animate-in">
              <article className="kpi-card"><span>Total Revenue</span><strong>Rs. {Number(adminSummary.totalSales || 0).toLocaleString()}</strong></article>
              <article className="kpi-card"><span>Invoices</span><strong>{adminSummary.invoiceCount ?? 0}</strong></article>
              <article className="kpi-card"><span>Outstanding</span><strong>Rs. {Number(adminSummary.outstandingAmount || adminSummary.unpaidTotal || 0).toLocaleString()}</strong></article>
              <article className="kpi-card"><span>Low Stock</span><strong>{lowStockCount}</strong></article>
            </section>
          )}
        </>
      )}

      {role === 'Staff' && !loading && (
        <>
          <section className="kpi-grid animate-in">
            <article className="kpi-card"><span>Today&apos;s Invoices</span><strong>{staffSummary?.todayCount ?? 0}</strong></article>
            <article className="kpi-card"><span>Today&apos;s Sales</span><strong>Rs. {Number(staffSummary?.todayTotal || 0).toLocaleString()}</strong></article>
          </section>
          <section className="panel-card table-card animate-in">
            <h2>Recent Invoices</h2>
            <div className="table-wrap">
              <table className="report-table">
                <thead><tr><th>#</th><th>Customer</th><th>Total</th><th>Date</th></tr></thead>
                <tbody>
                  {recentInvoices.length === 0 ? (
                    <tr><td colSpan="4" className="empty-cell">No recent invoices.</td></tr>
                  ) : recentInvoices.map((inv) => (
                    <tr key={inv.invoiceId || inv.id}>
                      <td>{inv.invoiceId || inv.id}</td>
                      <td>{inv.customerName || inv.customer}</td>
                      <td>Rs. {Number(inv.finalTotal ?? inv.invoiceTotal ?? 0).toLocaleString()}</td>
                      <td>{new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {role === 'Customer' && !loading && (
        <>
          <section className="panel-card animate-in">
            <h2>Welcome</h2>
            <p>Manage your profile, vehicles, appointments, and history from one place.</p>
          </section>
          <section className="panel-card animate-in">
            <h2>Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <p className="status-text">No upcoming appointments. Book a service visit to get started.</p>
            ) : (
              <div className="chip-list">
                {appointments.map((appt) => (
                  <span key={appt.appointmentId || appt.id} className="chip">
                    {appt.vehiclePlate} · {new Date(appt.appointmentDate || appt.apptDate).toLocaleString()}
                  </span>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <section className="dash-card-grid animate-in">
        {cards.map(({ title, copy, icon: Icon, to, color }) => (
          <Link key={to} to={to} className="dash-card panel-card">
            <div className={`kpi-icon ${color}`}><Icon size={20} /></div>
            <h3>{title}</h3>
            <p>{copy}</p>
            <span className="dash-card-link">Open →</span>
          </Link>
        ))}
      </section>
    </>
  );
}
