import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; form?: string }>({});
    const [busy, setBusy] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);

    // Si ya está autenticado, redirigir al inicio
    if (isAuthenticated) {
        navigate('/', { replace: true });
        return null;
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const next: typeof errors = {};

        if (!username.trim()) next.username = 'El nombre de usuario es obligatorio.';
        if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Ingresa un correo electrónico válido.';
        if (password.length < 6) next.password = 'La contraseña debe tener al menos 6 caracteres.';

        setErrors(next);
        if (next.username || next.email || next.password) return;

        setBusy(true);
        setErrors({});

        try {
            const res = await fetch('https://dummyjson.com/users/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: username,
                    lastName: 'User',
                    username: username.trim(),
                                     email: email.trim(),
                                     password: password,
                }),
            });

            if (!res.ok) {
                throw new Error('Error al registrar usuario en el servidor');
            }

            const data = await res.json();
            console.log('Usuario registrado con éxito (Mock):', data);

            setSuccessMsg(true);
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 2000); // Redirige al login tras 2 segundos para que note el mensaje de éxito

        } catch {
            setErrors({ form: 'No pudimos completar el registro. Intenta nuevamente.' });
            setBusy(false);
        }
    };

    return (
        <main className="auth-page">
        <form className="panel auth-form" onSubmit={onSubmit} noValidate aria-labelledby="register-title">
        <h1 id="register-title">Crear cuenta</h1>

        {successMsg ? (
            <div className="success-banner" style={{ padding: '1rem', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>
            ¡Registro exitoso! Redirigiendo al inicio de sesión...
            </div>
        ) : (
            <>
            <label htmlFor="username">Nombre de usuario</label>
            <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ej. leonarddev"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            />
            {errors.username && <p id="username-error" role="alert" className="error">{errors.username}</p>}

            <label htmlFor="email">Correo electrónico</label>
            <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ej. leonard@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && <p id="email-error" role="alert" className="error">{errors.email}</p>}

            <label htmlFor="password">Contraseña</label>
            <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && <p id="password-error" role="alert" className="error">{errors.password}</p>}

            {errors.form && <p role="alert" className="error">{errors.form}</p>}

            <button type="submit" className="btn" disabled={busy}>
            {busy ? 'Registrando…' : 'Registrarse'}
            </button>

            <p className="muted small" style={{ marginTop: '1rem', textAlign: 'center' }}>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
            </>
        )}
        </form>
        </main>
    );
}
