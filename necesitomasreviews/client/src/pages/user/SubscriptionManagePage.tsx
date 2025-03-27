import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { toast } from 'react-hot-toast';
import subscriptionService from '../../services/subscriptionService';

const SubscriptionManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { subscription, refreshSubscription } = useSubscription();
  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Formateamos la fecha de expiración
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Función para cancelar la suscripción
  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      await subscriptionService.cancelSubscription(subscription?.id || '');
      await refreshSubscription();
      setShowCancelModal(false);
      toast.success('Suscripción cancelada con éxito');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Error al cancelar la suscripción');
    } finally {
      setLoading(false);
    }
  };

  // Si no hay una suscripción activa, mostrar mensaje y opción de ver planes
  if (!subscription || !subscription.active) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Gestionar Suscripción</h1>

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="w-20 h-20 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h2 className="text-2xl font-semibold mb-2">No tienes una suscripción activa</h2>
          <p className="text-gray-600 mb-6">
            Actualmente no cuentas con ninguna suscripción premium. Adquiere una para acceder a todas nuestras funcionalidades avanzadas.
          </p>
          <button
            onClick={() => navigate('/dashboard/subscription-plans')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ver Planes Disponibles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Gestionar Suscripción</h1>

      {/* Tarjeta de información de la suscripción */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start flex-wrap md:flex-nowrap">
          <div>
            <div className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded mb-2">
              Activa
            </div>
            <h2 className="text-2xl font-bold">{subscription.planName}</h2>
            <p className="text-gray-600 mt-1">{subscription.description}</p>
          </div>

          <div className="mt-4 md:mt-0 text-right">
            <div className="text-3xl font-bold">${subscription.price.toFixed(2)}</div>
            <div className="text-sm text-gray-500">
              {subscription.billingPeriod === 'monthly' ? 'por mes' : 'por año'}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-500">Fecha de inicio</div>
              <div className="font-medium">{formatDate(subscription.startDate)}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Próxima facturación</div>
              <div className="font-medium">{formatDate(subscription.nextBillingDate)}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Método de pago</div>
              <div className="font-medium">
                {subscription.paymentMethod === 'paypal' ? 'PayPal' :
                 subscription.paymentMethod === 'credit-card' ? 'Tarjeta de crédito' : 'Otro'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Características de la suscripción */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Características incluidas</h3>
        <ul className="space-y-3">
          {subscription.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Gestionar suscripción</h3>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/dashboard/subscription-plans')}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Cambiar de plan
          </button>

          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full sm:w-auto border border-red-600 text-red-600 px-6 py-2 rounded-md hover:bg-red-50 transition-colors ml-0 sm:ml-4 mt-4 sm:mt-0"
          >
            Cancelar suscripción
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Al cancelar tu suscripción, continuarás teniendo acceso a las funcionalidades premium hasta el final del período de facturación actual ({formatDate(subscription.nextBillingDate)}).
          </p>
        </div>
      </div>

      {/* Modal de confirmación para cancelar */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">¿Cancelar suscripción?</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas cancelar tu suscripción premium? Tendrás acceso a las funcionalidades premium hasta el {formatDate(subscription.nextBillingDate)}.
            </p>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={loading}
              >
                No, mantener
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Sí, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagePage;