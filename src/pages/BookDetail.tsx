import { Link, useParams } from 'react-router-dom';
import BorrowTracker from '../components/BorrowTracker';
import { useBook } from '../hooks/useBooks';

export default function BookDetail() {
  const { id } = useParams();
  const { book, loading, error } = useBook(id);

  if (loading) return <p role="status">Cargando libro…</p>;
  if (error || !book) return <main><p role="alert" className="error">{error ?? 'Libro no encontrado.'}</p><Link to="/">Volver al catálogo</Link></main>;

  return (
    <main id="main" className="detail">
      <Link to="/">Volver al catálogo</Link>
      <div className="detail-grid">
        {book.thumbnail
          ? <img src={book.thumbnail} alt={`Portada de ${book.title}`} loading="lazy" width={200} height={300} />
          : <div className="cover-fallback" role="img" aria-label="Portada no disponible">Sin portada</div>}
        <article>
          <h1>{book.title}</h1>
          <p className="muted">{book.authors.join(', ') || 'Autor desconocido'} · {book.category}</p>
          {book.publishedDate && <p className="small muted">Publicado: {book.publishedDate}{book.pageCount ? ` · ${book.pageCount} páginas` : ''}</p>}
          <p className="description">{book.description ?? 'Este libro no tiene descripción.'}</p>
          <BorrowTracker book={book} />
        </article>
      </div>
    </main>
  );
}
