// src/components/forms/UserFormBase.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaGlobe, FaBuilding } from 'react-icons/fa';

interface UserFormProps {
  initialValues?: {
    name?: string;
    email?: string;
    role?: string;
    regionId?: string;
    company?: string;
    address?: string;
    phone?: string;
    [key: string]: any;
  };
  onSubmit: (data: any) => void;
  submitText: string;
  isEdit?: boolean;
  availableRoles?: string[];
  regions?: { id: string; name: string }[];
  loading?: boolean;
  error?: string | null;
}

const UserFormBase: React.FC<UserFormProps> = ({
  initialValues = {},
  onSubmit,
  submitText,
  isEdit = false,
  availableRoles = ['USER'],
  regions = [],
  loading = false,
  error = null
}) => {
  const { isSuperAdmin } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    name: initialValues.name || '',
    email: initialValues.email || '',
    password: '',
    confirmPassword: '',
    role: initialValues.role || 'USER',
    regionId: initialValues.regionId || '',
    company: initialValues.company || '',
    address: initialValues.address || '',
    phone: initialValues.phone || '',
    ...initialValues
  });

  // Estado de validación
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Eliminar error si el usuario comienza a escribir
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validar formulario antes de enviar
  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    // Validar nombre
    if (!formData.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }

    // Validar email
    if (!formData.email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email inválido';
    }

    // Validar contraseña en caso de creación
    if (!isEdit) {
      if (!formData.password) {
        errors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    // Validar región para administradores regionales
    if (formData.role === 'REGIONAL_ADMIN' && !formData.regionId) {
      errors.regionId = 'Debes seleccionar una región';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Preparar datos para enviar
      const dataToSubmit = { ...formData };

      // Eliminar campos innecesarios
      if (isEdit) {
        delete dataToSubmit.password;
        delete dataToSubmit.confirmPassword;
      }

      onSubmit(dataToSubmit);
    }
  };

  // Renderizar opciones de rol
  const renderRoleOptions = () => {
    const roleMap: {[key: string]: string} = {
      'USER': 'Usuario',
      'PROMOTER': 'Promotor',
      'REGIONAL_ADMIN': 'Administrador Regional',
      'SUPER_ADMIN': 'Super Administrador'
    };

    return availableRoles.map(role => (
      <option key={role} value={role}>
        {roleMap[role] || role}
      </option>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos básicos */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información básica</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Ingresa el nombre completo"
              />
            </div>
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="correo@ejemplo.com"
                disabled={isEdit} // No permitir cambiar el email en edición
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          {/* Contraseña */}
          {!isEdit && (
            <>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Repite la contraseña"
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          {/* Rol (solo para administradores) */}
          {isSuperAdmin && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol de usuario
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {renderRoleOptions()}
              </select>
            </div>
          )}

          {/* Región (para administradores regionales) */}
          {formData.role === 'REGIONAL_ADMIN' && regions.length > 0 && (
            <div>
              <label htmlFor="regionId" className="block text-sm font-medium text-gray-700 mb-1">
                Región asignada
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGlobe className="text-gray-400" />
                </div>
                <select
                  id="regionId"
                  name="regionId"
                  value={formData.regionId}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.regionId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                >
                  <option value="">Selecciona una región</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              {formErrors.regionId && (
                <p className="mt-1 text-sm text-red-600">{formErrors.regionId}</p>
              )}
            </div>
          )}

          {/* Empresa (para promotores) */}
          {formData.role === 'PROMOTER' && (
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nombre de la empresa"
                />
              </div>
            </div>
          )}

          {/* Teléfono (opcional) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono (opcional)
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="+1 123 456 7890"
            />
          </div>
        </div>
      </div>

      {/* Información adicional (dirección) */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información adicional</h3>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección (opcional)
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Dirección completa"
          />
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
          onClick={() => window.history.back()}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            submitText
          )}
        </button>
      </div>
    </form>
  );
};

export default UserFormBase;