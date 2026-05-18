import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

import LoginPage               from '../pages/LoginPage';
import RegisterPage            from '../pages/RegisterPage';
import RegisterCustomerPage    from '../pages/staff/RegisterCustomerPage';
import CustomerDetailsPage     from '../pages/staff/CustomerDetailsPage';
import AppointmentsPage        from '../pages/customer/AppointmentsPage';
import UnavailablePartsPage    from '../pages/customer/UnavailablePartsPage';
import ReviewsPage             from '../pages/customer/ReviewsPage';

function RoleHome() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const role = user.role?.toLowerCase();
  if (role === 'customer') return <Navigate to="/customer/appointments" replace />;
  return <Navigate to="/staff/register-customer" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Root redirect */}
      <Route path="/" element={<RoleHome />} />

      {/* Staff + Admin routes — Feature 6 & 8 (Ryan Khan) */}
      <Route path="/staff/register-customer" element={
        <ProtectedRoute roles={['Staff', 'Admin']}>
          <RegisterCustomerPage />
        </ProtectedRoute>
      } />
      <Route path="/staff/customers" element={
        <ProtectedRoute roles={['Staff', 'Admin']}>
          <CustomerDetailsPage />
        </ProtectedRoute>
      } />

      {/* Customer routes — Feature 13 (Ryan Khan) */}
      <Route path="/customer/appointments" element={
        <ProtectedRoute roles={['Customer']}>
          <AppointmentsPage />
        </ProtectedRoute>
      } />
      <Route path="/customer/unavailable-parts" element={
        <ProtectedRoute roles={['Customer']}>
          <UnavailablePartsPage />
        </ProtectedRoute>
      } />
      <Route path="/customer/reviews" element={
        <ProtectedRoute roles={['Customer']}>
          <ReviewsPage />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
