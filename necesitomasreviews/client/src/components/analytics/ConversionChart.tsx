// src/components/analytics/ConversionChart.tsx
import React, { useMemo, useCallback } from 'react';
import { Line } from 'react-chartjs-2';

interface ConversionChartProps {
  scans: number[];
  reviews: number[];
  dates: string[];
  onDateRangeChange?: (startDate: string, endDate: string) => void;
}

const ConversionChart: React.FC<ConversionChartProps> = ({
  scans,
  reviews,
  dates,
  onDateRangeChange
}) => {
  // Usamos useMemo para calcular tasas de conversión solo cuando los datos cambian
  const conversionRates = useMemo(() => {
    return scans.map((scan, index) => {
      if (scan === 0) return 0;
      return (reviews[index] / scan) * 100;
    });
  }, [scans, reviews]);

  // Usamos useMemo para configuraciones de gráficos para evitar recálculos
  const chartData = useMemo(() => ({
    labels: dates,
    datasets: [
      {
        label: 'Escaneos',
        data: scans,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.1
      },
      {
        label: 'Reseñas',
        data: reviews,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.1
      },
      {
        label: 'Tasa de Conversión (%)',
        data: conversionRates,
        backgroundColor: 'rgba(245, 158, 11, 0.5)',
        borderColor: 'rgba(245, 158, 11, 1)',
        tension: 0.1,
        yAxisID: 'percentage'
      }
    ]
  }), [dates, scans, reviews, conversionRates]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
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
      percentage: {
        position: 'right' as const,
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Porcentaje (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Fecha'
        }
      }
    }
  }), []);

  // Usamos useCallback para funciones de eventos para evitar recreaciones
  const handleChartClick = useCallback((event: any, elements: any) => {
    if (elements.length > 0 && onDateRangeChange) {
      const index = elements[0].index;
      // Simplemente como ejemplo, enviamos la fecha seleccionada como rango
      onDateRangeChange(dates[index], dates[index]);
    }
  }, [dates, onDateRangeChange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Análisis de Conversión</h3>
      <div className="h-80">
        <Line
          data={chartData}
          options={chartOptions}
          onClick={handleChartClick}
        />
      </div>
    </div>
  );
};

export default React.memo(ConversionChart);