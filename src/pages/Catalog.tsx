import { useState, type FormEvent } from 'react';
import BookCard from '../components/BookCard';
import { useBooks } from '../hooks/useBooks';
import { useLoans } from '../context/LoansContext';
import { CATEGORIES, type OrderBy } from '../services/booksApi';

export default function Catalog() {
  const [term, setTerm] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [orderBy, setOrderBy] = useState<OrderBy>('relevance');
  const { books, loading, error } = useBooks(query, category, orderBy);
  const { isBorrowed } = useLoans();

  const onSearch = (e: FormEvent) => { e.preventDefault(); setQuery(term); };

  return (
    <main id="main" className="catalog-page">
    <div className="catalog-header" style={{ marginBottom: '1.5rem' }}>
    <h1>Catálogo de Libros</h1>
    <p className="muted">Explora nuestra colección literaria en tiempo real desde Open Library.</p>
    </div>

    <form role="search" className="filters panel" onSubmit={onSearch} style={{ padding: '1.25rem', marginBottom: '2rem' }}>
    <div className="field grow">
    <label htmlFor="q">Buscar por título o autor</label>
    <input id="q" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Ej. Cien años de soledad" />
    </div>
    <div className="field">
    <label htmlFor="cat">Categoría</label>
    <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)}>
    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
    </select>
    </div>
    <div className="field">
    <label htmlFor="ord">Ordenar por</label>
    <select id="ord" value={orderBy} onChange={(e) => setOrderBy(e.target.value as OrderBy)}>
    <option value="relevance">Relevancia</option>
    <option value="newest">Más recientes</option>
    </select>
    </div>
    <button type="submit" className="btn" style={{ alignSelf: 'flex-end' }}>Buscar</button>
    </form>

    {!loading && !error && (
      <div className="catalog-status" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span className="muted small">
      {books.length > 0 ? `Mostrando ${books.length} resultados` : ''}
      </span>
      </div>
    )}

    {loading && <p role="status" className="loading-state" style={{ textAlign: 'center', padding: '2rem' }}>Cargando libros…</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {!loading && !error && books.length === 0 && (
      <div className="empty-state panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <p>No encontramos libros. Prueba con otra palabra clave o categoría.</p>
      </div>
    )}

    <ul className="grid" aria-label="Resultados">
    {books.map((b) => <li key={b.id}><BookCard book={b} available={!isBorrowed(b.id)} /></li>)}
    </ul>
    </main>
  );
}
