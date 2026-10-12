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
    <main id="main">
      <h1>Catálogo</h1>
      <form role="search" className="filters" onSubmit={onSearch}>
        <div className="field grow">
          <label htmlFor="q">Buscar por título o autor</label>
          <input id="q" type="search" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Ej. García Márquez" />
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
        <button type="submit" className="btn">Buscar</button>
      </form>

      {loading && <p role="status">Cargando libros…</p>}
      {error && <p role="alert" className="error">{error}</p>}
      {!loading && !error && books.length === 0 && <p>No encontramos libros. Prueba con otra palabra clave o categoría.</p>}
      <ul className="grid" aria-label="Resultados">
        {books.map((b) => <li key={b.id}><BookCard book={b} available={!isBorrowed(b.id)} /></li>)}
      </ul>
    </main>
  );
}
