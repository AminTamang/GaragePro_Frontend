import { createContext, useContext, useMemo, useState } from 'react';
import { axiosClient, clearAuthToken, setAuthToken } from '../services/apiClient';

const AUTH_USER_KEY = 'garagepro_user';
const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);

  async function login(email, password) {
    setLoading(true);
    try {
      const { data: payload } = await axiosClient.post('/api/auth/login', { email, password });
      const authUser = payload.data;
      setAuthToken(authUser.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return authUser;
    } finally {
      setLoading(false);
    }
  }

  async function register(form) {
    setLoading(true);
    try {
      const { data: payload } = await axiosClient.post('/api/auth/register', {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phoneNumber: form.phoneNumber,
        address: form.address,
        vehiclePlate: form.vehiclePlate,
        make: form.make,
        model: form.model,
        vehicleType: form.vehicleType,
        manufactureYear: form.manufactureYear ? Number(form.manufactureYear) : null,
        role: 'Customer',
      });
      const authUser = payload.data;
      setAuthToken(authUser.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      return authUser;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    clearAuthToken();
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user?.token),
      role: user?.role,
      login,
      logout,
      register,
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
