import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthProvider, SESSION_KEY, SIMULATED_TOKEN } from '../context/AuthContext';

const renderNavbar = () =>
  render(<MemoryRouter><AuthProvider><Navbar /></AuthProvider></MemoryRouter>);

beforeEach(() => localStorage.clear());

describe('Navbar', () => {
  it('invitado: ve "Iniciar sesión" y no ve opciones privadas', () => {
    renderNavbar();
    expect(screen.getByRole('navigation', { name: /principal/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^catálogo$/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /mis préstamos/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cerrar sesión/i })).not.toBeInTheDocument();
  });

  it('usuario autenticado: ve su nombre y sus préstamos', () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token: SIMULATED_TOKEN, user: { email: 'ana@uni.edu', name: 'ana' } }));
    renderNavbar();
    expect(screen.getByText(/hola, ana/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /mis préstamos/i })).toHaveAttribute('href', '/profile');
    expect(screen.queryByRole('link', { name: /iniciar sesión/i })).not.toBeInTheDocument();
  });

  it('cerrar sesión limpia el token y vuelve al estado de invitado', async () => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token: SIMULATED_TOKEN, user: { email: 'ana@uni.edu', name: 'ana' } }));
    renderNavbar();
    await userEvent.click(screen.getByRole('button', { name: /cerrar sesión/i }));
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });
});
