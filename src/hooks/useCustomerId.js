import { useAuth } from '../auth/AuthContext';

export function useCustomerId() {
  const { user } = useAuth();
  return user?.customerId ?? null;
}
