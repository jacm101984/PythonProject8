// src/pages/PromoCodePage.tsx

import React, { useState, useEffect } from 'react';

interface PromoCode {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  status: 'active' | 'inactive' | 'expired';
  usage: number;
  maxUsage: number | null;
  createdAt: string;
  expiresAt: string | null;
}

const PromoCodePage: React.FC = () => {
  // Estados para gestión de códigos promocionales
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Estados para el formulario de nuevo código
  const [newCode, setNewCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [maxUsage, setMaxUsage] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Cargar datos de ejemplo
  useEffect(() => {
    // Simular carga de datos desde API
    setTimeout(() => {
      setPromoCodes([
        {
          id: '1',
          code: 'WELCOME20',
          discount: 20,
          discountType: 'percentage',
          status: 'active',
          usage: 45,
          maxUsage: 100,
          createdAt: '2025-01-15T10:00:00',
          expiresAt: '2025-06-30T23:59:59'
        },
        {
          id: '2',
          code: 'SUMMER2025',
          discount: 15,
          discountType: 'percentage',
          status: 'active',
          usage: 12,
          maxUsage: 50,
          createdAt: '2025-02-20T14:30:00',
          expiresAt: '2025-08-31T23:59:59'
        },
        {
          id: '3',
          code: 'FIRSTORDER',
          discount: 10,
          discountType: 'fixed',
          status: 'active',
          usage: 28,
          maxUsage: null,
          createdAt: '2025-01-01T00:00:00',
          expiresAt: null
        },
        {
          id: '4',
          code: 'SPRING2024',
          discount: 25,
          discountType: 'percentage',
          status: 'expired',
          usage: 87,
          maxUsage: 100,
          createdAt: '2024-03-01T00:00:00',
          expiresAt: '2024-05-31T23:59:59'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // Formatear fecha
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No expira';
    return new Date(dateString).toLocaleDateString();
  };

  // Manejar envío del formulario de creación
  const handleCreateCode = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!newCode || !discountAmount) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    // Crear nuevo código promocional
    const newPromoCode: PromoCode = {
      id: `${Date.now()}`,
      code: newCode.toUpperCase(),
      discount: parseFloat(discountAmount),
      discountType: discountType,
      status: 'active',
      usage: 0,
      maxUsage: maxUsage ? parseInt(maxUsage) : null,
      createdAt: new Date().toISOString(),
      expiresAt: expiryDate ? new Date(expiryDate).toISOString() : null
    };

    // Actualizar lista de códigos
    setPromoCodes([newPromoCode, ...promoCodes]);

    // Reiniciar formulario
    setNewCode('');
    setDiscountAmount('');
    setDiscountType('percentage');
    setMaxUsage('');
    setExpiryDate('');
    setIsCreating(false);
  };

  // Función para desactivar código
  const toggleCodeStatus = (id: string) => {
    setPromoCodes(
      promoCodes.map(code =>
        code.id === id
          ? { ...code, status: code.status === 'active' ? 'inactive' : 'active' }
          : code
      )
    );
  };

  // Renderizar badge de estado
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
      case 'expired':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Expirado
          </span>
        );
      default:
        return null;
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-800">Mis Códigos Promocionales</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Nuevo Código
        </button>
      </div>

      {/* Formulario para crear nuevo código */}
      {isCreating && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Crear Nuevo Código Promocional</h2>
          <form onSubmit={handleCreateCode}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Código
                </label>
                <input
                  type="text"
                  id="code"
                  placeholder="ej. SUMMER25"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Descuento
                </label>
                <select
                  id="discountType"
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="percentage">Porcentaje (%)</option>
                  <option value="fixed">Monto Fijo ($)</option>
                </select>
              </div>

              <div>
                <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad de Descuento
                </label>
                <input
                  type="number"
                  id="discountAmount"
                  placeholder={discountType === 'percentage' ? "ej. 20" : "ej. 10"}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxUsage" className="block text-sm font-medium text-gray-700 mb-1">
                  Usos Máximos (opcional)
                </label>
                <input
                  type="number"
                  id="maxUsage"
                  placeholder="Dejar en blanco para ilimitado"
                  value={maxUsage}
                  onChange={(e) => setMaxUsage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Expiración (opcional)
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Crear Código
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de códigos promocionales */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Códigos Activos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descuento
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uso
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiración
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.map((code) => (
                <tr key={code.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{code.code}</div>
                    <div className="text-sm text-gray-500">Creado: {formatDate(code.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {code.discountType === 'percentage'
                        ? `${code.discount}%`
                        : `$${code.discount.toFixed(2)} USD`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {code.usage} {code.maxUsage ? `/ ${code.maxUsage}` : ''}
                    </div>
                    {code.maxUsage && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${Math.min(100, (code.usage / code.maxUsage) * 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(code.expiresAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(code.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {code.status !== 'expired' && (
                      <button
                        onClick={() => toggleCodeStatus(code.id)}
                        className={`mr-3 ${
                          code.status === 'active' 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {code.status === 'active' ? 'Desactivar' : 'Activar'}
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-900">
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}

              {promoCodes.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No hay códigos promocionales todavía. Crea tu primer código para empezar a promocionar.
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

export default PromoCodePage;