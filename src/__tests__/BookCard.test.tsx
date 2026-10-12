import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../components/BookCard';
import type { Book } from '../types';

const book: Book = {
  id: 'abc123', title: 'Cien años de soledad', authors: ['Gabriel García Márquez', 'Otro Autor'],
  category: 'Fiction', thumbnail: 'https://books.google.com/cover.jpg'
};
const renderCard = (b: Book = book, available?: boolean) =>
  render(<MemoryRouter><BookCard book={b} available={available} /></MemoryRouter>);

describe('BookCard', () => {
  it('muestra título, autores y categoría', () => {
    renderCard();
    expect(screen.getByRole('heading', { name: 'Cien años de soledad' })).toBeInTheDocument();
    expect(screen.getByText('Gabriel García Márquez, Otro Autor')).toBeInTheDocument();
    expect(screen.getByText('Fiction')).toBeInTheDocument();
  });

  it('carga la portada de forma perezosa con texto alternativo', () => {
    renderCard();
    const img = screen.getByRole('img', { name: /portada de cien años de soledad/i });
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('src', book.thumbnail);
  });

  it('muestra "Disponible" por defecto y "Prestado" cuando no lo está', () => {
    const { unmount } = renderCard();
    expect(screen.getByText('Disponible')).toBeInTheDocument();
    unmount();
    renderCard(book, false);
    expect(screen.getByText('Prestado')).toBeInTheDocument();
  });

  it('enlaza al detalle del libro', () => {
    renderCard();
    expect(screen.getByRole('link', { name: /cien años de soledad/i })).toHaveAttribute('href', '/book/abc123');
  });

  it('maneja libros sin portada ni autores', () => {
    renderCard({ id: 'x', title: 'Misterio', authors: [], category: 'General' });
    expect(screen.getByRole('img', { name: /portada no disponible/i })).toBeInTheDocument();
    expect(screen.getByText('Autor desconocido')).toBeInTheDocument();
  });
});
