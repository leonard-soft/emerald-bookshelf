import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LOAN_DAYS, useLoans } from '../context/LoansContext';
import type { Book, ReadingStatus } from '../types';

const STATUSES: { value: ReadingStatus; label: string }[] = [
  { value: 'por-leer', label: 'Por leer' },
  { value: 'leyendo', label: 'Leyendo' },
  { value: 'completado', label: 'Completado' }
];
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

export default function BorrowTracker({ book }: { book: Book }) {
  const { isAuthenticated } = useAuth();
  const { loans, isBorrowed, borrow, giveBack, getStatus, setStatus } = useLoans();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <section className="panel" aria-label="Préstamo">
        <p>Inicia sesión para pedir prestado este libro y seguir tu lectura.</p>
        <Link to="/login" state={{ from: location.pathname }} className="btn">Iniciar sesión</Link>
      </section>
    );
  }

  const loan = loans.find((l) => l.bookId === book.id);
  return (
    <section className="panel" aria-label="Préstamo y progreso de lectura">
      <fieldset className="status-group">
        <legend>Estado de lectura</legend>
        {STATUSES.map((s) => (
          <label key={s.value} className="radio-pill">
            <input type="radio" name={`status-${book.id}`} value={s.value}
              checked={getStatus(book.id) === s.value} onChange={() => setStatus(book.id, s.value)} />
            <span>{s.label}</span>
          </label>
        ))}
      </fieldset>
      {isBorrowed(book.id) && loan ? (
        <div>
          <p role="status">Vence el <strong>{formatDate(loan.dueDate)}</strong></p>
          <button type="button" className="btn btn-ghost" onClick={() => giveBack(book.id)}>Devolver libro</button>
        </div>
      ) : (
        <div>
          <p className="muted">Préstamo de {LOAN_DAYS} días.</p>
          <button type="button" className="btn" onClick={() => borrow(book)}>Tomar prestado</button>
        </div>
      )}
    </section>
  );
}
