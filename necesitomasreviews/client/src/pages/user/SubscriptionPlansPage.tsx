// client/src/pages/user/SubscriptionPlansPage.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import subscriptionService, { SubscriptionPlan } from '../../services/subscriptionService';
import { toast } from 'react-hot-toast';
import MainLayout from '../../components/layouts/MainLayout';

const SubscriptionPlansPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { subscription, isPremium } = useSubscription();
  const navigate = useNavigate();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Cargar planes de suscripción
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await subscriptionService.getPlans();
        setPlans(data);
      } catch (error) {
        console.error('Error al cargar planes:', error);
        toast.error('Error al cargar planes de suscripción');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Manejar selección de plan
  const handleSelectPlan = (planId: string) => {
    if (!isAuthenticated) {
      // Guardar plan seleccionado en sessionStorage y redirigir a login
      sessionStorage.setItem('selectedPlan', planId);
      navigate('/login', { state: { from: '/subscription/checkout' } });
      return;
    }

    if (planId === 'basic') {
      // El plan básico no requiere checkout
      toast.success('Ya tienes acceso al plan básico con tu compra de tarjetas');
      navigate('/dashboard');
    } else {
      // Redirigir a checkout para el plan premium
      navigate('/subscription/checkout', { state: { planId } });
    }
  };

  // Mostrar pantalla de carga mientras se cargan los planes
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Planes de Suscripción
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>

          <div className="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 ${
                  plan.id === 'premium' ? 'border-indigo-500 ring-2 ring-indigo-500' : ''
                }`}
              >
                <div className="p-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">{plan.name}</h2>
                  <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900">
                      {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-base font-medium text-gray-500">
                        /{plan.billingPeriod || 'mes'}
                      </span>
                    )}
                  </p>

                  {/* Mostrar estado actual de suscripción si corresponde */}
                  {isAuthenticated && (
                    <>
                      {(plan.id === 'basic' && !isPremium) && (
                        <p className="mt-2 text-sm text-green-600">Tu plan actual</p>
                      )}
                      {(plan.id === 'premium' && isPremium) && (
                        <p className="mt-2 text-sm text-green-600">Tu plan actual</p>
                      )}
                    </>
                  )}

                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={(plan.id === 'basic' && !isPremium) || (plan.id === 'premium' && isPremium)}
                    className={`mt-8 block w-full bg-${
                      plan.id === 'premium' ? 'indigo' : 'gray'
                    }-600 hover:bg-${
                      plan.id === 'premium' ? 'indigo' : 'gray'
                    }-700 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center ${
                      ((plan.id === 'basic' && !isPremium) || (plan.id === 'premium' && isPremium))
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {plan.id === 'basic'
                      ? (isPremium ? 'Descartar Premium para usar Básico' : 'Tu plan actual')
                      : (isPremium ? 'Tu plan actual' : 'Suscribirse')}
                  </button>
                </div>

                <div className="pt-6 pb-8 px-6">
                  <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                    Qué incluye
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex space-x-3">
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-green-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.limitations && (
                    <div className="mt-6">
                      <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                        Limitaciones
                      </h3>
                      <ul className="mt-4 space-y-4">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex space-x-3">
                            <svg
                              className="flex-shrink-0 h-5 w-5 text-red-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm text-gray-500">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-base text-gray-500">
              El plan Premium se renueva automáticamente. Puedes cancelar en cualquier momento.
            </p>
            {isAuthenticated && isPremium && (
              <Link
                to="/subscription/manage"
                className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
              >
                Administrar tu suscripción actual
                <svg
                  className="ml-1 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            )}
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900">Preguntas frecuentes</h2>
            <dl className="mt-6 space-y-6 divide-y divide-gray-200">
              <div className="pt-6">
                <dt className="text-lg font-medium text-gray-900">
                  ¿Qué obtengo con el plan Premium?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Con el plan Premium obtienes acceso a estadísticas detalladas de tus tarjetas NFC,
                  incluyendo fecha y hora de cada escaneo, notificaciones en tiempo real cuando un cliente
                  completa una reseña, dashboard analítico con métricas de conversión y la posibilidad
                  de exportar reportes.
                </dd>
              </div>

              <div className="pt-6">
                <dt className="text-lg font-medium text-gray-900">
                  ¿Puedo cancelar mi suscripción en cualquier momento?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Sí, puedes cancelar tu suscripción Premium en cualquier momento.
                  Seguirás teniendo acceso a las funciones Premium hasta el final del período facturado.
                </dd>
              </div>

              <div className="pt-6">
                <dt className="text-lg font-medium text-gray-900">
                  ¿El plan Básico es suficiente para usar mis tarjetas NFC?
                </dt>
                <dd className="mt-2 text-base text-gray-500">
                  Sí, el plan Básico te permite configurar y activar tus tarjetas NFC para
                  recibir reseñas de Google. Sin embargo, no podrás ver estadísticas detalladas
                  ni recibir notificaciones cuando se completen las reseñas.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubscriptionPlansPage;