// src/pages/OrderDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Definición de tipos
interface OrderData {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  paymentMethod: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderData | null>(null);

  // Simular carga de datos
  useEffect(() => {
    // Aquí se haría una llamada a la API para obtener los detalles del pedido
    setTimeout(() => {
      setOrder({
        id: orderId || 'order-001',
        orderNumber: 'ORD-2025-00123',
        date: '2025-03-15T10:30:00',
        status: 'completed',
        total: 79.00,
        paymentMethod: 'PayPal',
        items: [
          { id: 'item-001', name: 'Paquete Premium (5 tarjetas NFC)', quantity: 1, price: 79.00 }
        ],
        shippingAddress: {
          name: 'Juan Pérez',
          street: 'Av. Providencia 1234',
          city: 'Santiago',
          state: 'Región Metropolitana',
          zipCode: '7500000',
          country: 'Chile'
        },
        billingAddress: {
          name: 'Juan Pérez',
          street: 'Av. Providencia 1234',
          city: 'Santiago',
          state: 'Región Metropolitana',
          zipCode: '7500000',
          country: 'Chile'
        }
      });
      setLoading(false);
    }, 800);
  }, [orderId]);

  // Función para renderizar el estado del pedido
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            En proceso
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Completado
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Función para formatear precios
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)} USD`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pedido no encontrado</h2>
        <p className="text-gray-600 mb-6">No pudimos encontrar el pedido que estás buscando.</p>
        <Link to="/orders" className="text-blue-600 hover:text-blue-800">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/orders" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a mis pedidos
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pedido #{order.orderNumber}</h1>
            <p className="text-gray-600 mt-1">Realizado el {formatDate(order.date)}</p>
          </div>
          <div className="flex items-center">
            {renderStatusBadge(order.status)}
            {order.status === 'pending' && (
              <button className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                Cancelar Pedido
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Pedido</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Número de Pedido</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.orderNumber}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Fecha</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(order.date)}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                    <dd className="mt-1 text-sm text-gray-900">{renderStatusBadge(order.status)}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Método de Pago</dt>
                    <dd className="mt-1 text-sm text-gray-900">{order.paymentMethod}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Direcciones</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Dirección de Envío</h4>
                    <address className="mt-2 not-italic text-sm text-gray-900">
                      {order.shippingAddress.name}<br />
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </address>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Dirección de Facturación</h4>
                    <address className="mt-2 not-italic text-sm text-gray-900">
                      {order.billingAddress.name}<br />
                      {order.billingAddress.street}<br />
                      {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}<br />
                      {order.billingAddress.country}
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-4">Artículos del Pedido</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio Unitario
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-8 flex justify-between">
            {order.status === 'completed' && (
              <Link
                to={`/orders/${order.id}/invoice`}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Ver Factura
              </Link>
            )}
            <div className="space-x-3">
              {order.status === 'completed' && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Activar Tarjetas
                </button>
              )}
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Contactar Soporte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;