// src/services/dashboardService.ts
import api from './api';

interface DashboardStats {
  totalCards: number;
  activeCards: number;
  totalScans: number;
  totalReviews: number;
  promoterStats?: {
    totalCommissions: number;
    totalPromoCodes: number;
    totalConversions: number;
  };
}

interface ActivityItem {
  id: string;
  type: 'scan' | 'review' | 'order' | 'activation';
  message: string;
  cardId?: string;
  timestamp: string;
  data?: any;
}

/**
 * Obtiene las estadísticas del dashboard
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    throw error;
  }
};

/**
 * Obtiene la actividad reciente del usuario
 * @param limit Número máximo de actividades a obtener
 */
export const getRecentActivity = async (limit: number = 5): Promise<ActivityItem[]> => {
  try {
    const response = await api.get(`/dashboard/activity?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener actividad reciente:', error);
    throw error;
  }
};

/**
 * Obtiene las estadísticas del promotor (solo para usuarios con rol PROMOTER)
 */
export const getPromoterStats = async () => {
  try {
    const response = await api.get('/dashboard/promoter-stats');
    return response.data.data;
  } catch (error) {
    console.error('Error al obtener estadísticas de promotor:', error);
    throw error;
  }
};

export default {
  getDashboardStats,
  getRecentActivity,
  getPromoterStats
};