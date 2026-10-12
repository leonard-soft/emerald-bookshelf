import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="navbar">
      <Link to="/" className="brand" aria-label="Emerald Bookshelf, ir al catálogo">Emerald Bookshelf</Link>
      <nav aria-label="Principal">
        <NavLink to="/">Catálogo</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/profile">Mis préstamos</NavLink>
            <span className="user-chip">Hola, {user?.name}</span>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <NavLink to="/login">Iniciar sesión</NavLink>
        )}
      </nav>
    </header>
  );
}
