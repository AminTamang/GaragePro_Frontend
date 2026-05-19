import { Package, CreditCard } from 'lucide-react';
import NotificationsInboxPage from '../shared/NotificationsInboxPage';
import { apiRequest } from '../../services/apiClient';
import { useToast } from '../../components/ToastProvider';

export default function AdminNotificationsPage() {
  const { showToast } = useToast();

  async function runAction(path, label) {
    try {
      const payload = await apiRequest(path, { method: 'POST' });
      showToast(payload.message || `${label} completed.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  return (
    <>
      <section className="panel-card admin-actions-bar">
        <h2>System Actions</h2>
        <div className="action-row">
          <button type="button" className="btn-secondary" onClick={() => runAction('/api/system/notifications/check-low-stock', 'Low stock check')}>
            <Package size={16} /> Check Low Stock
          </button>
          <button type="button" className="btn-secondary" onClick={() => runAction('/api/system/notifications/send-overdue-credit-reminders', 'Credit reminders')}>
            <CreditCard size={16} /> Send Credit Reminders
          </button>
        </div>
      </section>
      <NotificationsInboxPage
        title="Notification Center"
        description="Manage system notifications, low-stock alerts, and credit reminders."
      />
    </>
  );
}
