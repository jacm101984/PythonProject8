// src/pages/PromoterCodeFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaTicketAlt, FaPercent, FaDollarSign, FaCalendarAlt, FaUsers, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { api } from '../../services/api';

interface PromoCode {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  active: boolean;
  description?: string;
}

const PromoterCodeFormPage: React.FC = () => {
  const { codeId } = useParams<{ codeId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!codeId;

  const [formData, setFormData] = useState<PromoCode>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    startDate: new Date().toISOString().split('T')[0], // Today
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0], // 3 months from now
    maxUses: 100,
    active: true,
    description: ''
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si estamos en modo edición, cargar los datos del código promocional
    if (isEditMode) {
      const fetchPromoCode = async () => {
        try {
          // En producción, esto sería una llamada real a la API
          // const response = await api.get(`/promoter/codes/${codeId}`);
          // setFormData(response.data.data);

          // Por ahora, usamos datos de ejemplo
          setFormData({
            id: codeId,
            code: 'PROMO10',
            discountType: 'percentage',
            discountValue: 10,
            startDate: '2025-01-01',
            endDate: '2025-12-31',
            maxUses: 100,
            active: true,
            description: 'Código de descuento del 10%'
          });

          setLoading(false);
        } catch (error) {
          console.error('Error al cargar código promocional:', error);
          toast.error('No se pudo cargar la información del código promocional');
          navigate('/promoter/codes');
        }
      };

      fetchPromoCode();
    }
  }, [codeId, isEditMode, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
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

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code }));

    // Eliminar error si existe
    if (formErrors.code) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.code;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.code.trim()) {
      errors.code = 'El código promocional es obligatorio';
    } else if (!/^[A-Z0-9-_]+$/.test(formData.code.trim())) {
      errors.code = 'El código debe contener solo letras mayúsculas, números, guiones y guiones bajos';
    }

    if (formData.discountValue <= 0) {
      errors.discountValue = 'El valor del descuento debe ser mayor que 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      errors.discountValue = 'El descuento en porcentaje no puede ser mayor al 100%';
    }

    if (!formData.startDate) {
      errors.startDate = 'La fecha de inicio es obligatoria';
    }

    if (!formData.endDate) {
      errors.endDate = 'La fecha de fin es obligatoria';
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (formData.maxUses <= 0) {
      errors.maxUses = 'El número máximo de usos debe ser mayor que 0';
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
        // await api.put(`/promoter/codes/${codeId}`, formData);
      } else {
        // En producción, esto sería una llamada real a la API
        // await api.post('/promoter/codes', formData);
      }

      // Simulamos un retraso para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`Código promocional ${isEditMode ? 'actualizado' : 'creado'} exitosamente`);
      navigate('/promoter/codes');
    } catch (err: any) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} código promocional:`, err);
      setError(err.response?.data?.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el código promocional`);
      toast.error(`No se pudo ${isEditMode ? 'actualizar' : 'crear'} el código promocional`);
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
          {isEditMode ? 'Editar Código Promocional' : 'Crear Nuevo Código Promocional'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Código promocional */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Código Promocional
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTicketAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.code ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Ej: VERANO2025"
                />
              </div>
              {formErrors.code && (
                <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
              )}
              <button
                type="button"
                onClick={generateRandomCode}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                Generar código aleatorio
              </button>
            </div>

            {/* Tipo de descuento */}
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Descuento
              </label>
              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($)</option>
              </select>
            </div>

            {/* Valor del descuento */}
            <div>
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">
                Valor del Descuento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {formData.discountType === 'percentage' ? (
                    <FaPercent className="text-gray-400" />
                  ) : (
                    <FaDollarSign className="text-gray-400" />
                  )}
                </div>
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  min="0"
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  max={formData.discountType === 'percentage' ? '100' : undefined}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.discountValue ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              {formErrors.discountValue && (
                <p className="mt-1 text-sm text-red-600">{formErrors.discountValue}</p>
              )}
            </div>

            {/* Fecha de inicio */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Inicio
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
              )}
            </div>

            {/* Fecha de fin */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Fin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              {formErrors.endDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
              )}
            </div>

            {/* Usos máximos */}
            <div>
              <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 mb-1">
                Usos Máximos
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUsers className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="maxUses"
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className={`block w-full pl-10 pr-3 py-2 border ${formErrors.maxUses ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
              </div>
              {formErrors.maxUses && (
                <p className="mt-1 text-sm text-red-600">{formErrors.maxUses}</p>
              )}
            </div>

            {/* Estado del código */}
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Estado del Código
              </span>
              <button
                type="button"
                onClick={handleToggleActive}
                className="flex items-center space-x-2 text-sm"
              >
                {formData.active ? (
                  <>
                    <FaToggleOn className="h-6 w-6 text-green-500" />
                    <span className="text-green-700">Activo</span>
                  </>
                ) : (
                  <>
                    <FaToggleOff className="h-6 w-6 text-gray-400" />
                    <span className="text-gray-700">Inactivo</span>
                  </>
                )}
              </button>
              <p className="mt-1 text-xs text-gray-500">
                Los códigos inactivos no podrán ser utilizados en el checkout.
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
                placeholder="Descripción para identificar este código promocional"
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
            onClick={() => navigate('/promoter/codes')}
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
              isEditMode ? 'Actualizar Código' : 'Crear Código'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromoterCodeFormPage;