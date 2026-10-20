import { Link } from 'react-router-dom';
import type { Book } from '../types';

interface Props { book: Book; available?: boolean }

export default function BookCard({ book, available = true }: Props) {
  const titleId = `book-title-${book.id}`;
  return (
    <article className="card" aria-labelledby={titleId}>
    <Link to={`/book/${book.id}`} className="card-link">
    {book.thumbnail ? (
      <img src={book.thumbnail} alt={`Portada de ${book.title}`} loading="lazy" width={128} height={192} />
    ) : (
      <div className="cover-fallback" role="img" aria-label="Portada no disponible">Sin portada</div>
    )}
    <h3
    id={titleId}
    style={{
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}
    >
    {book.title}
    </h3>
    </Link>
    <p
    className="muted"
    style={{
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}
    >
    {book.authors.length ? book.authors.join(', ') : 'Autor desconocido'}
    </p>

    {book.description && (
      <p
      className="description-preview"
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '0.85rem',
        margin: '0.5rem 0'
      }}
      >
      {book.description}
      </p>
    )}

    <div className="card-meta">
    <span className="chip">{book.category}</span>
    <span className={`badge ${available ? 'badge-ok' : 'badge-out'}`}>{available ? 'Disponible' : 'Prestado'}</span>
    </div>
    </article>
  );
}
