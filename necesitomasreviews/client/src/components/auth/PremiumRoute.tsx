// client/src/components/auth/PremiumRoute.tsx

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import PremiumRequired from '../ui/subscription/PremiumRequired';

const PremiumRoute: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  // Mostrar pantalla de carga mientras verificamos estado de autenticación y suscripción
  if (authLoading || subscriptionLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si está autenticado pero no tiene suscripción premium, mostrar pantalla de actualización
  if (!isPremium) {
    return <PremiumRequired />;
  }

  // Si está autenticado y tiene suscripción premium, mostrar contenido protegido
  return <Outlet />;
};

export default PremiumRoute;