// src/services/analyticsService.ts
import { api } from './api';

export const analyticsService = {
  // Obtener datos de tendencias temporales
  getTrendData: async (metric: string, timeframe: string, regionId?: string) => {
    try {
      const params = regionId ? { regionId, timeframe } : { timeframe };
      const response = await api.get(`/analytics/trends/${metric}`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${metric} trend data:`, error);
      throw error;
    }
  },

  // Obtener análisis de conversión
  getConversionAnalysis: async (timeframe: string, regionId?: string) => {
    try {
      const params = regionId ? { regionId, timeframe } : { timeframe };
      const response = await api.get('/analytics/conversion', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversion analysis:', error);
      throw error;
    }
  },

  // Generar reporte personalizado
  generateCustomReport: async (options: {
    metrics: string[];
    startDate: string;
    endDate: string;
    regionId?: string;
    format: 'pdf' | 'excel';
  }) => {
    try {
      const response = await api.post('/analytics/generate-report', options, {
        responseType: 'blob',
      });

      // Crear URL para el archivo descargado
      const url = window.URL.createObjectURL(new Blob([response.data]));
      return url;
    } catch (error) {
      console.error('Error generating custom report:', error);
      throw error;
    }
  },

  // Configurar alertas basadas en métricas
  setupMetricAlert: async (alert: {
    metricName: string;
    condition: 'greater' | 'less' | 'equal';
    threshold: number;
    notifyEmail: boolean;
    notifySystem: boolean;
  }) => {
    try {
      const response = await api.post('/analytics/alerts', alert);
      return response.data;
    } catch (error) {
      console.error('Error setting up metric alert:', error);
      throw error;
    }
  },

  // Obtener alertas configuradas
  getConfiguredAlerts: async () => {
    try {
      const response = await api.get('/analytics/alerts');
      return response.data;
    } catch (error) {
      console.error('Error fetching configured alerts:', error);
      throw error;
    }
  },

  // Eliminar una alerta
  deleteAlert: async (alertId: string) => {
    try {
      await api.delete(`/analytics/alerts/${alertId}`);
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  }
};