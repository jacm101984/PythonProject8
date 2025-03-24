// src/pages/AdminEditUserPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import UserFormBase from '../../../components/forms/UserFormBase';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

interface Region {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  regionId?: string;
  company?: string;
  address?: string;
  phone?: string;
  status: string;
}

const AdminEditUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);

  // Base path para las rutas dependiendo del rol
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

  // Determinar los roles disponibles según el tipo de administrador
  const availableRoles = isSuperAdmin
    ? ['USER', 'PROMOTER', 'REGIONAL_ADMIN', 'SUPER_ADMIN']
    : ['USER', 'PROMOTER'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar el usuario
        // En producción, esto sería una llamada real a la API
        // const userResponse = await api.get(`/admin/users/${userId}`);
        // setUser(userResponse.data.data);

        // Por ahora, usamos datos de ejemplo
        setUser({
          id: userId || '1',
          name: 'Juan Pérez',
          email: 'juan@example.com',
          role: 'USER',
          company: '',
          address: 'Calle 123, Ciudad',
          phone: '+1234567890',
          status: 'active'
        });

        // Cargar regiones si el usuario es super admin
        if (isSuperAdmin) {
          // En producción, esto sería una llamada real a la API
          // const regionsResponse = await api.get('/admin/regions');
          // setRegions(regionsResponse.data.data);

          // Por ahora, usamos datos de ejemplo
          setRegions([
            { id: '1', name: 'Norte' },
            { id: '2', name: 'Sur' },
            { id: '3', name: 'Este' },
            { id: '4', name: 'Oeste' },
            { id: '5', name: 'Centro' },
          ]);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('No se pudieron cargar los datos del usuario');
        navigate(`${basePath}/users`);
      }
    };

    fetchData();
  }, [userId, isSuperAdmin, navigate, basePath]);

  const handleSubmit = async (userData: any) => {
    setSubmitting(true);
    setError(null);

    try {
      // En producción, esto sería una llamada real a la API
      // await api.put(`/admin/users/${userId}`, userData);

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Usuario actualizado exitosamente');
      navigate(`${basePath}/users`);
    } catch (err: any) {
      console.error('Error al actualizar usuario:', err);
      setError(err.response?.data?.message || 'Error al actualizar el usuario');
      toast.error('No se pudo actualizar el usuario');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Usuario no encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">El usuario que intentas editar no existe o no tienes permisos.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Editar Usuario</h1>
      </div>

      <UserFormBase
        initialValues={user}
        onSubmit={handleSubmit}
        submitText="Actualizar Usuario"
        isEdit={true}
        availableRoles={availableRoles}
        regions={regions}
        loading={submitting}
        error={error}
      />
    </div>
  );
};

export default AdminEditUserPage;