// src/pages/AdminRegionFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaGlobe, FaCode, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { api } from '../../../services/api';

interface Region {
  id?: string;
  name: string;
  code: string;
  active: boolean;
  description?: string;
}

const AdminRegionFormPage: React.FC = () => {
  const { regionId } = useParams<{ regionId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!regionId;

  const [formData, setFormData] = useState<Region>({
    name: '',
    code: '',
    active: true,
    description: ''
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si estamos en modo edición, cargar los datos de la región
    if (isEditMode) {
      const fetchRegion = async () => {
        try {
          // En producción, esto sería una llamada real a la API
          // const response = await api.get(`/admin/regions/${regionId}`);
          // setFormData(response.data.data);

          // Por ahora, usamos datos de ejemplo
          setFormData({
            id: regionId,
            name: 'Norte',
            code: 'REGION-001',
            active: true,
            description: 'Región norte del país'
          });

          setLoading(false);
        } catch (error) {
          console.error('Error al cargar región:', error);
          toast.error('No se pudo cargar la información de la región');
          navigate('/admin/regions');
        }
      };

      fetchRegion();
    }
  }, [regionId, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  const handleToggleActive = () => {
    setFormData(prev => ({ ...prev, active: !prev.active }));
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre de la región es obligatorio';
    }

    if (!formData.code.trim()) {
      errors.code = 'El código de la región es obligatorio';
    } else if (!/^[A-Z0-9-]+$/.test(formData.code.trim())) {
      errors.code = 'El código debe contener solo letras mayúsculas, números y guiones';
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
        // await api.put(`/admin/regions/${regionId}`, formData);
      } else {
        // En producción, esto sería una llamada real a la API
        // await api.post('/admin/regions', formData);
      }

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`Región ${isEditMode ? 'actualizada' : 'creada'} exitosamente`);
      navigate('/admin/regions');
    } catch (err: any) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} región:`, err);
      setError(err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la región`);
      toast.error(`No se pudo ${isEditMode ? 'actualizar' : 'crear'} la región`);
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
          {isEditMode ? 'Editar Región' : 'Crear Nueva Región'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre de la región */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la región
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Ej: Norte, Sur, Este, etc."
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            {/* Código de la región */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Código de la región
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCode className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.code ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Ej: REGION-001"
                />
              </div>
              {formErrors.code && (
                <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
              )}
            </div>

            {/* Estado de la región */}
            <div className="md:col-span-2">
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Estado de la región
              </span>
              <button
                type="button"
                onClick={handleToggleActive}
                className="flex items-center space-x-2 text-sm"
              >
                {formData.active ? (
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
                Las regiones inactivas no podrán recibir nuevos usuarios ni procesar órdenes.
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
                placeholder="Descripción detallada de la región"
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
            onClick={() => navigate('/admin/regions')}
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
              isEditMode ? 'Actualizar Región' : 'Crear Región'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminRegionFormPage;