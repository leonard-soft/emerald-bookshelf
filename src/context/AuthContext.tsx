import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Session, User } from '../types';

export const SESSION_KEY = 'emerald_session';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
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

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 30,
      }),
    });

    if (!res.ok) {
      throw new Error('Credenciales inválidas o error en el servidor');
    }

    const data = await res.json();
    const rawToken = data.token || data.accessToken;

    const next: Session = {
      token: `Bearer ${rawToken}`,
      user: {
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
      },
    };

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

export const SIMULATED_TOKEN = 'Bearer mock-token';
