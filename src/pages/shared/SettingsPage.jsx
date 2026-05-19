import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import LoadingState from '../../components/LoadingState';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../../components/ToastProvider';
import { apiRequest } from '../../services/apiClient';
import { getPreferences, savePreferences } from '../../utils/userPreferences';

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="settings-toggle">
      <div>
        <strong>{label}</strong>
        {description && <p>{description}</p>}
      </div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export default function SettingsPage({ role: roleProp }) {
  const { user, role: authRole, logout } = useAuth();
  const role = roleProp || authRole;
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [prefs, setPrefs] = useState(() => getPreferences(role));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const payload = await apiRequest('/api/auth/me');
        setProfile(payload.data);
      } catch {
        setProfile(user);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  function updatePref(key, value) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    savePreferences(role, next);
    showToast('Settings saved.', 'success');
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const roleLabels = { Admin: 'Administrator', Staff: 'Staff member', Customer: 'Customer' };

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings & Profile"
        description="Manage your account details and workspace preferences."
      />

      {loading ? <LoadingState /> : (
        <div className="settings-layout animate-in">
          <section className="panel-card">
            <h2>Account</h2>
            <dl className="detail-list">
              <div><dt>Name</dt><dd>{profile?.fullName || user?.fullName}</dd></div>
              <div><dt>Email</dt><dd>{profile?.email || user?.email}</dd></div>
              <div><dt>Role</dt><dd>{roleLabels[role] || role}</dd></div>
              {profile?.customerId && <div><dt>Customer ID</dt><dd>{profile.customerId}</dd></div>}
              {profile?.staffId && <div><dt>Staff ID</dt><dd>{profile.staffId}</dd></div>}
            </dl>
            <div className="settings-actions">
              {role === 'Customer' && (
                <button type="button" className="btn-secondary" onClick={() => navigate('/customer/profile')}>
                  Edit profile details
                </button>
              )}
              <button type="button" className="btn-secondary" onClick={handleLogout}>Sign out</button>
            </div>
          </section>

          <section className="panel-card">
            <h2>Preferences</h2>
            <div className="settings-toggles">
              <Toggle label="Compact tables" description="Show more rows with tighter spacing." checked={prefs.compactTables} onChange={(v) => updatePref('compactTables', v)} />
              <Toggle label="Email alerts" description="In-app prompts for important events." checked={prefs.emailAlerts} onChange={(v) => updatePref('emailAlerts', v)} />
              <Toggle label="Show tips" description="Helpful hints on dashboard cards." checked={prefs.showTips} onChange={(v) => updatePref('showTips', v)} />
              {role === 'Admin' && (
                <>
                  <label className="settings-field">
                    <strong>Default financial report</strong>
                    <select value={prefs.defaultReport} onChange={(e) => updatePref('defaultReport', e.target.value)}>
                      <option value="daily">Daily</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </label>
                  <label className="settings-field">
                    <strong>Low stock threshold</strong>
                    <input type="number" min="1" max="100" value={prefs.lowStockThreshold} onChange={(e) => updatePref('lowStockThreshold', Number(e.target.value))} />
                  </label>
                </>
              )}
              {role === 'Staff' && (
                <Toggle label="Remember last search" description="Keeps your previous customer search term." checked={prefs.rememberLastSearch} onChange={(v) => updatePref('rememberLastSearch', v)} />
              )}
              {role === 'Customer' && (
                <>
                  <Toggle label="Appointment reminders" description="Highlight upcoming appointments." checked={prefs.appointmentReminders} onChange={(v) => updatePref('appointmentReminders', v)} />
                  <Toggle label="Marketing & offers" description="Show loyalty offers prominently." checked={prefs.marketingEmails} onChange={(v) => updatePref('marketingEmails', v)} />
                </>
              )}
            </div>
          </section>

          <section className="panel-card">
            <h2>Quick links</h2>
            <div className="quick-links">
              {role === 'Admin' && (
                <>
                  <button type="button" className="btn-secondary" onClick={() => navigate('/admin/notifications')}>Notifications</button>
                  <button type="button" className="btn-secondary" onClick={() => navigate('/admin/reports/inventory')}>Inventory</button>
                </>
              )}
              {role === 'Staff' && (
                <>
                  <button type="button" className="btn-secondary" onClick={() => navigate('/staff/sales/create')}>Create sale</button>
                  <button type="button" className="btn-secondary" onClick={() => navigate('/staff/customers/search')}>Search customers</button>
                </>
              )}
              {role === 'Customer' && (
                <>
                  <button type="button" className="btn-secondary" onClick={() => navigate('/customer/appointments')}>Appointments</button>
                  <button type="button" className="btn-secondary" onClick={() => navigate('/customer/purchase-history')}>History</button>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
