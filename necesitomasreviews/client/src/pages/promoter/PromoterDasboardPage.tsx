// src/pages/PromoterDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaTicketAlt, FaUsers, FaChartLine, FaDollarSign, FaSync } from 'react-icons/fa';

interface PromoterStats {
  totalCodes: number;
  activeCodes: number;
  totalCommission: number;
  pendingCommission: number;
  totalConversions: number;
  conversionRate: number;
}

const PromoterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<PromoterStats>({
    totalCodes: 0,
    activeCodes: 0,
    totalCommission: 0,
    pendingCommission: 0,
    totalConversions: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener las estadísticas
    // Por ahora, usaremos datos de ejemplo
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simular una llamada a la API
        setTimeout(() => {
          setStats({
            totalCodes: 12,
            activeCodes: 8,
            totalCommission: 1250.75,
            pendingCommission: 350.25,
            totalConversions: 45,
            conversionRate: 12.5
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard de Promotor</h1>
        <button
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          <FaSync className="mr-2" /> Actualizar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Bienvenido, {user?.name || 'Promotor'}</h2>
        <p className="text-gray-600">
          Este es tu panel de control para gestionar tus códigos promocionales y ver tus comisiones.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Códigos Activos"
            value={stats.activeCodes.toString()}
            subtext={`de ${stats.totalCodes} códigos totales`}
            icon={<FaTicketAlt className="h-8 w-8 text-blue-500" />}
            linkTo="/promoter/codes"
          />
          <StatCard
            title="Conversiones Totales"
            value={stats.totalConversions.toString()}
            subtext={`Tasa de conversión: ${stats.conversionRate.toFixed(1)}%`}
            icon={<FaUsers className="h-8 w-8 text-green-500" />}
            linkTo="/promoter/stats"
          />
          <StatCard
            title="Comisiones Totales"
            value={`$${stats.totalCommission.toFixed(2)}`}
            subtext="Ganancias acumuladas"
            icon={<FaDollarSign className="h-8 w-8 text-yellow-500" />}
            linkTo="/promoter/commissions"
          />
          <StatCard
            title="Comisiones Pendientes"
            value={`$${stats.pendingCommission.toFixed(2)}`}
            subtext="Por cobrar"
            icon={<FaChartLine className="h-8 w-8 text-purple-500" />}
            linkTo="/promoter/payments"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 gap-4">
            <QuickAction
              title="Crear Nuevo Código"
              description="Genera un nuevo código promocional para compartir"
              icon={<FaTicketAlt className="h-6 w-6 text-blue-500" />}
              linkTo="/promoter/codes/new"
            />
            <QuickAction
              title="Ver Estadísticas"
              description="Analiza el rendimiento de tus códigos promocionales"
              icon={<FaChartLine className="h-6 w-6 text-green-500" />}
              linkTo="/promoter/stats"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Rendimiento de Códigos</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">PROMO10</span>
                <span className="text-sm font-medium text-blue-600">25 usos</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">DESCUENTO20</span>
                <span className="text-sm font-medium text-blue-600">12 usos</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: '40%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">VERANO2025</span>
                <span className="text-sm font-medium text-blue-600">8 usos</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: '25%' }}
                ></div>
              </div>
            </div>
            <div className="text-center pt-4">
              <Link
                to="/promoter/codes"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Ver todos los códigos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon: React.ReactNode;
  linkTo: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, icon, linkTo }) => {
  return (
    <Link to={linkTo} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
          </div>
          <div>{icon}</div>
        </div>
      </div>
    </Link>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, description, icon, linkTo }) => {
  return (
    <Link to={linkTo} className="block">
      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
        <div className="flex items-center mb-2">
          <div className="mr-3">{icon}</div>
          <h3 className="font-medium">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 ml-9">{description}</p>
      </div>
    </Link>
  );
};

export default PromoterDashboardPage;