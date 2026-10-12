import { useEffect, useState } from 'react';
import type { Book } from '../types';
import { getBook, searchBooks, type OrderBy } from '../services/booksApi';

export function useBooks(query: string, category: string, orderBy: OrderBy) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    searchBooks(query, category, orderBy, controller.signal)
      .then((result) => { setBooks(result); setLoading(false); })
      .catch((e: Error) => {
        if (e.name === 'AbortError') return;
        setBooks([]);
        setError('No se pudo cargar el catálogo. Revisa tu conexión e inténtalo de nuevo.');
        setLoading(false);
      });
    return () => controller.abort();
  }, [query, category, orderBy]);

  return { books, loading, error };
}

export function useBook(id: string | undefined) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getBook(id, controller.signal)
      .then((b) => { setBook(b); setLoading(false); })
      .catch((e: Error) => {
        if (e.name === 'AbortError') return;
        setError('No pudimos cargar este libro.');
        setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  return { book, loading, error };
}
