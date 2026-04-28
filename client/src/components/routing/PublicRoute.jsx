import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import LoadingScreen from './LoadingScreen';

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Verificando sesion..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
