import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { Toaster, toast } from 'react-hot-toast';

interface OrderDetails {
  id: string;
  status: string;
  planName: string;
  totalAmount: number;
}

const PaymentCancelPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      try {
        const response = await api.get(`/checkout/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        toast.error('Error al obtener los detalles de la orden');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleRetryPayment = async () => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      const response = await api.post(`/checkout/retry-payment/${orderId}`);
      const { paymentUrl } = response.data;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (error) {
      toast.error('Error al reintentar el pago. Por favor, inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2">Pago Cancelado</h1>
        <p className="text-lg text-gray-600 mb-8">Tu proceso de pago ha sido cancelado o no se ha completado correctamente.</p>

        {order && (
          <div className="bg-white shadow-lg rounded-lg p-8 mb-8 text-left">
            <h2 className="text-xl font-bold mb-4 text-center">Detalles de la orden</h2>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Número de orden:</span>
                <span className="font-medium">{order.id}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-red-600">Cancelado</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{order.planName}</span>
              </div>

              <div className="flex justify-between pt-2">
                <span className="text-gray-800 font-bold">Total:</span>
                <span className="font-bold">${order.totalAmount.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <p className="text-gray-600">
            No te preocupes, puedes intentar completar el pago nuevamente o elegir otro método de pago.
          </p>

          <div className="space-x-4">
            <button
              onClick={handleRetryPayment}
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? 'Procesando...' : 'Reintentar pago'}
            </button>

            <Link
              to="/checkout"
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            >
              Volver al checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;