import { createContext, useContext, useEffect, useState } from 'react';
import api from '@src/services/apiService';

type User = { id: number; username: string; is_admin: boolean };

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMe = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { user } = await api.get<{ user: User }>("/users/me");
      setUser(user);
    } catch (err: any) {
      setUser(null);
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        null
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    fetchMe();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, refresh: fetchMe, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}