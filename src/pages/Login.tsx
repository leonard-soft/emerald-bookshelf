import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!username.trim()) next.username = 'Ingresa un usuario válido.';
    if (password.length < 5) next.password = 'La contraseña debe tener al menos 5 caracteres.';
    setErrors(next);
    if (next.username || next.password) return;
    setBusy(true);

    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch {
      setErrors({ form: 'No pudimos iniciar sesión. Verifica tus credenciales.' });
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
    <form className="panel auth-form" onSubmit={onSubmit} noValidate aria-labelledby="login-title">
    <h1 id="login-title">Iniciar sesión</h1>

    <label htmlFor="username">Nombre de usuario</label>
    <input
    id="username"
    type="text"
    autoComplete="username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="ej. emilys"
    aria-invalid={!!errors.username}
    aria-describedby={errors.username ? 'username-error' : undefined}
      />

      {errors.username && <p id="username-error" role="alert" className="error">{errors.username}</p>}

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="ej. emilyspass"
        aria-invalid={!!errors.password}
        aria-describedby={errors.password ? 'password-error' : undefined}
      />

        {errors.password && <p id="password-error" role="alert" className="error">{errors.password}</p>}
        {errors.form && <p role="alert" className="error">{errors.form}</p>}

        <button type="submit" className="btn" disabled={busy}>
          {busy ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p className="muted small" style={{ marginTop: '1rem' }}>
          <strong>Demo de prueba:</strong> Usa usuario: <code>emilys</code> / contraseña: <code>emilyspass</code>
        </p>
      </form>
    </main>
  );
}
