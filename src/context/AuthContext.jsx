import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('gp_user');
    return stored ? JSON.parse(stored) : null;
  });

  // Attach token to every request when user is logged in
  useEffect(() => {
    if (user?.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const login = (userData) => {
    // userData = AuthResponse: { token, role, customerId, staffId, fullName, email }
    localStorage.setItem('gp_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('gp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
