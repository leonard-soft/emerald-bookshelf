import { Link } from 'react-router-dom';
import { formatDate } from '../components/BorrowTracker';
import { useAuth } from '../context/AuthContext';
import { useLoans } from '../context/LoansContext';

export default function Profile() {
  const { user } = useAuth();
  const { loans, giveBack } = useLoans();
  const daysLeft = (iso: string) => Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);

  return (
    <main id="main">
      <h1>Mis préstamos</h1>
      <p className="muted">{user?.email}</p>
      {loans.length === 0 ? (
        <p>Aún no tienes libros prestados. <Link to="/">Explora el catálogo</Link>.</p>
      ) : (
        <ul className="loan-list">
          {loans.map((l) => {
            const d = daysLeft(l.dueDate);
            return (
              <li key={l.bookId} className="panel loan">
                <div>
                  <Link to={`/book/${l.bookId}`}><strong>{l.title}</strong></Link>
                  <p className="muted small">{l.authors.join(', ')}</p>
                  <p>Vence el {formatDate(l.dueDate)} <span className={`badge ${d < 0 ? 'badge-out' : 'badge-ok'}`}>{d < 0 ? 'Vencido' : `${d} días restantes`}</span></p>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => giveBack(l.bookId)}>Devolver</button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
