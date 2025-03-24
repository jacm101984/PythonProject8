// src/components/auth/SuperAdminRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SuperAdminRoute = () => {
  const { user, loading, isSuperAdmin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-google-blue"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default SuperAdminRoute;