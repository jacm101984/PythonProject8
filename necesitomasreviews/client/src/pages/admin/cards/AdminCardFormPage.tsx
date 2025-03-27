// src/pages/AdminCardFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaCreditCard, FaUser, FaBuilding, FaLink, FaToggleOn, FaToggleOff, FaQrcode } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

interface NFCCard {
  id?: string;
  uid: string;
  name: string;
  userId: string;
  businessName: string;
  googleReviewLink: string;
  status: 'active' | 'inactive' | 'pending';
  description?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string;
}

const AdminCardFormPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const isEditMode = !!cardId;

  // Base path para las rutas dependiendo del rol
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

  const [formData, setFormData] = useState<NFCCard>({
    uid: '',
    name: '',
    userId: '',
    businessName: '',
    googleReviewLink: '',
    status: 'pending',
    description: ''
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    // Cargar usuarios
    const fetchUsers = async () => {
      try {
        // En producción, esto sería una llamada real a la API
        // const response = await api.get('/admin/users?role=USER');
        // setUsers(response.data.data);

        // Por ahora, usamos datos de ejemplo
        setUsers([
          { id: 'user1', name: 'Juan Pérez', email: 'juan@example.com', businessName: 'Café del Centro' },
          { id: 'user2', name: 'María López', email: 'maria@example.com', businessName: 'Restaurante El Mirador' },
          { id: 'user3', name: 'Carlos Rodríguez', email: 'carlos@example.com', businessName: 'Bar La Esquina' },
          { id: 'user4', name: 'Ana García', email: 'ana@example.com', businessName: 'Hotel Plaza' }
        ]);
        setLoadingUsers(false);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        toast.error('No se pudieron cargar los usuarios');
        setLoadingUsers(false);
      }
    };

    fetchUsers();

    // Si estamos en modo edición, cargar los datos de la tarjeta
    if (isEditMode) {
      const fetchCard = async () => {
        try {
          // En producción, esto sería una llamada real a la API
          // const response = await api.get(`/admin/cards/${cardId}`);
          // setFormData(response.data.data);

          // Por ahora, usamos datos de ejemplo
          setFormData({
            id: cardId,
            uid: 'NFC001',
            name: 'Tarjeta Principal',
            userId: 'user1',
            businessName: 'Café del Centro',
            googleReviewLink: 'https://g.page/r/example1',
            status: 'active',
            description: 'Tarjeta ubicada en la entrada principal'
          });

          setLoading(false);
        } catch (error) {
          console.error('Error al cargar tarjeta:', error);
          toast.error('No se pudo cargar la información de la tarjeta');
          navigate(`${basePath}/cards`);
        }
      };

      fetchCard();
    }
  }, [cardId, isEditMode, navigate, basePath]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    // Si el campo es userId, también actualizar businessName
    if (name === 'userId') {
      const selectedUser = users.find(user => user.id === value);
      if (selectedUser && selectedUser.businessName) {
        setFormData(prev => ({ ...prev, businessName: selectedUser.businessName }));
      }
    }

    // Eliminar error si el usuario comienza a escribir
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleToggleStatus = () => {
    setFormData(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active'
    }));
  };

  const generateRandomUID = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let uid = 'NFC';
    for (let i = 0; i < 5; i++) {
      uid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, uid }));

    // Eliminar error si existe
    if (formErrors.uid) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.uid;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.uid.trim()) {
      errors.uid = 'El identificador UID es obligatorio';
    }

    if (!formData.name.trim()) {
      errors.name = 'El nombre de la tarjeta es obligatorio';
    }

    if (!formData.userId) {
      errors.userId = 'Debes seleccionar un usuario';
    }

    if (!formData.businessName.trim()) {
      errors.businessName = 'El nombre del negocio es obligatorio';
    }

    if (!formData.googleReviewLink.trim()) {
      errors.googleReviewLink = 'El enlace de reseña de Google es obligatorio';
    } else if (!formData.googleReviewLink.startsWith('https://')) {
      errors.googleReviewLink = 'El enlace debe comenzar con https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (isEditMode) {
        // En producción, esto sería una llamada real a la API
        // await api.put(`/admin/cards/${cardId}`, formData);
      } else {
        // En producción, esto sería una llamada real a la API
        // await api.post('/admin/cards', formData);
      }

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`Tarjeta NFC ${isEditMode ? 'actualizada' : 'creada'} exitosamente`);
      navigate(`${basePath}/cards`);
    } catch (err: any) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} tarjeta:`, err);
      setError(err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la tarjeta`);
      toast.error(`No se pudo ${isEditMode ? 'actualizar' : 'crear'} la tarjeta NFC`);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Editar Tarjeta NFC' : 'Crear Nueva Tarjeta NFC'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UID de la tarjeta */}
            <div>
              <label htmlFor="uid" className="block text-sm font-medium text-gray-700 mb-1">
                Identificador UID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCreditCard className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="uid"
                  name="uid"
                  value={formData.uid}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.uid ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Ej: NFC001"
                  readOnly={isEditMode} // No permitir editar el UID en modo edición
                />
              </div>
              {formErrors.uid && (
                <p className="mt-1 text-sm text-red-600">{formErrors.uid}</p>
              )}
              {!isEditMode && (
                <button
                  type="button"
                  onClick={generateRandomUID}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  Generar UID aleatorio
                </button>
              )}
            </div>

            {/* Nombre de la tarjeta */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Tarjeta
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full py-2 px-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Ej: Tarjeta Principal"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            {/* Usuario asignado */}
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario Asignado
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.userId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  disabled={loadingUsers}
                >
                  <option value="">Seleccionar usuario</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              {formErrors.userId && (
                <p className="mt-1 text-sm text-red-600">{formErrors.userId}</p>
              )}
            </div>

            {/* Nombre del negocio */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.businessName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Ej: Café del Centro"
                />
              </div>
              {formErrors.businessName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.businessName}</p>
              )}
            </div>

            {/* Enlace de reseña de Google */}
            <div>
              <label htmlFor="googleReviewLink" className="block text-sm font-medium text-gray-700 mb-1">
                Enlace de Reseña de Google
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLink className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="googleReviewLink"
                  name="googleReviewLink"
                  value={formData.googleReviewLink}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.googleReviewLink ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="https://g.page/r/example"
                />
              </div>
              {formErrors.googleReviewLink && (
                <p className="mt-1 text-sm text-red-600">{formErrors.googleReviewLink}</p>
              )}
            </div>

            {/* Estado de la tarjeta */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Estado de la Tarjeta
              </span>
              <button
                type="button"
                onClick={handleToggleStatus}
                className="flex items-center space-x-2 text-sm"
              >
                {formData.status === 'active' ? (
                  <>
                    <FaToggleOn className="h-6 w-6 text-green-500" />
                    <span className="text-green-700">Activa</span>
                  </>
                ) : (
                  <>
                    <FaToggleOff className="h-6 w-6 text-gray-400" />
                    <span className="text-gray-700">Inactiva</span>
                  </>
                )}
              </button>
              <p className="mt-1 text-xs text-gray-500">
                Las tarjetas inactivas no podrán ser escaneadas.
              </p>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Descripción o ubicación de la tarjeta"
              />
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => navigate(`${basePath}/cards`)}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              isEditMode ? 'Actualizar Tarjeta' : 'Crear Tarjeta'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCardFormPage;