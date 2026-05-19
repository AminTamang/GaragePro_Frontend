import { useAuth } from '../auth/AuthContext';
import AdminNotificationsPage from './admin/AdminNotificationsPage';
import NotificationsInboxPage from './shared/NotificationsInboxPage';

export default function NotificationsPage() {
  const { role } = useAuth();

  if (role === 'Admin') {
    return <AdminNotificationsPage />;
  }

  return (
    <NotificationsInboxPage
      title="My Notifications"
      description="Read and acknowledge alerts relevant to your account."
    />
  );
}
