// src/pages/AdminUsersPage.tsx
import React, { useState, useEffect } from 'react';
import { FaUser, FaUserCog, FaUserTie, FaUserTag, FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'PROMOTER' | 'REGIONAL_ADMIN' | 'SUPER_ADMIN';
  region?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

const AdminUsersPage: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Base path para las rutas dependiendo del rol
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener la lista de usuarios
    // Por ahora, usaremos datos de ejemplo
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Simular una llamada a la API
        setTimeout(() => {
          const mockUsers: User[] = [
            {
              id: '1',
              name: 'Juan Pérez',
              email: 'juan@example.com',
              role: 'USER',
              status: 'active',
              createdAt: '2023-01-15'
            },
            {
              id: '2',
              name: 'María López',
              email: 'maria@example.com',
              role: 'PROMOTER',
              status: 'active',
              createdAt: '2023-02-20'
            },
            {
              id: '3',
              name: 'Carlos Rodríguez',
              email: 'carlos@example.com',
              role: 'REGIONAL_ADMIN',
              region: 'Norte',
              status: 'active',
              createdAt: '2023-03-10'
            },
            {
              id: '4',
              name: 'Ana García',
              email: 'ana@example.com',
              role: 'USER',
              status: 'inactive',
              createdAt: '2023-04-05'
            },
            {
              id: '5',
              name: 'Roberto Sánchez',
              email: 'roberto@example.com',
              role: 'PROMOTER',
              status: 'pending',
              createdAt: '2023-05-12'
            }
          ];
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Función para filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Función para renderizar el icono según el rol
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <FaUserTie className="text-red-500" />;
      case 'REGIONAL_ADMIN':
        return <FaUserCog className="text-blue-500" />;
      case 'PROMOTER':
        return <FaUserTag className="text-green-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  // Función para renderizar el nombre del rol
  const getRoleName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'REGIONAL_ADMIN':
        return 'Admin Regional';
      case 'PROMOTER':
        return 'Promotor';
      default:
        return 'Usuario';
    }
  };

  // Función para renderizar la clase de estado
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
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <Link
          to={`${basePath}/users/new`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <FaPlus className="mr-2" /> Nuevo Usuario
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Buscar por nombre o email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">Todos los roles</option>
              <option value="USER">Usuarios</option>
              <option value="PROMOTER">Promotores</option>
              <option value="REGIONAL_ADMIN">Admins Regionales</option>
              {isSuperAdmin && <option value="SUPER_ADMIN">Super Admins</option>}
            </select>
          </div>

          <div>
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="pending">Pendientes</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
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
      {isSuperAdmin && (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Región
        </th>
      )}
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Estado
      </th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Fecha de Registro
      </th>
      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
        Acciones
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {filteredUsers.map((user) => (
      <tr key={user.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <span className="mr-2">{getRoleIcon(user.role)}</span>
            <span className="text-sm text-gray-900">{getRoleName(user.role)}</span>
          </div>
        </td>
        {isSuperAdmin && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {user.region || '-'}
          </td>
        )}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
            {user.status === 'active' ? 'Activo' : user.status === 'inactive' ? 'Inactivo' : 'Pendiente'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <Link
            to={`${basePath}/users/${user.id}/edit`}
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
            <FaUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron usuarios</h3>
            <p className="mt-1 text-sm text-gray-500">
              Intenta con otros filtros o crea un nuevo usuario.
            </p>
            <div className="mt-6">
              <Link
                to={`${basePath}/users/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Nuevo Usuario
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;