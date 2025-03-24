// src/components/ConversionAnalysis.tsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { toast } from 'react-hot-toast';
import { analyticsService } from '../services/analyticsService';

interface ConversionAnalysisProps {
  timeframe: string;
  regionId?: string;
}

interface ConversionData {
  dates: string[];
  scans: number[];
  reviews: number[];
  conversionRates: number[];
}

const ConversionAnalysis: React.FC<ConversionAnalysisProps> = ({ timeframe, regionId }) => {
  const [data, setData] = useState<ConversionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [timeframe, regionId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const result = await analyticsService.getConversionAnalysis(timeframe, regionId);
      setData(result);
    } catch (error) {
      toast.error('Error al cargar datos de conversión');
      console.error('Error fetching conversion data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        No se pudieron cargar los datos de conversión.
      </div>
    );
  }

  // Configuración del gráfico para escaneos y reseñas
  const conversionChart = {
    labels: data.dates,
    datasets: [
      {
        label: 'Escaneos',
        data: data.scans,
        fill: false,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.1
      },
      {
        label: 'Reseñas',
        data: data.reviews,
        fill: false,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.1
      }
    ]
  };

  // Configuración del gráfico para tasa de conversión
  const rateChart = {
    labels: data.dates,
    datasets: [
      {
        label: 'Tasa de Conversión (%)',
        data: data.conversionRates,
        fill: false,
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgba(245, 158, 11, 1)',
        tension: 0.1
      }
    ]
  };

  // Calcular promedios para métricas resumidas
  const avgConversionRate = data.conversionRates.reduce((sum, rate) => sum + rate, 0) / data.conversionRates.length;
  const totalScans = data.scans.reduce((sum, value) => sum + value, 0);
  const totalReviews = data.reviews.reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-8">
      {/* Métricas resumidas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Escaneos</p>
          <p className="text-2xl font-bold">{totalScans}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Total Reseñas</p>
          <p className="text-2xl font-bold">{totalReviews}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 font-medium">Conversión Promedio</p>
          <p className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Gráfico de Escaneos y Reseñas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Escaneos vs. Reseñas</h3>
        <div className="h-80">
          <Line
            data={conversionChart}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Cantidad'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Fecha'
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Gráfico de Tasa de Conversión */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Tasa de Conversión</h3>
        <div className="h-80">
          <Line
            data={rateChart}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Porcentaje (%)'
                  },
                  max: 100
                },
                x: {
                  title: {
                    display: true,
                    text: 'Fecha'
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Tabla de datos detallada */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Detalles por Fecha</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Escaneos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reseñas
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasa de Conversión
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.dates.map((date, index) => (
                <tr key={date}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.scans[index]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.reviews[index]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.conversionRates[index].toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ConversionAnalysis;