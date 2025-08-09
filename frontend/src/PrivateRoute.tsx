import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@src/context/AuthContext';
import Loading from '@components/Loading/Loading';

export default function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}