// src/pages/UsersPage.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Tipos de datos
interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'PROMOTER' | 'REGIONAL_ADMIN' | 'SUPER_ADMIN';
  status: 'active' | 'inactive' | 'pending';
  region: string;
  createdAt: string;
  lastLogin: string | null;
}

const UsersPage: React.FC = () => {
  // Estados para usuarios y filtros
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [regions, setRegions] = useState<string[]>([]);

  // Cargar datos de ejemplo
  useEffect(() => {
    // Simular carga de datos desde API
    setTimeout(() => {
      const mockUsers = [
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan.perez@example.com',
          role: 'USER' as const,
          status: 'active' as const,
          region: 'Santiago',
          createdAt: '2025-01-15T14:30:00',
          lastLogin: '2025-03-20T09:45:00'
        },
        {
          id: '2',
          name: 'María González',
          email: 'maria.gonzalez@example.com',
          role: 'USER' as const,
          status: 'active' as const,
          region: 'Santiago',
          createdAt: '2025-01-20T11:15:00',
          lastLogin: '2025-03-19T16:30:00'
        },
        {
          id: '3',
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@example.com',
          role: 'PROMOTER' as const,
          status: 'active' as const,
          region: 'Valparaíso',
          createdAt: '2025-02-05T08:45:00',
          lastLogin: '2025-03-21T10:20:00'
        },
        {
          id: '4',
          name: 'Ana Martínez',
          email: 'ana.martinez@example.com',
          role: 'REGIONAL_ADMIN' as const,
          status: 'active' as const,
          region: 'Santiago',
          createdAt: '2024-12-10T15:30:00',
          lastLogin: '2025-03-22T08:15:00'
        },
        {
          id: '5',
          name: 'Diego Sánchez',
          email: 'diego.sanchez@example.com',
          role: 'USER' as const,
          status: 'inactive' as const,
          region: 'Concepción',
          createdAt: '2025-01-25T09:20:00',
          lastLogin: '2025-02-15T14:50:00'
        },
        {
          id: '6',
          name: 'Laura Torres',
          email: 'laura.torres@example.com',
          role: 'USER' as const,
          status: 'pending' as const,
          region: 'Santiago',
          createdAt: '2025-03-15T16:40:00',
          lastLogin: null
        },
        {
          id: '7',
          name: 'Javier López',
          email: 'javier.lopez@example.com',
          role: 'PROMOTER' as const,
          status: 'active' as const,
          region: 'Valparaíso',
          createdAt: '2025-02-20T13:10:00',
          lastLogin: '2025-03-18T11:30:00'
        }
      ];

      // Extraer regiones únicas
      const uniqueRegions = Array.from(new Set(mockUsers.map(user => user.region)));

      setUsers(mockUsers);
      setRegions(uniqueRegions);
      setLoading(false);
    }, 800);
  }, []);

  // Formatear fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString();
  };

  // Función para renderizar el badge de rol
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
            Super Admin
          </span>
        );
      case 'REGIONAL_ADMIN':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Admin Regional
          </span>
        );
      case 'PROMOTER':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Promotor
          </span>
        );
      case 'USER':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Usuario
          </span>
        );
      default:
        return null;
    }
  };

  // Función para renderizar el badge de estado
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Activo
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Inactivo
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        );
      default:
        return null;
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    // Filtro de búsqueda
    if (
      searchTerm &&
      !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filtro de rol
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }

    // Filtro de estado
    if (statusFilter !== 'all' && user.status !== statusFilter) {
      return false;
    }

    // Filtro de región
    if (regionFilter !== 'all' && user.region !== regionFilter) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <Link
          to="/admin/users/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Usuario
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              id="search"
              placeholder="Nombre o email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              id="roleFilter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los roles</option>
              <option value="USER">Usuario</option>
              <option value="PROMOTER">Promotor</option>
              <option value="REGIONAL_ADMIN">Admin Regional</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="pending">Pendiente</option>
            </select>
          </div>

          <div>
            <label htmlFor="regionFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Región
            </label>
            <select
              id="regionFilter"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas las regiones</option>
              {regions.map((region, index) => (
                <option key={index} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Región
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Acceso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.region}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.lastLogin)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link to={`/admin/users/${user.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                      Ver
                    </Link>
                    <Link to={`/admin/users/${user.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      Editar
                    </Link>
                    {user.status === 'active' ? (
                      <button className="text-red-600 hover:text-red-900">
                        Desactivar
                      </button>
                    ) : (
                      <button className="text-green-600 hover:text-green-900">
                        Activar
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No se encontraron usuarios con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;