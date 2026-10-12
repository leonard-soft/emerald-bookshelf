import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '../types';

export const SESSION_KEY = 'emerald_session';
export const SIMULATED_TOKEN = 'Bearer emerald-token-123';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const s = raw ? (JSON.parse(raw) as Session) : null;
    return s?.token && s.user?.email ? s : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(readSession);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 150));
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) throw new Error('Credenciales inválidas');
    const next: Session = { token: SIMULATED_TOKEN, user: { email, name: email.split('@')[0] } };
    localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ user: session?.user ?? null, token: session?.token ?? null, isAuthenticated: !!session, login, logout }),
    [session, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
