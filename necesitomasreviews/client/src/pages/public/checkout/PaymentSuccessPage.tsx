import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { Toaster, toast } from 'react-hot-toast';

interface OrderDetails {
  id: string;
  status: string;
  totalAmount: number;
  planName: string;
  cardCount: number;
  createdAt: string;
}

const PaymentSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Orden no encontrada</h1>
        <p className="mb-6 text-gray-600">Lo sentimos, no pudimos encontrar los detalles de esta orden.</p>
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors"
        >
          Ir al dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Toaster position="top-right" />

      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2">¡Pago Exitoso!</h1>
        <p className="text-lg text-gray-600 mb-8">Gracias por tu compra. Tu pedido ha sido procesado correctamente.</p>

        <div className="bg-white shadow-lg rounded-lg p-8 mb-8 text-left">
          <h2 className="text-xl font-bold mb-4 text-center">Detalles de la orden</h2>

          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Número de orden:</span>
              <span className="font-medium">{order.id}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Fecha:</span>
              <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium text-green-600">Completado</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{order.planName}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-600">Cantidad de tarjetas:</span>
              <span className="font-medium">{order.cardCount}</span>
            </div>

            <div className="flex justify-between pt-2">
              <span className="text-gray-800 font-bold">Total:</span>
              <span className="font-bold">${order.totalAmount.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-center">
          <p className="text-gray-600">
            Enviaremos las tarjetas NFC a la dirección proporcionada en los próximos días hábiles.
            Puedes configurar tus tarjetas desde tu panel de control.
          </p>

          <div className="space-x-4">
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition-colors"
            >
              Ir al dashboard
            </Link>

            <Link
              to="/dashboard/cards"
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded hover:bg-gray-300 transition-colors"
            >
              Configurar tarjetas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;