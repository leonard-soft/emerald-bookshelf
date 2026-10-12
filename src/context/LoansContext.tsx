import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Book, Loan, ReadingStatus } from '../types';

export const LOAN_DAYS = 14;
interface State { loans: Loan[]; statuses: Record<string, ReadingStatus> }
const empty: State = { loans: [], statuses: {} };

interface LoansContextValue extends State {
  isBorrowed: (id: string) => boolean;
  borrow: (book: Book) => void;
  giveBack: (id: string) => void;
  getStatus: (id: string) => ReadingStatus;
  setStatus: (id: string, s: ReadingStatus) => void;
}
const LoansContext = createContext<LoansContextValue | undefined>(undefined);

export function LoansProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const key = user ? `emerald_loans_${user.email}` : null;
  const [state, setState] = useState<State>(empty);

  useEffect(() => {
    if (!key) return setState(empty);
    try {
      const raw = localStorage.getItem(key);
      setState(raw ? { ...empty, ...JSON.parse(raw) } : empty);
    } catch {
      setState(empty);
    }
  }, [key]);

  const persist = (next: State) => {
    setState(next);
    if (key) localStorage.setItem(key, JSON.stringify(next));
  };

  const value = useMemo<LoansContextValue>(() => ({
    ...state,
    isBorrowed: (id) => state.loans.some((l) => l.bookId === id),
    borrow: (book) => {
      if (!user || state.loans.some((l) => l.bookId === book.id)) return;
      const now = new Date();
      const due = new Date(now.getTime() + LOAN_DAYS * 86_400_000);
      const loan: Loan = {
        bookId: book.id, title: book.title, authors: book.authors, thumbnail: book.thumbnail,
        borrowedAt: now.toISOString(), dueDate: due.toISOString()
      };
      persist({ ...state, loans: [loan, ...state.loans] });
    },
    giveBack: (id) => persist({ ...state, loans: state.loans.filter((l) => l.bookId !== id) }),
    getStatus: (id) => state.statuses[id] ?? 'por-leer',
    setStatus: (id, s) => persist({ ...state, statuses: { ...state.statuses, [id]: s } })
  }), [state, user, key]);

  return <LoansContext.Provider value={value}>{children}</LoansContext.Provider>;
}

export function useLoans(): LoansContextValue {
  const ctx = useContext(LoansContext);
  if (!ctx) throw new Error('useLoans debe usarse dentro de <LoansProvider>');
  return ctx;
}
