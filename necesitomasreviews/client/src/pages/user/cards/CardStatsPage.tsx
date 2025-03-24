// src/pages/CardStatsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getCardById, getCardStats } from '../../../services/cardService';
import { FaArrowLeft, FaCalendarAlt, FaQrcode } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CardDetails {
  id: string;
  name: string;
  isActive: boolean;
  googleLink: string;
  totalScans: number;
  totalReviews: number;
  lastScan: string | null;
  createdAt: string;
}

interface CardStatistics {
  dailyStats: {
    date: string;
    scans: number;
    reviews: number;
  }[];
  weeklyStats: {
    week: string;
    scans: number;
    reviews: number;
  }[];
  totalScans: number;
  totalReviews: number;
  conversionRate: number;
}

const CardStatsPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<CardDetails | null>(null);
  const [stats, setStats] = useState<CardStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    fetchCardAndStats();
  }, [cardId]);

  const fetchCardAndStats = async () => {
    try {
      setIsLoading(true);
      const [cardData, statsData] = await Promise.all([
        getCardById(cardId!),
        getCardStats(cardId!)
      ]);

      setCard(cardData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('No se pudieron cargar los datos de la tarjeta');
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

  if (!card || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se encontró información de la tarjeta</p>
        <Link to="/dashboard/cards" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a mis tarjetas
        </Link>
      </div>
    );
  }

  // Datos para gráficos
  const chartData = {
    labels: timeRange === 'daily'
      ? stats.dailyStats.map(day => day.date)
      : stats.weeklyStats.map(week => week.week),
    datasets: [
      {
        label: 'Escaneos',
        data: timeRange === 'daily'
          ? stats.dailyStats.map(day => day.scans)
          : stats.weeklyStats.map(week => week.scans),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.1
      },
      {
        label: 'Reseñas',
        data: timeRange === 'daily'
          ? stats.dailyStats.map(day => day.reviews)
          : stats.weeklyStats.map(week => week.reviews),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/dashboard/cards"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Volver a mis tarjetas
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Estadísticas: {card.name}</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de escaneos</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalScans}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de reseñas</p>
            <p className="text-2xl font-bold text-green-600">{stats.totalReviews}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Tasa de conversión</p>
            <p className="text-2xl font-bold text-purple-600">{stats.conversionRate.toFixed(1)}%</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Último escaneo</p>
            <p className="text-lg font-bold text-orange-600">
              {card.lastScan
                ? new Date(card.lastScan).toLocaleDateString()
                : 'Sin escaneos'
              }
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Actividad</h2>

            <div className="flex space-x-2">
              <button
                onClick={() => setTimeRange('daily')}
                className={`px-3 py-1 rounded ${
                  timeRange === 'daily' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Diario
              </button>
              <button
                onClick={() => setTimeRange('weekly')}
                className={`px-3 py-1 rounded ${
                  timeRange === 'weekly' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Semanal
              </button>
            </div>
          </div>

          <div className="h-64">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to={`/dashboard/cards/${card.id}/qr`}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <FaQrcode className="text-blue-600 mr-3 text-xl" />
            <span>Ver código QR</span>
          </Link>

          <Link
            to={`/dashboard/cards/${card.id}/edit`}
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
          >
            <FaCalendarAlt className="text-blue-600 mr-3 text-xl" />
            <span>Editar tarjeta</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardStatsPage;