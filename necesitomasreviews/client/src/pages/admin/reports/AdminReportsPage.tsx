// src/pages/AdminReportsPage.tsx
import React, { useState, useEffect } from 'react';
import { FaChartLine, FaUserAlt, FaCreditCard, FaShoppingBag, FaCalendarAlt, FaFileDownload, FaSync } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

// Interfaz para las estadísticas globales
interface GlobalStats {
  totalUsers: number;
  totalCards: number;
  totalOrders: number;
  totalRevenue: number;
  registrationsThisMonth: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  activeCardsPercentage: number;
}

// Interfaz para los datos del gráfico por mes
interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
  newUsers: number;
  scans: number;
}

// Interfaz para los datos por región
interface RegionData {
  id: string;
  name: string;
  totalUsers: number;
  totalCards: number;
  totalOrders: number;
  totalRevenue: number;
  activePercentage: number;
}

const AdminReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [timeFrame, setTimeFrame] = useState<'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalUsers: 0,
    totalCards: 0,
    totalOrders: 0,
    totalRevenue: 0,
    registrationsThisMonth: 0,
    revenueThisMonth: 0,
    ordersThisMonth: 0,
    activeCardsPercentage: 0
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);

  useEffect(() => {
    fetchReportData();
  }, [timeFrame]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // En producción, estas serían llamadas reales a la API
      // const statsResponse = await api.get('/admin/reports/global-stats');
      // const monthlyResponse = await api.get(`/admin/reports/monthly-data?timeFrame=${timeFrame}`);
      // const regionsResponse = await api.get('/admin/reports/region-data');

      // setGlobalStats(statsResponse.data.data);
      // setMonthlyData(monthlyResponse.data.data);
      // setRegionData(regionsResponse.data.data);

      // Por ahora, usamos datos de ejemplo
      setTimeout(() => {
        // Estadísticas globales simuladas
        setGlobalStats({
          totalUsers: 1250,
          totalCards: 3420,
          totalOrders: 845,
          totalRevenue: 58750,
          registrationsThisMonth: 128,
          revenueThisMonth: 7890,
          ordersThisMonth: 98,
          activeCardsPercentage: 78.4
        });

        // Datos mensuales simulados
        const monthsData: MonthlyData[] = [];
        const now = new Date();
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

        let numPoints = 6;
        if (timeFrame === 'quarter') numPoints = 3;
        if (timeFrame === 'year') numPoints = 12;

        for (let i = numPoints - 1; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          monthsData.push({
            month: monthNames[month.getMonth()] + ' ' + month.getFullYear(),
            revenue: 5000 + Math.floor(Math.random() * 5000),
            orders: 50 + Math.floor(Math.random() * 50),
            newUsers: 20 + Math.floor(Math.random() * 40),
            scans: 300 + Math.floor(Math.random() * 400)
          });
        }

        setMonthlyData(monthsData);

        // Datos por región simulados
        setRegionData([
          {
            id: '1',
            name: 'Norte',
            totalUsers: 450,
            totalCards: 1200,
            totalOrders: 320,
            totalRevenue: 20750,
            activePercentage: 82.5
          },
          {
            id: '2',
            name: 'Sur',
            totalUsers: 320,
            totalCards: 950,
            totalOrders: 210,
            totalRevenue: 15300,
            activePercentage: 75.8
          },
          {
            id: '3',
            name: 'Este',
            totalUsers: 280,
            totalCards: 720,
            totalOrders: 180,
            totalRevenue: 12800,
            activePercentage: 79.2
          },
          {
            id: '4',
            name: 'Oeste',
            totalUsers: 200,
            totalCards: 550,
            totalOrders: 135,
            totalRevenue: 9900,
            activePercentage: 71.6
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar datos de reportes:', error);
      toast.error('No se pudieron cargar los datos de reportes');
      setLoading(false);
    }
  };

  const generateReport = async (reportType: string) => {
    try {
      // En producción, esto sería una llamada real a la API
      // const response = await api.get(`/admin/reports/generate/${reportType}?timeFrame=${timeFrame}`, { responseType: 'blob' });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
      // document.body.appendChild(link);
      // link.click();

      // Por ahora, simplemente mostramos un mensaje de éxito
      toast.success(`Reporte de ${reportType} generado y descargado`);
    } catch (error) {
      console.error(`Error al generar reporte de ${reportType}:`, error);
      toast.error(`No se pudo generar el reporte de ${reportType}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Reportes y Estadísticas</h1>
        <div className="flex items-center">
          <select
            className="mr-2 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as any)}
          >
            <option value="month">Últimos 6 meses</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
          <button
            onClick={fetchReportData}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
          >
            <FaSync className="mr-2" /> Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Usuarios Totales"
          value={globalStats.totalUsers.toLocaleString()}
          trend={`+${globalStats.registrationsThisMonth} este mes`}
          icon={<FaUserAlt className="h-8 w-8 text-blue-500" />}
          loading={loading}
        />
        <StatCard
          title="Tarjetas NFC"
          value={globalStats.totalCards.toLocaleString()}
          trend={`${globalStats.activeCardsPercentage}% activas`}
          icon={<FaCreditCard className="h-8 w-8 text-green-500" />}
          loading={loading}
        />
        <StatCard
          title="Órdenes Totales"
          value={globalStats.totalOrders.toLocaleString()}
          trend={`+${globalStats.ordersThisMonth} este mes`}
          icon={<FaShoppingBag className="h-8 w-8 text-purple-500" />}
          loading={loading}
        />
        <StatCard
          title="Ingresos Totales"
          value={`$${globalStats.totalRevenue.toLocaleString()}`}
          trend={`+$${globalStats.revenueThisMonth.toLocaleString()} este mes`}
          icon={<FaChartLine className="h-8 w-8 text-yellow-500" />}
          loading={loading}
        />
      </div>

      {/* Gráficos y tendencias */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de ingresos y órdenes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Evolución de Ingresos y Órdenes</h2>
            <button
              onClick={() => generateReport('revenue')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaFileDownload className="mr-1" /> Exportar
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="h-64">
              {/* Aquí iría un componente de gráfico real. Por ahora, mostramos una representación simple */}
              <div className="h-full flex items-end space-x-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-between">
                      <div
                        className="bg-blue-500 rounded-t-sm w-5/12"
                        style={{ height: `${(data.revenue / 10000) * 200}px` }}
                        title={`$${data.revenue}`}
                      ></div>
                      <div
                        className="bg-purple-500 rounded-t-sm w-5/12"
                        style={{ height: `${data.orders * 2}px` }}
                        title={`${data.orders} órdenes`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">Ingresos</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">Órdenes</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gráfico de usuarios y escaneos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Nuevos Usuarios y Escaneos</h2>
            <button
              onClick={() => generateReport('users')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FaFileDownload className="mr-1" /> Exportar
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="h-64">
              {/* Aquí iría un componente de gráfico real. Por ahora, mostramos una representación simple */}
              <div className="h-full flex items-end space-x-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex justify-between">
                      <div
                        className="bg-green-500 rounded-t-sm w-5/12"
                        style={{ height: `${data.newUsers * 3}px` }}
                        title={`${data.newUsers} nuevos usuarios`}
                      ></div>
                      <div
                        className="bg-yellow-500 rounded-t-sm w-5/12"
                        style={{ height: `${(data.scans / 700) * 200}px` }}
                        title={`${data.scans} escaneos`}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{data.month}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-4">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">Nuevos Usuarios</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-sm mr-1"></div>
                  <span className="text-xs text-gray-600">Escaneos</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas por región */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Estadísticas por Región</h2>
          <button
            onClick={() => generateReport('regions')}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FaFileDownload className="mr-1" /> Exportar
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Región
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuarios
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarjetas
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Órdenes
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingresos
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Activas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {regionData.map((region) => (
                  <tr key={region.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {region.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {region.totalUsers.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {region.totalCards.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {region.totalOrders.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      ${region.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-sm text-gray-900 mr-2">{region.activePercentage}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${region.activePercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    {globalStats.totalUsers.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    {globalStats.totalCards.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    {globalStats.totalOrders.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    ${globalStats.totalRevenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                    {globalStats.activeCardsPercentage}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Acciones de reportes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reportes Personalizados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReportCard
            title="Reporte Completo"
            description="Genera un informe detallado con todas las métricas del sistema"
            icon={<FaFileDownload className="h-6 w-6 text-blue-500" />}
            onClick={() => generateReport('complete')}
          />
          <ReportCard
            title="Reporte Financiero"
            description="Enfocado en ingresos, órdenes y transacciones financieras"
            icon={<FaChartLine className="h-6 w-6 text-green-500" />}
            onClick={() => generateReport('financial')}
          />
          <ReportCard
            title="Reporte de Usuarios"
            description="Análisis detallado de usuarios, tarjetas y tasas de conversión"
            icon={<FaUserAlt className="h-6 w-6 text-purple-500" />}
            onClick={() => generateReport('users')}
          />
        </div>
        <div className="mt-4 text-sm text-gray-500">
          <p>
            <FaCalendarAlt className="inline mr-1" /> Reportes basados en datos del período: <strong>{
              timeFrame === 'month' ? 'Últimos 6 meses' :
              timeFrame === 'quarter' ? 'Último trimestre' :
              'Último año'
            }</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  loading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, loading }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {loading ? (
        <div className="flex justify-center items-center h-24">
          <div className="animate-pulse flex space-x-4 w-full">
            <div className="rounded-full bg-gray-200 h-10 w-10"></div>
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-green-600 mt-1">{trend}</p>
          </div>
          <div>{icon}</div>
        </div>
      )}
    </div>
  );
};

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex items-center mb-2">
        <div className="mr-3">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 ml-9">{description}</p>
    </div>
  );
};

export default AdminReportsPage;