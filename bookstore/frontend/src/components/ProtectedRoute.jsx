import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ adminOnly = false }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  if (loading) return <main className="container-shell mt-8"><p>Checking your account…</p></main>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace state={{ unauthorized: true }} />;
  return <Outlet />;
}
