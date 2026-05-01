import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User } from '../types';
import * as authService from '../services/authService';
import type { LoginInput, RegisterInput } from '@tcc/shared';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tcc_token');
    if (!token) { setIsLoading(false); return; }
    authService.getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('tcc_token'))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (data: LoginInput) => {
    const res = await authService.login(data);
    localStorage.setItem('tcc_token', res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    const res = await authService.register(data);
    localStorage.setItem('tcc_token', res.token);
    setUser(res.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tcc_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
