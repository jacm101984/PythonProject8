// client/src/components/auth/PublicRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-google-blue"></div>
      </div>
    );
  }

  if (user) {
    // Redirect based on role
    if (user.role === 'SUPER_ADMIN' || user.role === 'REGIONAL_ADMIN') {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === 'PROMOTER') {
      return <Navigate to="/promoter/dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  return <Outlet />;
};

export default PublicRoute;