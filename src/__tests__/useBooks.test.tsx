import { renderHook, waitFor } from '@testing-library/react';
import { useBook, useBooks } from '../hooks/useBooks';
import type { OrderBy } from '../services/booksApi';

const fetchMock = jest.fn();
beforeEach(() => { fetchMock.mockReset(); globalThis.fetch = fetchMock as unknown as typeof fetch; });

const volume = (id: string, title: string) => ({
  id,
  volumeInfo: {
    title, authors: ['Autora Uno'], categories: ['Science'],
    imageLinks: { thumbnail: 'http://books.google.com/c.jpg' }, description: '<p>Un <b>gran</b> libro</p>'
  }
});
const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });

describe('useBooks', () => {
  it('carga y transforma los libros de Google Books', async () => {
    fetchMock.mockResolvedValue(ok({ items: [volume('1', 'Cosmos')] }));
    const { result } = renderHook(() => useBooks('cosmos', '', 'relevance'));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.books).toEqual([
      expect.objectContaining({ id: '1', title: 'Cosmos', authors: ['Autora Uno'], category: 'Science', thumbnail: 'https://books.google.com/c.jpg' })
    ]);
  });

  it('construye la URL con palabra clave, categoría y orden', async () => {
    fetchMock.mockResolvedValue(ok({ items: [] }));
    const { result } = renderHook(() => useBooks('García Márquez', 'fiction', 'newest'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain('https://www.googleapis.com/books/v1/volumes?q=');
    expect(url).toContain(encodeURIComponent('García Márquez'));
    expect(url).toContain('subject%3Afiction');
    expect(url).toContain('orderBy=newest');
  });

  it('devuelve lista vacía cuando la API no trae items', async () => {
    fetchMock.mockResolvedValue(ok({}));
    const { result } = renderHook(() => useBooks('zzzz', '', 'relevance'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.books).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('expone un mensaje de error si la API responde con fallo', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
    const { result } = renderHook(() => useBooks('x', '', 'relevance'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/no se pudo cargar el catálogo/i);
    expect(result.current.books).toEqual([]);
  });

  it('expone un error cuando falla la red', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useBooks('x', '', 'relevance'));
    await waitFor(() => expect(result.current.error).not.toBeNull());
  });

  it('vuelve a consultar cuando cambian los filtros', async () => {
    fetchMock.mockResolvedValue(ok({ items: [volume('1', 'Uno')] }));
    const { result, rerender } = renderHook(
      ({ cat, ord }: { cat: string; ord: OrderBy }) => useBooks('libros', cat, ord),
      { initialProps: { cat: '', ord: 'relevance' as OrderBy } }
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fetchMock.mockResolvedValue(ok({ items: [volume('2', 'Dos')] }));
    rerender({ cat: 'history', ord: 'relevance' });
    await waitFor(() => expect(result.current.books[0]?.title).toBe('Dos'));
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toContain('subject%3Ahistory');
  });
});

describe('useBook', () => {
  it('carga el detalle y limpia el HTML de la descripción', async () => {
    fetchMock.mockResolvedValue(ok(volume('42', 'Detalle')));
    const { result } = renderHook(() => useBook('42'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchMock.mock.calls[0][0]).toBe('https://www.googleapis.com/books/v1/volumes/42');
    expect(result.current.book?.description).toBe('Un gran libro');
  });
});
