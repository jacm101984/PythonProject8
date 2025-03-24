// src/pages/RegionalReportsPage.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FaDownload,
  FaCalendarAlt,
  FaChartLine,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import RegionalFilter from '../../../components/RegionalFilter';
import { adminService } from '../../../services/adminService';
interface RegionalStats {
  totalUsers: number;
  totalPromoters: number;
  totalCards: number;
  totalScans: number;
  totalReviews: number;
  conversionRate: number;
  cardDistribution: {
    active: number;
    inactive: number;
  };
  reviewsByMonth: {
    month: string;
    count: number;
  }[];
  scansByMonth: {
    month: string;
    count: number;
  }[];
}

const RegionalReportsPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [reportData, setReportData] = useState<RegionalStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedRegion) {
      fetchReportData();
    }
  }, [selectedRegion, timeframe]);

  const fetchReportData = async () => {
    if (!selectedRegion) return;

    setIsLoading(true);
    try {
      const data = await adminService.getRegionalStats(selectedRegion, timeframe);
      setReportData(data);
    } catch (error) {
      console.error('Error fetching regional stats:', error);
      toast.error('Error al cargar los datos del reporte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChange = (regionId: string | null) => {
    setSelectedRegion(regionId);
  };

  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeframe(e.target.value as 'week' | 'month' | 'quarter' | 'year');
  };

  const handleExportPDF = () => {
    if (!selectedRegion || !reportData) return;

    toast.promise(
      adminService.exportRegionalReport(selectedRegion, timeframe, 'pdf'),
      {
        loading: 'Generando PDF...',
        success: (url) => {
          // Abrir el PDF en una nueva ventana o descargar
          window.open(url, '_blank');
          return 'Reporte PDF generado correctamente';
        },
        error: 'Error al generar el reporte PDF',
      }
    );
  };

  const handleExportExcel = () => {
    if (!selectedRegion || !reportData) return;

    toast.promise(
      adminService.exportRegionalReport(selectedRegion, timeframe, 'excel'),
      {
        loading: 'Generando Excel...',
        success: (url) => {
          // Forzar descarga del archivo
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'reporte_regional.xlsx');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return 'Reporte Excel generado correctamente';
        },
        error: 'Error al generar el reporte Excel',
      }
    );
  };

  // Preparar datos para gráficos si hay datos disponibles
  const cardDistributionData = reportData ? {
    labels: ['Tarjetas Activas', 'Tarjetas Inactivas'],
    datasets: [
      {
        data: [reportData.cardDistribution.active, reportData.cardDistribution.inactive],
        backgroundColor: ['#10B981', '#6B7280'],
        hoverBackgroundColor: ['#059669', '#4B5563'],
      },
    ],
  } : null;

  const activityTrendsData = reportData ? {
    labels: reportData.scansByMonth.map(item => item.month),
    datasets: [
      {
        label: 'Escaneos',
        data: reportData.scansByMonth.map(item => item.count),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Reseñas',
        data: reportData.reviewsByMonth.map(item => item.count),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reportes Regionales</h1>

        <div className="flex space-x-4">
          <button
            onClick={handleExportPDF}
            disabled={!reportData}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaDownload className="mr-2" /> Exportar PDF
          </button>
          <button
            onClick={handleExportExcel}
            disabled={!reportData}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaDownload className="mr-2" /> Exportar Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex items-center mb-1">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Seleccionar Región
              </label>
            </div>
            <RegionalFilter
              onRegionChange={handleRegionChange}
              allowAll={false}
            />
          </div>
          <div>
            <div className="flex items-center mb-1">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700">
                Periodo de Tiempo
              </label>
            </div>
            <select
              id="timeframe"
              value={timeframe}
              onChange={handleTimeframeChange}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="week">Última Semana</option>
              <option value="month">Último Mes</option>
              <option value="quarter">Último Trimestre</option>
              <option value="year">Último Año</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reportData ? (
          <div>
            {/* Métricas resumidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Usuarios</p>
                <p className="text-2xl font-bold">{reportData.totalUsers}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Promotores</p>
                <p className="text-2xl font-bold">{reportData.totalPromoters}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Tarjetas</p>
                <p className="text-2xl font-bold">{reportData.totalCards}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Tasa de Conversión</p>
                <p className="text-2xl font-bold">{reportData.conversionRate.toFixed(1)}%</p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-blue-500" /> Distribución de Tarjetas
                </h3>
                <div className="h-80">
                  {cardDistributionData && <Pie data={cardDistributionData} />}
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FaChartLine className="mr-2 text-blue-500" /> Tendencias de Actividad
                </h3>
                <div className="h-80">
                  {activityTrendsData && <Bar data={activityTrendsData} />}
                </div>
              </div>
            </div>

            {/* Detalles adicionales */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Resumen de Actividad</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Periodo
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
                    {reportData.scansByMonth.map((item, index) => {
                      const reviewItem = reportData.reviewsByMonth[index];
                      const conversionRate = item.count > 0
                        ? (reviewItem.count / item.count) * 100
                        : 0;

                      return (
                        <tr key={item.month}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.month}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {reviewItem.count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {conversionRate.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : selectedRegion ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando datos de la región...</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay informe disponible</h3>
            <p className="mt-1 text-sm text-gray-500">
              Selecciona una región para visualizar el reporte correspondiente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionalReportsPage;