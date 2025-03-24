// src/pages/AdminCreateUserPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import UserFormBase from '../../../components/forms/UserFormBase';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

interface Region {
  id: string;
  name: string;
}

const AdminCreateUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isSuperAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);

  // Base path para las rutas dependiendo del rol
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

  // Determinar los roles disponibles según el tipo de administrador
  const availableRoles = isSuperAdmin
    ? ['USER', 'PROMOTER', 'REGIONAL_ADMIN', 'SUPER_ADMIN']
    : ['USER', 'PROMOTER'];

  useEffect(() => {
    // Cargar regiones si el usuario es super admin
    if (isSuperAdmin) {
      const fetchRegions = async () => {
        try {
          // En producción, esto sería una llamada real a la API
          // const response = await api.get('/admin/regions');
          // setRegions(response.data.data);

          // Por ahora, usamos datos de ejemplo
          setRegions([
            { id: '1', name: 'Norte' },
            { id: '2', name: 'Sur' },
            { id: '3', name: 'Este' },
            { id: '4', name: 'Oeste' },
            { id: '5', name: 'Centro' },
          ]);
        } catch (error) {
          console.error('Error al cargar regiones:', error);
          toast.error('No se pudieron cargar las regiones');
        }
      };

      fetchRegions();
    }
  }, [isSuperAdmin]);

  const handleSubmit = async (userData: any) => {
    setLoading(true);
    setError(null);

    try {
      // En producción, esto sería una llamada real a la API
      // await api.post('/admin/users', userData);

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Usuario creado exitosamente');
      navigate(`${basePath}/users`);
    } catch (err: any) {
      console.error('Error al crear usuario:', err);
      setError(err.response?.data?.message || 'Error al crear el usuario');
      toast.error('No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Crear Nuevo Usuario</h1>
      </div>

      <UserFormBase
        onSubmit={handleSubmit}
        submitText="Crear Usuario"
        availableRoles={availableRoles}
        regions={regions}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default AdminCreateUserPage;