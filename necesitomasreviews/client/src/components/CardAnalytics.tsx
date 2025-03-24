// src/components/CardAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { cardService } from '../services/cardService';

interface CardAnalyticsProps {
  cardId: string;
  timeframe: 'day' | 'week' | 'month' | 'year';
}

interface AnalyticsData {
  labels: string[];
  scans: number[];
  reviews: number[];
  conversionRate: number[];
}

const CardAnalytics: React.FC<CardAnalyticsProps> = ({ cardId, timeframe }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await cardService.getCardAnalytics(cardId, timeframe);
        setAnalyticsData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching card analytics:', error);
        setError('No se pudieron cargar las estadísticas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [cardId, timeframe]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
        {error || 'No hay datos disponibles'}
      </div>
    );
  }

  // Datos para el gráfico de escaneos y reseñas
  const scanReviewChartData = {
    labels: analyticsData.labels,
    datasets: [
      {
        label: 'Escaneos',
        data: analyticsData.scans,
        fill: false,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.1
      },
      {
        label: 'Reseñas',
        data: analyticsData.reviews,
        fill: false,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.1
      }
    ]
  };

  // Datos para el gráfico de tasa de conversión
  const conversionRateChartData = {
    labels: analyticsData.labels,
    datasets: [
      {
        label: 'Tasa de Conversión (%)',
        data: analyticsData.conversionRate,
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Escaneos y Reseñas</h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Line
            data={scanReviewChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: false,
                }
              }
            }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Tasa de Conversión (Escaneos → Reseñas)</h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Bar
            data={conversionRateChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: false,
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: {
                    display: true,
                    text: 'Porcentaje (%)'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CardAnalytics;