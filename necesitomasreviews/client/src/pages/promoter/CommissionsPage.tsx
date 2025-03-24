// src/pages/CommissionsPage.tsx

import React, { useState, useEffect } from 'react';

// Tipos de datos
interface Commission {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  promoCode: string;
}

interface CommissionSummary {
  totalEarned: number;
  pendingPayment: number;
  totalPaid: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
}

const CommissionsPage: React.FC = () => {
  // Estados para comisiones y filtros
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary>({
    totalEarned: 0,
    pendingPayment: 0,
    totalPaid: 0,
    thisMonthEarnings: 0,
    lastMonthEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'thisMonth' | 'lastMonth' | 'custom'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Cargar datos de ejemplo
  useEffect(() => {
    // Simular carga de datos desde API
    setTimeout(() => {
      const mockCommissions = [
        {
          id: '1',
          orderId: 'order-001',
          orderNumber: 'ORD-2025-00123',
          customerName: 'Juan Pérez',
          date: '2025-03-10T14:30:00',
          amount: 7.90,
          status: 'paid' as const,
          promoCode: 'WELCOME20'
        },
        {
          id: '2',
          orderId: 'order-002',
          orderNumber: 'ORD-2025-00145',
          customerName: 'María González',
          date: '2025-03-15T09:45:00',
          amount: 5.90,
          status: 'pending' as const,
          promoCode: 'WELCOME20'
        },
        {
          id: '3',
          orderId: 'order-003',
          orderNumber: 'ORD-2025-00156',
          customerName: 'Carlos Rodríguez',
          date: '2025-03-18T11:20:00',
          amount: 11.90,
          status: 'pending' as const,
          promoCode: 'SUMMER2025'
        },
        {
          id: '4',
          orderId: 'order-004',
          orderNumber: 'ORD-2025-00178',
          customerName: 'Ana Martínez',
          date: '2025-02-25T16:15:00',
          amount: 7.90,
          status: 'paid' as const,
          promoCode: 'WELCOME20'
        },
        {
          id: '5',
          orderId: 'order-005',
          orderNumber: 'ORD-2025-00189',
          customerName: 'Diego Sánchez',
          date: '2025-02-20T10:30:00',
          amount: 5.90,
          status: 'paid' as const,
          promoCode: 'WELCOME20'
        }
      ];

      // Calcular resumen
      const totalEarned = mockCommissions.reduce((sum, comm) => sum + comm.amount, 0);
      const pendingPayment = mockCommissions
        .filter(comm => comm.status === 'pending')
        .reduce((sum, comm) => sum + comm.amount, 0);
      const totalPaid = mockCommissions
        .filter(comm => comm.status === 'paid')
        .reduce((sum, comm) => sum + comm.amount, 0);

      const currentMonth = new Date().getMonth();
      const thisMonthEarnings = mockCommissions
        .filter(comm => new Date(comm.date).getMonth() === currentMonth)
        .reduce((sum, comm) => sum + comm.amount, 0);

      const lastMonthEarnings = mockCommissions
        .filter(comm => new Date(comm.date).getMonth() === (currentMonth - 1 + 12) % 12)
        .reduce((sum, comm) => sum + comm.amount, 0);

      setCommissions(mockCommissions);
      setSummary({
        totalEarned,
        pendingPayment,
        totalPaid,
        thisMonthEarnings,
        lastMonthEarnings
      });
      setLoading(false);
    }, 800);
  }, []);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Formatear monto
  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)} USD`;
  };

  // Filtrar comisiones según criterios
  const filteredCommissions = commissions.filter(commission => {
    // Filtro por estado
    if (filter !== 'all' && commission.status !== filter) {
      return false;
    }

    // Filtro por fecha
    if (dateRange !== 'all') {
      const commDate = new Date(commission.date);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      if (dateRange === 'thisMonth') {
        return commDate.getMonth() === currentMonth &&
               commDate.getFullYear() === currentYear;
      }

      if (dateRange === 'lastMonth') {
        const lastMonth = (currentMonth - 1 + 12) % 12;
        const lastMonthYear = lastMonth === 11 ? currentYear - 1 : currentYear;
        return commDate.getMonth() === lastMonth &&
               commDate.getFullYear() === lastMonthYear;
      }

      if (dateRange === 'custom' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Final del día
        return commDate >= start && commDate <= end;
      }
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mis Comisiones</h1>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Ganado</h3>
          <p className="text-3xl font-bold text-gray-800">{formatAmount(summary.totalEarned)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pendiente de Pago</h3>
          <p className="text-3xl font-bold text-yellow-600">{formatAmount(summary.pendingPayment)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Pagado</h3>
          <p className="text-3xl font-bold text-green-600">{formatAmount(summary.totalPaid)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Este Mes</h3>
          <p className="text-3xl font-bold text-blue-600">{formatAmount(summary.thisMonthEarnings)}</p>
          <p className="text-sm text-gray-500 mt-2">
            Mes pasado: {formatAmount(summary.lastMonthEarnings)}
            {summary.lastMonthEarnings > 0 &&
              <span className={`ml-2 ${summary.thisMonthEarnings > summary.lastMonthEarnings ? 'text-green-600' : 'text-red-600'}`}>
                {summary.thisMonthEarnings > summary.lastMonthEarnings ? '↑' : '↓'}
                {Math.abs(Math.round((summary.thisMonthEarnings - summary.lastMonthEarnings) / summary.lastMonthEarnings * 100))}%
              </span>
            }
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              id="statusFilter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'paid')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="paid">Pagados</option>
            </select>
          </div>

          <div>
            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <select
              id="dateFilter"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'all' | 'thisMonth' | 'lastMonth' | 'custom')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todo el tiempo</option>
              <option value="thisMonth">Este mes</option>
              <option value="lastMonth">Mes pasado</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <div className="md:col-span-1 grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla de comisiones */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Historial de Comisiones</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Pedido
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código Promo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comisión
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommissions.map((commission) => (
                <tr key={commission.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(commission.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={`/orders/${commission.orderId}`} className="text-blue-600 hover:text-blue-900">
                      {commission.orderNumber}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {commission.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {commission.promoCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatAmount(commission.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {commission.status === 'paid' ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Pagado
                      </span>
                    ) : commission.status === 'pending' ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pendiente
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Cancelado
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredCommissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No se encontraron comisiones con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {summary.pendingPayment > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-700">
                Tienes <span className="font-medium">{formatAmount(summary.pendingPayment)}</span> pendientes de pago
              </span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Solicitar Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionsPage;