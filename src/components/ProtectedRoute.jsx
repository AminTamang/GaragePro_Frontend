import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// roles: array of allowed roles e.g. ['Staff', 'Admin'] or ['Customer']
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.map(r => r.toLowerCase()).includes(user.role?.toLowerCase())) {
    // Wrong role — redirect to their home
    const role = user.role?.toLowerCase();
    if (role === 'customer') return <Navigate to="/customer/appointments" replace />;
    return <Navigate to="/staff/register-customer" replace />;
  }

  return children;
}
