import { useAuth } from '../auth/AuthContext';
import CustomerAppointmentsPage from './customer/AppointmentsPage';
import StaffAppointmentsPage from './staff/StaffAppointmentsPage';

export default function AppointmentsRequestsReviewsPage() {
  const { role } = useAuth();
  if (role === 'Customer') {
    return <CustomerAppointmentsPage />;
  }
  return <StaffAppointmentsPage />;
}
