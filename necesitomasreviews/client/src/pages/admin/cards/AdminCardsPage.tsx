// src/pages/AdminCardsPage.tsx
import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaSearch, FaFilter, FaPlus, FaEdit, FaTrash, FaQrCode, FaLink } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface NFCCard {
  id: string;
  uid: string;
  name: string;
  userId: string;
  userName: string;
  status: 'active' | 'inactive' | 'pending';
  businessName: string;
  totalScans: number;
  lastScan?: string;
  createdAt: string;
  googleReviewLink?: string;
}

const AdminCardsPage: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [cards, setCards] = useState<NFCCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Base path para las rutas dependiendo del rol
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener las tarjetas NFC
    // Por ahora, usamos datos de ejemplo
    const fetchCards = async () => {
      setLoading(true);
      try {
        // Simular una llamada a la API
        setTimeout(() => {
          const mockCards: NFCCard[] = [
            {
              id: '1',
              uid: 'NFC001',
              name: 'Tarjeta Principal',
              userId: 'user1',
              userName: 'Juan Pérez',
              status: 'active',
              businessName: 'Café del Centro',
              totalScans: 145,
              lastScan: '2025-03-01T14:30:00Z',
              createdAt: '2024-12-15',
              googleReviewLink: 'https://g.page/r/example1'
            },
            {
              id: '2',
              uid: 'NFC002',
              name: 'Tarjeta Secundaria',
              userId: 'user1',
              userName: 'Juan Pérez',
              status: 'active',
              businessName: 'Café del Centro',
              totalScans: 87,
              lastScan: '2025-02-28T10:15:00Z',
              createdAt: '2024-12-15',
              googleReviewLink: 'https://g.page/r/example2'
            },
            {
              id: '3',
              uid: 'NFC003',
              name: 'Entrada Principal',
              userId: 'user2',
              userName: 'María López',
              status: 'inactive',
              businessName: 'Restaurante El Mirador',
              totalScans: 210,
              lastScan: '2025-02-15T18:45:00Z',
              createdAt: '2024-11-20',
              googleReviewLink: 'https://g.page/r/example3'
            },
            {
              id: '4',
              uid: 'NFC004',
              name: 'Mesa 1',
              userId: 'user3',
              userName: 'Carlos Rodríguez',
              status: 'pending',
              businessName: 'Bar La Esquina',
              totalScans: 0,
              createdAt: '2025-03-01'
            },
            {
              id: '5',
              uid: 'NFC005',
              name: 'Recepción',
              userId: 'user4',
              userName: 'Ana García',
              status: 'active',
              businessName: 'Hotel Plaza',
              totalScans: 65,
              lastScan: '2025-02-27T09:30:00Z',
              createdAt: '2025-01-10',
              googleReviewLink: 'https://g.page/r/example5'
            }
          ];
          setCards(mockCards);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar tarjetas:', error);
        toast.error('No se pudieron cargar las tarjetas NFC');
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  // Filtrar tarjetas según búsqueda y filtros
  const filteredCards = cards.filter(card => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.businessName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Función para mostrar el estado de forma legible
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'inactive':
        return 'Inactiva';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Desconocido';
    }
  };

  // Clase CSS para cada estado
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Tarjetas NFC</h1>
        <Link
          to={`${basePath}/cards/new`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FaPlus className="mr-2" /> Nueva Tarjeta
        </Link>
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
              placeholder="Buscar por nombre, ID o negocio"
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
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
                <option value="pending">Pendientes</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarjeta
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario / Negocio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Escaneos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Escaneo
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCards.map((card) => (
                  <tr key={card.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          <FaCreditCard className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{card.name}</div>
                          <div className="text-sm text-gray-500">{card.uid}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{card.userName}</div>
                      <div className="text-sm text-gray-500">{card.businessName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(card.status)}`}>
                        {getStatusLabel(card.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {card.totalScans}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {card.lastScan ? new Date(card.lastScan).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`${basePath}/cards/${card.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar"
                      >
                        <FaEdit className="inline h-4 w-4" />
                      </Link>
                      <Link
                        to={`${basePath}/cards/${card.id}/qr`}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Ver QR"
                      >
                        <FaQrCode className="inline h-4 w-4" />
                      </Link>
                      {card.googleReviewLink && (

                          href={card.googleReviewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-900 mr-3"
                          title="Ver enlace de reseña"
                        >
                          <FaLink className="inline h-4 w-4" />
                        </a>
                      )}
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => {/* Implementar lógica de eliminación */}}
                        title="Eliminar"
                      >
                        <FaTrash className="inline h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <FaCreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron tarjetas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta con otra búsqueda o crea una nueva tarjeta.
            </p>
            <div className="mt-6">
              <Link
                to={`${basePath}/cards/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nueva Tarjeta
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCardsPage;