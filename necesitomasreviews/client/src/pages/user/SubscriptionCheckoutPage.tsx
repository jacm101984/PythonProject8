import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscription } from '../../context/SubscriptionContext';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-hot-toast';
import subscriptionService from '../../services/subscriptionService';

// Componente de paso en el checkout
const CheckoutStep = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-600 mb-4">{description}</p>
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">{children}</div>
  </div>
);

// Interface para el plan de suscripción
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'annual';
  description: string;
  features: string[];
}

const SubscriptionCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSubscription } = useSubscription();

  // Estado para guardar el plan seleccionado
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'credit-card' | 'mercado-pago'>('paypal');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si no hay un plan en el state, redirigir a la página de planes
    if (!location.state?.plan) {
      toast.error('Por favor, seleccione un plan de suscripción');
      navigate('/dashboard/subscription-plans');
      return;
    }

    setSelectedPlan(location.state.plan);
  }, [location.state, navigate]);

  // Funciones para el pago con PayPal
  const createOrder = async () => {
    if (!selectedPlan) return '';

    try {
      setLoading(true);
      // Aquí llamaríamos al servicio de suscripción para crear una orden
      const order = await subscriptionService.createSubscriptionOrder({
        planId: selectedPlan.id,
        method: 'paypal'
      });

      return order.id;
    } catch (error) {
      toast.error('Error al crear la orden de suscripción');
      console.error('Error creating subscription order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setLoading(true);
      // Aquí llamaríamos al servicio para verificar y completar la suscripción
      await subscriptionService.completeSubscription(data.orderID);

      // Refrescar la información de suscripción
      await refreshSubscription();

      toast.success('¡Suscripción completada con éxito!');
      navigate('/dashboard/subscription-manage');
    } catch (error) {
      toast.error('Error al procesar el pago');
      console.error('Error processing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Checkout de Suscripción</h1>

      {/* Resumen del plan */}
      <CheckoutStep
        title="1. Plan Seleccionado"
        description="Este es el plan que has seleccionado"
      >
        {selectedPlan ? (
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
              <p className="text-gray-600">{selectedPlan.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                {selectedPlan.period === 'monthly' ? 'Facturación mensual' : 'Facturación anual'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${selectedPlan.price.toFixed(2)}</div>
              <button
                onClick={() => navigate('/dashboard/subscription-plans')}
                className="text-sm text-blue-600 hover:underline"
              >
                Cambiar plan
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p>Cargando información del plan...</p>
          </div>
        )}
      </CheckoutStep>

      {/* Método de pago */}
      <CheckoutStep
        title="2. Método de Pago"
        description="Selecciona cómo quieres pagar tu suscripción"
      >
        <div className="space-y-4">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setPaymentMethod('paypal')}
              className={`flex-1 p-4 border rounded-lg ${
                paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="font-semibold mb-1">PayPal</div>
              <div className="text-sm text-gray-600">Pago seguro a través de PayPal</div>
            </button>

            {/* Otros métodos de pago (deshabilitados por ahora) */}
            <button
              disabled
              className="flex-1 p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed"
            >
              <div className="font-semibold mb-1">Tarjeta de Crédito</div>
              <div className="text-sm text-gray-600">Próximamente</div>
            </button>

            <button
              disabled
              className="flex-1 p-4 border border-gray-200 rounded-lg opacity-50 cursor-not-allowed"
            >
              <div className="font-semibold mb-1">Mercado Pago</div>
              <div className="text-sm text-gray-600">Próximamente</div>
            </button>
          </div>

          {/* Botones de pago según el método seleccionado */}
          {paymentMethod === 'paypal' && selectedPlan && (
            <div className="mt-6">
              <PayPalButtons
                style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'subscribe' }}
                createOrder={createOrder}
                onApprove={onApprove}
                disabled={loading}
              />

              <p className="text-sm text-gray-500 mt-4">
                Al completar la compra, aceptas nuestros <a href="/terms-and-conditions" target="_blank" className="text-blue-600 hover:underline">Términos y Condiciones</a> y <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline">Política de Privacidad</a>.
              </p>
            </div>
          )}
        </div>
      </CheckoutStep>

      {/* Botones de navegación */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate('/dashboard/subscription-plans')}
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Volver a Planes
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCheckoutPage;