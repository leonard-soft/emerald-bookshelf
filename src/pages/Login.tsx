import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Ingresa un correo válido.';
    if (password.length < 6) next.password = 'La contraseña debe tener al menos 6 caracteres.';
    setErrors(next);
    if (next.email || next.password) return;
    setBusy(true);
    try {
      await login(email, password);
    } catch {
      setErrors({ form: 'No pudimos iniciar sesión. Revisa tus datos.' });
      setBusy(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="panel auth-form" onSubmit={onSubmit} noValidate aria-labelledby="login-title">
        <h1 id="login-title">Iniciar sesión</h1>
        <label htmlFor="email">Correo electrónico</label>
        <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
        {errors.email && <p id="email-error" role="alert" className="error">{errors.email}</p>}
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined} />
        {errors.password && <p id="password-error" role="alert" className="error">{errors.password}</p>}
        {errors.form && <p role="alert" className="error">{errors.form}</p>}
        <button type="submit" className="btn" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
        <p className="muted small">Demo: cualquier correo válido y una contraseña de 6+ caracteres.</p>
      </form>
    </main>
  );
}
