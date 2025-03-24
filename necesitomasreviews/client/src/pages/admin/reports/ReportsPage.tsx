// src/pages/ReportsPage.tsx

import React, { useState, useEffect } from 'react';

// Datos para los gráficos
interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

// Estructura para las métricas
interface Metrics {
  totalUsers: number;
  totalCards: number;
  totalScans: number;
  totalReviews: number;
  conversionRate: number;
  activeCards: number;
  inactiveCards: number;
  pendingCards: number;
}

const ReportsPage: React.FC = () => {
  // Estados para datos y filtros
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    totalCards: 0,
    totalScans: 0,
    totalReviews: 0,
    conversionRate: 0,
    activeCards: 0,
    inactiveCards: 0,
    pendingCards: 0
  });
  const [usersChartData, setUsersChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [activityChartData, setActivityChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [conversionChartData, setConversionChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [regionChartData, setRegionChartData] = useState<ChartData>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);

  // Cargar datos de ejemplo
  useEffect(() => {
    // Simular carga de datos desde API
    setTimeout(() => {
      // Métricas generales
      setMetrics({
        totalUsers: 836,
        totalCards: 1042,
        totalScans: 5367,
        totalReviews: 3752,
        conversionRate: 69.9,
        activeCards: 892,
        inactiveCards: 98,
        pendingCards: 52
      });

      // Datos para gráfico de crecimiento de usuarios
      setUsersChartData({
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Usuarios',
            data: [120, 145, 190, 230, 290, 350, 410, 480, 560, 650, 750, 836],
            borderColor: '#3b82f6',
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Tarjetas',
            data: [150, 190, 245, 305, 380, 470, 550, 650, 760, 870, 980, 1042],
            borderColor: '#10b981',
            borderWidth: 2,
            fill: false
          }
        ]
      });

      // Datos para gráfico de actividad
      setActivityChartData({
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Escaneos',
            data: [220, 345, 490, 630, 890, 1250, 1750, 2300, 2950, 3650, 4550, 5367],
            borderColor: '#f59e0b',
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Reseñas',
            data: [152, 240, 345, 440, 630, 870, 1210, 1600, 2050, 2560, 3150, 3752],
            borderColor: '#8b5cf6',
            borderWidth: 2,
            fill: false
          }
        ]
      });

      // Datos para gráfico de tasa de conversión
      setConversionChartData({
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Tasa de Conversión (%)',
            data: [69.1, 69.6, 70.4, 69.8, 70.8, 69.6, 69.1, 69.6, 69.5, 70.1, 69.2, 69.9],
            borderColor: '#ec4899',
            borderWidth: 2,
            fill: false
          }
        ]
      });

      // Datos para gráfico de distribución por región
      setRegionChartData({
        labels: ['Santiago', 'Valparaíso', 'Concepción', 'Antofagasta', 'Ciudad de México', 'Otras'],
        datasets: [
          {
            label: 'Distribución por Región',
            data: [352, 198, 124, 62, 45, 55],
            backgroundColor: [
              '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'
            ],
            borderWidth: 1
          }
        ]
      });

      setLoading(false);
    }, 800);
  }, [period]);

  // Cambiar periodo
  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'quarter' | 'year') => {
    setPeriod(newPeriod);
    setLoading(true);
    // En un caso real, aquí se cargarían nuevos datos según el periodo
  };

  // Formatear números
  const formatNumber = (num: number) => {
    return num.toLocaleString();
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
        <h1 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1>

        {/* Selector de periodo */}
        <div className="flex space-x-2">
          <button
            onClick={() => handlePeriodChange('week')}
            className={`px-3 py-1 text-sm rounded-md ${
              period === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => handlePeriodChange('month')}
            className={`px-3 py-1 text-sm rounded-md ${
              period === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mes
          </button>
          <button
            onClick={() => handlePeriodChange('quarter')}
            className={`px-3 py-1 text-sm rounded-md ${
              period === 'quarter' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Trimestre
          </button>
          <button
            onClick={() => handlePeriodChange('year')}
            className={`px-3 py-1 text-sm rounded-md ${
              period === 'year' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Año
          </button>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Usuarios</h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(metrics.totalUsers)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Tarjetas NFC</h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(metrics.totalCards)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-4">
            <span>Activas: {formatNumber(metrics.activeCards)}</span>
            <span>Inactivas: {formatNumber(metrics.inactiveCards)}</span>
            <span>Pendientes: {formatNumber(metrics.pendingCards)}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Escaneos</h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(metrics.totalScans)}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Reseñas</h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">{formatNumber(metrics.totalReviews)}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Tasa de conversión: <span className="font-semibold text-purple-600">{metrics.conversionRate}%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Crecimiento de Usuarios y Tarjetas</h2>
          <div className="h-64">
            {/* Aquí iría un componente de gráfico real */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Gráfico de líneas: Crecimiento de Usuarios y Tarjetas</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Actividad (Escaneos y Reseñas)</h2>
          <div className="h-64">
            {/* Aquí iría un componente de gráfico real */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Gráfico de líneas: Escaneos y Reseñas</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Tasa de Conversión</h2>
          <div className="h-64">
            {/* Aquí iría un componente de gráfico real */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Gráfico de líneas: Tasa de Conversión</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Distribución por Región</h2>
          <div className="h-64">
            {/* Aquí iría un componente de gráfico real */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Gráfico circular: Distribución por Región</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones de reportes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Exportar Reportes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Reporte de Usuarios</h3>
            <p className="text-sm text-gray-500 mb-4">Exporta información detallada de usuarios y sus tarjetas.</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Exportar Excel
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Reporte de Actividad</h3>
            <p className="text-sm text-gray-500 mb-4">Exporta datos de escaneos, reseñas y conversiones.</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Exportar Excel
            </button>
          </div>

          <div className="p-4 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-700 mb-2">Reporte Completo</h3>
            <p className="text-sm text-gray-500 mb-4">Exporta un informe completo con todos los datos del sistema.</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Exportar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;