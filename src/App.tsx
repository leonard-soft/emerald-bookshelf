import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const Catalog = lazy(() => import('./pages/Catalog'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const Login = lazy(() => import('./pages/Login'));
const Profile = lazy(() => import('./pages/Profile'));

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <Navbar />
      <div className="container">
        <Suspense fallback={<p role="status">Cargando…</p>}>
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<p>Página no encontrada.</p>} />
          </Routes>
        </Suspense>
      </div>
    </>
  );
}
