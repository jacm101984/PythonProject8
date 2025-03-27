import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { subscriptionService } from '../services/api';
import { toast } from 'react-hot-toast';

// Tipos de suscripción
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  limitations?: string[];
  billingPeriod: 'monthly' | 'annual';
}

export interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  planName: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'annual';
  features: string[];
  startDate: string;
  nextBillingDate: string;
  endDate: string | null;
  paymentMethod: string;
  status: 'active' | 'canceled' | 'expired';
  active: boolean;
}

// Definir la interfaz para el contexto
interface SubscriptionContextType {
  subscription: Subscription | null;
  plans: SubscriptionPlan[];
  loading: boolean;
  plansLoading: boolean;
  error: Error | null;
  hasPremiumSubscription: boolean;
  refreshSubscription: () => Promise<void>;
  loadPlans: () => Promise<SubscriptionPlan[]>;
}

// Mock data para desarrollo
const MOCK_SUBSCRIPTION: Subscription | null = null;
/* Uncomment to test with an active subscription
const MOCK_SUBSCRIPTION: Subscription = {
  _id: 'mock-subscription-id',
  userId: 'current-user-id',
  planId: 'premium-plan',
  planName: 'Plan Premium',
  description: 'Acceso completo a todas las funcionalidades',
  price: 19.99,
  billingPeriod: 'monthly',
  features: [
    'Estadísticas avanzadas',
    'Exportación de reportes',
    'Notificaciones personalizadas',
    'Soporte prioritario'
  ],
  startDate: new Date().toISOString(),
  nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  endDate: null,
  paymentMethod: 'paypal',
  status: 'active',
  active: true
};
*/

const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: 0,
    currency: 'USD',
    description: 'Funcionalidades básicas para empezar',
    billingPeriod: 'monthly',
    features: [
      'Hasta 3 tarjetas NFC',
      'Estadísticas básicas',
      'Soporte por email'
    ],
    limitations: [
      'Sin acceso a estadísticas avanzadas',
      'Sin exportación de reportes'
    ]
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: 19.99,
    currency: 'USD',
    description: 'Acceso completo a todas las funcionalidades',
    billingPeriod: 'monthly',
    features: [
      'Tarjetas NFC ilimitadas',
      'Estadísticas avanzadas',
      'Exportación de reportes',
      'Notificaciones personalizadas',
      'Soporte prioritario'
    ]
  },
  {
    id: 'premium-annual',
    name: 'Plan Premium Anual',
    price: 199.99,
    currency: 'USD',
    description: 'Acceso completo con descuento anual',
    billingPeriod: 'annual',
    features: [
      'Tarjetas NFC ilimitadas',
      'Estadísticas avanzadas',
      'Exportación de reportes',
      'Notificaciones personalizadas',
      'Soporte prioritario',
      '2 meses gratis'
    ]
  }
];

// Crear el contexto con valores por defecto
const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  plans: [],
  loading: false,
  plansLoading: false,
  error: null,
  hasPremiumSubscription: false,
  refreshSubscription: async () => {},
  loadPlans: async () => [] as SubscriptionPlan[],
});

// Hook personalizado para usar el contexto
export const useSubscription = () => useContext(SubscriptionContext);

// Proveedor del contexto
export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [plansLoading, setPlansLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isDev = import.meta.env.DEV;

  // Función para obtener la suscripción actual
  const fetchSubscription = async () => {
    try {
      setLoading(true);

      if (isDev) {
        // En desarrollo, usar mock data si hay error al obtener la suscripción del backend
        try {
          const response = await subscriptionService.getCurrentSubscription();
          setSubscription(response.data.data);
        } catch (err) {
          console.warn('Using mock subscription data for development');
          // Usar datos simulados para desarrollo
          setSubscription(MOCK_SUBSCRIPTION);
        }
      } else {
        // En producción, siempre intentar obtener datos reales
        const response = await subscriptionService.getCurrentSubscription();
        setSubscription(response.data.data);
      }

      setError(null);
    } catch (err: any) {
      console.error('Error al obtener suscripción:', err);
      setError(err);

      // En desarrollo, no mostrar toast para errores 404
      if (!isDev || (err.response?.status !== 404)) {
        toast.error('Error al cargar información de suscripción');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar los planes de suscripción
  const loadPlans = async (): Promise<SubscriptionPlan[]> => {
    try {
      setPlansLoading(true);

      if (isDev) {
        // En desarrollo, usar mock data si hay error al obtener los planes del backend
        try {
          const response = await subscriptionService.getPlans();
          const fetchedPlans = response.data.data;
          setPlans(fetchedPlans);
          return fetchedPlans;
        } catch (err) {
          console.warn('Using mock plans data for development');
          // Usar datos simulados para desarrollo
          setPlans(MOCK_PLANS);
          return MOCK_PLANS;
        }
      } else {
        // En producción, siempre intentar obtener datos reales
        const response = await subscriptionService.getPlans();
        const fetchedPlans = response.data.data;
        setPlans(fetchedPlans);
        return fetchedPlans;
      }
    } catch (err: any) {
      console.error('Error al obtener planes de suscripción:', err);

      // En desarrollo, no mostrar toast para errores 404
      if (!isDev || (err.response?.status !== 404)) {
        toast.error('Error al cargar planes de suscripción');
      }

      // Devolver datos simulados si no hay datos reales
      setPlans(MOCK_PLANS);
      return MOCK_PLANS;
    } finally {
      setPlansLoading(false);
    }
  };

  // Obtener la suscripción al cargar el componente
  useEffect(() => {
    fetchSubscription();
    loadPlans();
  }, []);

  // Determinar si el usuario tiene suscripción premium
  const hasPremiumSubscription = !!(
    subscription &&
    subscription.status === 'active' &&
    subscription.active &&
    (subscription.planId === 'premium' ||
     subscription.planId === 'premium-annual' ||
     subscription.planName?.toLowerCase().includes('premium'))
  );

  // Valor del contexto
  const value = {
    subscription,
    plans,
    loading,
    plansLoading,
    error,
    hasPremiumSubscription,
    refreshSubscription: fetchSubscription,
    loadPlans,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;