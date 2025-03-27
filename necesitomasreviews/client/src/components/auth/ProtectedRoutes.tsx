import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import Loading from '../ui/Loading';

// Base protected route that checks for authentication
export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the child routes
  return <Outlet />;
};

// For backward compatibility, also export as ProtectedRoutes
export const ProtectedRoutes = ProtectedRoute;

// Route that only allows admin users (any admin role)
export const AdminRoute: React.FC = () => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if not an admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is an admin, render the child routes
  return <Outlet />;
};

// Route that only allows super admin users
export const SuperAdminRoute: React.FC = () => {
  const { user, loading, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if not a super admin
  if (!isSuperAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // User is a super admin, render the child routes
  return <Outlet />;
};

// Route that only allows regional admin users
export const RegionalAdminRoute: React.FC = () => {
  const { user, loading, isRegionalAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if not a regional admin
  if (!isRegionalAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // User is a regional admin, render the child routes
  return <Outlet />;
};

// Route that only allows promoter users
export const PromoterRoute: React.FC = () => {
  const { user, loading, isPromoter } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if not a promoter
  if (!isPromoter) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is a promoter, render the child routes
  return <Outlet />;
};

// Route that redirects authenticated users (useful for login/register pages)
export const PublicRoute: React.FC<{ redirectTo?: string }> = ({ redirectTo = '/dashboard' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  // Get the intended destination if any
  const from = location.state?.from?.pathname || redirectTo;

  // Redirect authenticated users
  if (user) {
    // Redirect based on user role
    if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.REGIONAL_ADMIN || user.role === UserRole.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === UserRole.PROMOTER) {
      return <Navigate to="/promoter/dashboard" replace />;
    } else {
      return <Navigate to={from} replace />;
    }
  }

  // User is not authenticated, render the child routes
  return <Outlet />;
};

// Route that only allows users with premium subscription
export const PremiumRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const { hasPremiumSubscription, loading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  // Show loading spinner while checking authentication and subscription
  if (loading || subscriptionLoading) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to premium required page if user doesn't have a premium subscription
  // Admins bypass the premium check
  const isAdmin = user.role === UserRole.SUPER_ADMIN ||
                  user.role === UserRole.REGIONAL_ADMIN ||
                  user.role === UserRole.ADMIN;

  if (!hasPremiumSubscription && !isAdmin) {
    return <Navigate to="/dashboard/premium-required" state={{ from: location }} replace />;
  }

  // User has a premium subscription or is an admin, render the child routes
  return <Outlet />;
};