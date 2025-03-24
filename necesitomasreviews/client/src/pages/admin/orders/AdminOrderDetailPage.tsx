// src/pages/AdminOrderDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaTruck, FaCheck, FaTimes, FaDownload, FaEnvelope, FaUser, FaBuilding, FaMap, FaPhone, FaCreditCard } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

interface OrderDetail {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  package: {
    id: string;
    name: string;
    price: number;
    cardCount: number;
  };
  payment: {
    method: string;
    transactionId?: string;
    amount: number;
    paidAt?: string;
  };
  shipping: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    trackingNumber?: string;
    shippedAt?: string;
    deliveredAt?: string;
  };
  cards: {
    id: string;
    uid: string;
    name: string;
    status: string;
  }[];
  discount?: {
    code: string;
    amount: number;
  };
  notes?: string;
}

const AdminOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();

  // Base path para las rutas dependiendo del rol
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // En producción, esto sería una llamada real a la API
        // const response = await api.get(`/admin/orders/${orderId}`);
        // setOrder(response.data.data);

        // Por ahora, usamos datos de ejemplo
        setTimeout(() => {
          setOrder({
            id: orderId || '1',
            orderNumber: 'ORD-001',
            createdAt: '2025-03-01T14:30:00Z',
            status: 'paid',
            user: {
              id: 'user1',
              name: 'Juan Pérez',
              email: 'juan@example.com',
              phone: '+1234567890'
            },
            package: {
              id: 'pkg1',
              name: 'Paquete Premium',
              price: 79,
              cardCount: 5
            },
            payment: {
              method: 'PayPal',
              transactionId: 'PAYPAL-TXN-12345',
              amount: 79,
              paidAt: '2025-03-01T14:35:00Z'
            },
            shipping: {
              address: 'Calle Principal 123',
              city: 'Ciudad de México',
              state: 'CDMX',
              country: 'México',
              postalCode: '01000',
              trackingNumber: undefined,
              shippedAt: undefined,
              deliveredAt: undefined
            },
            cards: [
              { id: 'card1', uid: 'NFC001', name: 'Tarjeta Principal', status: 'pending' },
              { id: 'card2', uid: 'NFC002', name: 'Tarjeta Secundaria', status: 'pending' },
              { id: 'card3', uid: 'NFC003', name: 'Tarjeta Entrada', status: 'pending' },
              { id: 'card4', uid: 'NFC004', name: 'Tarjeta Mostrador', status: 'pending' },
              { id: 'card5', uid: 'NFC005', name: 'Tarjeta Caja', status: 'pending' }
            ],
            notes: 'Cliente solicitó entrega rápida.'
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar detalles de la orden:', error);
        setError('No se pudieron cargar los detalles de la orden');
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    setStatusUpdateLoading(true);
    try {
      // En producción, esto sería una llamada real a la API
      // await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actualizar el estado local
      setOrder(prev => prev ? { ...prev, status: newStatus as any } : null);

      toast.success(`Estado de la orden actualizado a "${getStatusLabel(newStatus)}"`);
    } catch (error) {
      console.error('Error al actualizar estado de la orden:', error);
      toast.error('No se pudo actualizar el estado de la orden');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Función para mostrar el estado de forma legible
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'paid':
        return 'Pagada';
      case 'shipped':
        return 'Enviada';
      case 'delivered':
        return 'Entregada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  // Clase CSS para cada estado
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
          <h3 className="text-lg font-medium">Error</h3>
          <p>{error || 'No se pudo encontrar la orden'}</p>
          <button
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
            onClick={() => navigate(`${basePath}/orders`)}
          >
            Volver a la lista de órdenes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`${basePath}/orders`)}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Detalles de la Orden #{order.orderNumber}</h1>
      </div>

      {/* Resumen de la orden */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Información de la Orden</h2>
            <p className="text-gray-600">
              Creada el {new Date(order.createdAt).toLocaleDateString()} a las {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="mt-2 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Información del cliente */}
          <div className="border-t pt-4 md:border-t-0 md:pt-0">
            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
              <FaUser className="text-gray-500 mr-2" /> Información del Cliente
            </h3>
            <p className="text-gray-600">{order.user.name}</p>
            <p className="text-gray-600">{order.user.email}</p>
            {order.user.phone && <p className="text-gray-600">{order.user.phone}</p>}
            <button
              className="text-sm text-blue-600 hover:text-blue-800 mt-2 flex items-center"
              onClick={() => toast.success('Correo enviado al cliente')}
            >
              <FaEnvelope className="mr-1" /> Contactar cliente
            </button>
          </div>

          {/* Detalles del paquete */}
          <div className="border-t pt-4 md:border-t-0 md:pt-0">
            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
              <FaBuilding className="text-gray-500 mr-2" /> Detalles del Paquete
            </h3>
            <p className="text-gray-600">{order.package.name}</p>
            <p className="text-gray-600">{order.package.cardCount} tarjetas NFC</p>
            <p className="text-gray-600">Precio: ${order.package.price}</p>
            {order.discount && (
              <p className="text-green-600">
                Descuento: -${order.discount.amount} (Código: {order.discount.code})
              </p>
            )}
            <p className="font-semibold mt-1">Total: ${order.payment.amount}</p>
          </div>

          {/* Información de pago */}
          <div className="border-t pt-4 md:border-t-0 md:pt-0">
            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
              <FaCreditCard className="text-gray-500 mr-2" /> Información de Pago
            </h3>
            <p className="text-gray-600">Método: {order.payment.method}</p>
            {order.payment.transactionId && (
              <p className="text-gray-600">ID Transacción: {order.payment.transactionId}</p>
            )}
            {order.payment.paidAt && (
              <p className="text-gray-600">
                Pagado el: {new Date(order.payment.paidAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Información de envío */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaTruck className="text-gray-500 mr-2" /> Información de Envío
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
              <FaMap className="text-gray-500 mr-2" /> Dirección de Envío
            </h3>
            <p className="text-gray-600">{order.shipping.address}</p>
            <p className="text-gray-600">
              {order.shipping.city}, {order.shipping.state}, {order.shipping.postalCode}
            </p>
            <p className="text-gray-600">{order.shipping.country}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Estado del Envío</h3>
            {order.shipping.trackingNumber ? (
              <>
                <p className="text-gray-600">Número de seguimiento: {order.shipping.trackingNumber}</p>
                {order.shipping.shippedAt && (
                  <p className="text-gray-600">
                    Enviado el: {new Date(order.shipping.shippedAt).toLocaleDateString()}
                  </p>
                )}
                {order.shipping.deliveredAt && (
                  <p className="text-gray-600">
                    Entregado el: {new Date(order.shipping.deliveredAt).toLocaleDateString()}
                  </p>
                )}
              </>
            ) : (
              <p className="text-yellow-600">Pendiente de envío</p>
            )}

            {/* Botones de acción de envío */}
            <div className="mt-4 flex space-x-2">
              {(order.status === 'paid' || order.status === 'shipped') && (
                <>
                  {order.status === 'paid' && (
                    <button
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium flex items-center"
                      onClick={() => updateOrderStatus('shipped')}
                      disabled={statusUpdateLoading}
                    >
                      {statusUpdateLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </span>
                      ) : (
                        <>
                          <FaTruck className="mr-1" /> Marcar como enviada
                        </>
                      )}
                    </button>
                  )}

                  {order.status === 'shipped' && (
                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center"
                      onClick={() => updateOrderStatus('delivered')}
                      disabled={statusUpdateLoading}
                    >
                      {statusUpdateLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </span>
                      ) : (
                        <>
                          <FaCheck className="mr-1" /> Marcar como entregada
                        </>
                      )}
                    </button>
                  )}
                </>
              )}

              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium flex items-center"
                  onClick={() => updateOrderStatus('cancelled')}
                  disabled={statusUpdateLoading}
                >
                  {statusUpdateLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    <>
                      <FaTimes className="mr-1" /> Cancelar orden
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas NFC */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaCreditCard className="text-gray-500 mr-2" /> Tarjetas NFC
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {order.cards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{card.uid}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{card.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(card.status)}`}>
                      {getStatusLabel(card.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`${basePath}/cards/${card.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notas y acciones finales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notas */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Notas</h3>
            {order.notes ? (
              <p className="text-gray-600">{order.notes}</p>
            ) : (
              <p className="text-gray-400 italic">No hay notas para esta orden</p>
            )}
          </div>

          {/* Acciones */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Acciones</h3>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center"
                onClick={() => toast.success('Factura generada y descargada')}
              >
                <FaDownload className="mr-1" /> Generar factura
              </button>

              <button
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center"
                onClick={() => toast.success('Correo enviado al cliente')}
              >
                <FaEnvelope className="mr-1" /> Enviar correo al cliente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;