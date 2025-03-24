// src/pages/user/DashboardPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeCards, setActiveCards] = useState(4);
  const [totalScans, setTotalScans] = useState(128);
  const [totalReviews, setTotalReviews] = useState(86);
  const [conversionRate, setConversionRate] = useState(67.2);

  // Datos de ejemplo para el gráfico de actividad reciente
  const recentActivity = [
    { date: '10 Mar', scans: 12, reviews: 8 },
    { date: '11 Mar', scans: 15, reviews: 10 },
    { date: '12 Mar', scans: 8, reviews: 5 },
    { date: '13 Mar', scans: 20, reviews: 14 },
    { date: '14 Mar', scans: 18, reviews: 12 },
    { date: '15 Mar', scans: 25, reviews: 17 },
    { date: '16 Mar', scans: 30, reviews: 20 }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {user?.name || 'Usuario'}</h1>
        <p className="text-gray-600">Aquí tienes un resumen de la actividad de tus tarjetas NFC</p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Tarjetas Activas</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{activeCards}</p>
          <div className="mt-1 text-green-600 text-sm">+2 este mes</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Total de Escaneos</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalScans}</p>
          <div className="mt-1 text-green-600 text-sm">+28 esta semana</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Reseñas Generadas</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalReviews}</p>
          <div className="mt-1 text-green-600 text-sm">+18 esta semana</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm font-medium">Tasa de Conversión</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{conversionRate}%</p>
          <div className="mt-1 text-green-600 text-sm">+2.5% vs. mes anterior</div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
        <div className="h-64 w-full">
          {/* Aquí iría un gráfico real con Chart.js o rechart */}
          <div className="flex items-end h-48 w-full border-b border-l border-gray-300 relative">
            {recentActivity.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="flex-1 w-full flex items-end justify-center space-x-1">
                  <div
                    className="w-4 bg-blue-500"
                    style={{ height: `${(day.scans / 30) * 100}%` }}
                  ></div>
                  <div
                    className="w-4 bg-green-500"
                    style={{ height: `${(day.reviews / 30) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">{day.date}</div>
              </div>
            ))}

            {/* Leyenda del gráfico */}
            <div className="absolute top-0 right-0 flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                <span className="text-xs text-gray-600">Escaneos</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 mr-1"></div>
                <span className="text-xs text-gray-600">Reseñas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Últimas Interacciones</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarjeta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16 Mar, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">NFC #0042</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Escaneo</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Reseña completa
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">16 Mar, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">NFC #0039</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Escaneo</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pendiente
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 Mar, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">NFC #0042</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Escaneo</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Reseña completa
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15 Mar, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">NFC #0045</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Activación</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Tarjeta activa
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;