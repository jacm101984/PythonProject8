// src/pages/AdminDashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaUsers, FaCreditCard, FaShoppingBag, FaChartLine, FaSync } from 'react-icons/fa';

interface DashboardStats {
  totalUsers: number;
  totalCards: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: {
    count: number;
    percentage: number;
  };
  pendingOrders: number;
}

const AdminDashboardPage: React.FC = () => {
  const { user, isSuperAdmin, isRegionalAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCards: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: {
      count: 0,
      percentage: 0
    },
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  // Base path para las rutas dependiendo del rol
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

  useEffect(() => {
    // Aquí iría la llamada a la API para obtener las estadísticas
    // Por ahora, usaremos datos de ejemplo
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Simular una llamada a la API
        setTimeout(() => {
          setStats({
            totalUsers: 1250,
            totalCards: 3420,
            totalOrders: 845,
            totalRevenue: 58750,
            activeUsers: {
              count: 980,
              percentage: 78.4
            },
            pendingOrders: 12
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
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <button
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
        >
          <FaSync className="mr-2" /> Actualizar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isSuperAdmin
            ? 'Bienvenido, Super Administrador'
            : isRegionalAdmin
            ? 'Bienvenido, Administrador Regional'
            : 'Bienvenido, Administrador'}
        </h2>
        <p className="text-gray-600">
          Este es su panel de control para gestionar {isSuperAdmin ? 'todos los aspectos del sistema' : 'su región'}.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Usuarios Totales"
            value={stats.totalUsers.toLocaleString()}
            icon={<FaUsers className="h-8 w-8 text-blue-500" />}
            linkTo={`${basePath}/users`}
          />
          <StatCard
            title="Tarjetas Activas"
            value={stats.totalCards.toLocaleString()}
            icon={<FaCreditCard className="h-8 w-8 text-green-500" />}
            linkTo={`${basePath}/cards`}
          />
          <StatCard
            title="Órdenes Totales"
            value={stats.totalOrders.toLocaleString()}
            icon={<FaShoppingBag className="h-8 w-8 text-purple-500" />}
            linkTo={`${basePath}/orders`}
          />
          <StatCard
            title="Ingresos Totales"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<FaChartLine className="h-8 w-8 text-yellow-500" />}
            linkTo={`${basePath}/reports`}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickAction
              title="Gestionar Usuarios"
              description="Ver, editar y administrar usuarios del sistema"
              icon={<FaUsers className="h-6 w-6 text-blue-500" />}
              linkTo={`${basePath}/users`}
            />
            <QuickAction
              title="Revisar Órdenes"
              description={`${stats.pendingOrders} órdenes pendientes de revisión`}
              icon={<FaShoppingBag className="h-6 w-6 text-purple-500" />}
              linkTo={`${basePath}/orders`}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Estadísticas de Uso</h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Usuarios Activos</span>
              <span className="text-sm font-medium text-blue-600">{stats.activeUsers.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${stats.activeUsers.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {stats.activeUsers.count} de {stats.totalUsers} usuarios activos en los últimos 30 días
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  linkTo: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, linkTo }) => {
  return (
    <Link to={linkTo} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
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

export default AdminDashboardPage;