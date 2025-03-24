// src/pages/AdminRegionsPage.tsx
import React, { useState, useEffect } from 'react';
import { FaGlobe, FaPlus, FaEdit, FaTrash, FaSearch, FaUserCog } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Region {
  id: string;
  name: string;
  code: string;
  adminCount: number;
  userCount: number;
  active: boolean;
  createdAt: string;
}

const AdminRegionsPage: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener la lista de regiones
    // Por ahora, usaremos datos de ejemplo
    const fetchRegions = async () => {
      setLoading(true);
      try {
        // Simular una llamada a la API
        setTimeout(() => {
          const mockRegions: Region[] = [
            {
              id: '1',
              name: 'Norte',
              code: 'REGION-001',
              adminCount: 2,
              userCount: 145,
              active: true,
              createdAt: '2023-01-15'
            },
            {
              id: '2',
              name: 'Sur',
              code: 'REGION-002',
              adminCount: 1,
              userCount: 98,
              active: true,
              createdAt: '2023-02-20'
            },
            {
              id: '3',
              name: 'Este',
              code: 'REGION-003',
              adminCount: 2,
              userCount: 120,
              active: true,
              createdAt: '2023-03-10'
            },
            {
              id: '4',
              name: 'Oeste',
              code: 'REGION-004',
              adminCount: 1,
              userCount: 87,
              active: false,
              createdAt: '2023-04-05'
            },
            {
              id: '5',
              name: 'Centro',
              code: 'REGION-005',
              adminCount: 3,
              userCount: 210,
              active: true,
              createdAt: '2023-05-12'
            }
          ];
          setRegions(mockRegions);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar regiones:', error);
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // Función para filtrar regiones
  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Regiones</h1>
        <Link
          to="/admin/regions/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FaPlus className="mr-2" /> Nueva Región
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <div className="relative max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Buscar por nombre o código"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredRegions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Región
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Administradores
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuarios
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Creación
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegions.map((region) => (
                  <tr key={region.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          <FaGlobe className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{region.name}</div>
                          <div className="text-sm text-gray-500">{region.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUserCog className="text-blue-500 mr-2" />
                        <span className="text-sm text-gray-900">{region.adminCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {region.userCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${region.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {region.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(region.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/regions/${region.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <FaEdit className="inline h-4 w-4" /> Editar
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => { /* Implementar lógica de eliminación */ }}
                      >
                        <FaTrash className="inline h-4 w-4" /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10">
            <FaGlobe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron regiones</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta con otra búsqueda o crea una nueva región.
            </p>
            <div className="mt-6">
              <Link
                to="/admin/regions/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nueva Región
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRegionsPage;