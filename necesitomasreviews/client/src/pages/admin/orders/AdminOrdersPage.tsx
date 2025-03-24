// src/pages/AdminOrdersPage.tsx
import React, { useState, useEffect } from 'react';
import { FaShoppingBag, FaSearch, FaFilter, FaEye, FaCheck, FaTimes, FaShippingFast } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  packageName: string;
  totalAmount: number;
  cardCount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
}

const AdminOrdersPage: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Base path para las rutas dependiendo del rol
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener las órdenes
    // Por ahora, usamos datos de ejemplo
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Simular una llamada a la API
        setTimeout(() => {
          const mockOrders: Order[] = [
            {
              id: '1',
              orderNumber: 'ORD-001',
              userId: 'user1',
              userName: 'Juan Pérez',
              userEmail: 'juan@example.com',
              packageName: 'Paquete Premium',
              totalAmount: 79,
              cardCount: 5,
              status: 'paid',
              paymentMethod: 'PayPal',
              createdAt: '2025-03-01T14:30:00Z'
            },
            {
              id: '2',
              orderNumber: 'ORD-002',
              userId: 'user2',
              userName: 'María López',
              userEmail: 'maria@example.com',
              packageName: 'Paquete Estándar',
              totalAmount: 59,
              cardCount: 3,
              status: 'shipped',
              paymentMethod: 'Tarjeta de crédito',
              createdAt: '2025-02-28T10:15:00Z'
            },
            {
              id: '3',
              orderNumber: 'ORD-003',
              userId: 'user3',
              userName: 'Carlos Rodríguez',
              userEmail: 'carlos@example.com',
              packageName: 'Paquete Empresarial',
              totalAmount: 119,
              cardCount: 10,
              status: 'delivered',
              paymentMethod: 'MercadoPago',
              createdAt: '2025-02-15T18:45:00Z'
            },
            {
              id: '4',
              orderNumber: 'ORD-004',
              userId: 'user4',
              userName: 'Ana García',
              userEmail: 'ana@example.com',
              packageName: 'Paquete Básico',
              totalAmount: 29,
              cardCount: 1,
              status: 'pending',
              paymentMethod: 'WebPay Plus',
              createdAt: '2025-03-02T09:30:00Z'
            },
            {
              id: '5',
              orderNumber: 'ORD-005',
              userId: 'user5',
              userName: 'Roberto Sánchez',
              userEmail: 'roberto@example.com',
              packageName: 'Paquete Estándar',
              totalAmount: 59,
              cardCount: 3,
              status: 'cancelled',
              paymentMethod: 'PayPal',
              createdAt: '2025-02-20T11:20:00Z'
            }
          ];
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar órdenes:', error);
        toast.error('No se pudieron cargar las órdenes');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filtrar órdenes según búsqueda y filtros
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  // Icono para cada estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaShoppingBag className="h-4 w-4" />;
      case 'paid':
        return <FaCheck className="h-4 w-4" />;
      case 'shipped':
        return <FaShippingFast className="h-4 w-4" />;
      case 'delivered':
        return <FaCheck className="h-4 w-4" />;
      case 'cancelled':
        return <FaTimes className="h-4 w-4" />;
      default:
        return <FaShoppingBag className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Órdenes</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Búsqueda */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Buscar por número, nombre o email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="paid">Pagadas</option>
                <option value="shipped">Enviadas</option>
                <option value="delivered">Entregadas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orden
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paquete
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                      <div className="text-sm text-gray-500">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.packageName}</div>
                      <div className="text-sm text-gray-500">{order.cardCount} tarjetas</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusLabel(order.status)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`${basePath}/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEye className="inline h-4 w-4 mr-1" /> Ver detalles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <FaShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron órdenes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta con otra búsqueda o cambia los filtros.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;