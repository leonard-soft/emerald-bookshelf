import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider, SESSION_KEY, SIMULATED_TOKEN } from '../context/AuthContext';

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h1>Inicio del catálogo</h1>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );

beforeEach(() => localStorage.clear());

describe('Login', () => {
  it('muestra errores de validación si se envía vacío', async () => {
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
    expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument();
    expect(screen.getByText(/al menos 6 caracteres/i)).toBeInTheDocument();
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('rechaza un correo con formato inválido', async () => {
    renderLogin();
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'no-es-correo');
    await userEvent.type(screen.getByLabelText(/contraseña/i), '123456');
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));
    expect(screen.getByLabelText(/correo electrónico/i)).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument();
  });

  it('inicia sesión, guarda el token y redirige al catálogo', async () => {
    renderLogin();
    await userEvent.type(screen.getByLabelText(/correo electrónico/i), 'ana@uni.edu');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'secreto123');
    await userEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    expect(await screen.findByRole('heading', { name: /inicio del catálogo/i })).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY)!);
    expect(stored.token).toBe(SIMULATED_TOKEN);
    expect(stored.user.email).toBe('ana@uni.edu');
  });
});
