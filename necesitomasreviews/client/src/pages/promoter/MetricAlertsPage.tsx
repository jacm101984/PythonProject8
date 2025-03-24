// src/pages/MetricAlertsPage.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaBell, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { analyticsService } from '../../services/analyticsService';

interface Alert {
  id: string;
  metricName: string;
  condition: 'greater' | 'less' | 'equal';
  threshold: number;
  notifyEmail: boolean;
  notifySystem: boolean;
  createdAt: string;
}

const MetricAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    metricName: 'scans', // Default value
    condition: 'greater' as 'greater' | 'less' | 'equal',
    threshold: 0,
    notifyEmail: true,
    notifySystem: true
  });

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.getConfiguredAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Error al cargar las alertas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleEditAlert = (alert: Alert) => {
    setFormData({
      metricName: alert.metricName,
      condition: alert.condition,
      threshold: alert.threshold,
      notifyEmail: alert.notifyEmail,
      notifySystem: alert.notifySystem
    });
    setEditingAlertId(alert.id);
    setShowForm(true);
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta alerta?')) {
      try {
        await analyticsService.deleteAlert(alertId);
        setAlerts(alerts.filter(alert => alert.id !== alertId));
        toast.success('Alerta eliminada con éxito');
      } catch (error) {
        console.error('Error deleting alert:', error);
        toast.error('Error al eliminar la alerta');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingAlertId) {
        // Update existing alert
        // Note: In a real app, you'd have an updateAlert method in the service
        await analyticsService.deleteAlert(editingAlertId);
        await analyticsService.setupMetricAlert(formData);
        toast.success('Alerta actualizada correctamente');
      } else {
        // Create new alert
        await analyticsService.setupMetricAlert(formData);
        toast.success('Alerta creada correctamente');
      }

      // Reset form and fetch updated alerts
      setShowForm(false);
      setEditingAlertId(null);
      setFormData({
        metricName: 'scans',
        condition: 'greater',
        threshold: 0,
        notifyEmail: true,
        notifySystem: true
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error saving alert:', error);
      toast.error('Error al guardar la alerta');
    }
  };

  const getMetricLabel = (metric: string) => {
    const metricMap: Record<string, string> = {
      'scans': 'Escaneos',
      'reviews': 'Reseñas',
      'conversion_rate': 'Tasa de Conversión',
      'active_cards': 'Tarjetas Activas',
      'inactive_cards': 'Tarjetas Inactivas'
    };

    return metricMap[metric] || metric;
  };

  const getConditionLabel = (condition: string) => {
    const conditionMap: Record<string, string> = {
      'greater': 'mayor que',
      'less': 'menor que',
      'equal': 'igual a'
    };

    return conditionMap[condition] || condition;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Alertas de Métricas</h1>
        <button
          onClick={() => {
            setEditingAlertId(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          {showForm ? 'Cancelar' : <><FaPlus className="mr-2" /> Nueva Alerta</>}
        </button>
      </div>

      {/* Formulario para crear/editar alertas */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingAlertId ? 'Editar Alerta' : 'Crear Nueva Alerta'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="metricName" className="block text-sm font-medium text-gray-700 mb-1">
                  Métrica
                </label>
                <select
                  id="metricName"
                  name="metricName"
                  value={formData.metricName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="scans">Escaneos</option>
                  <option value="reviews">Reseñas</option>
                  <option value="conversion_rate">Tasa de Conversión</option>
                  <option value="active_cards">Tarjetas Activas</option>
                  <option value="inactive_cards">Tarjetas Inactivas</option>
                </select>
              </div>

              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                  Condición
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="greater">Mayor que</option>
                  <option value="less">Menor que</option>
                  <option value="equal">Igual a</option>
                </select>
              </div>

              <div>
                <label htmlFor="threshold" className="block text-sm font-medium text-gray-700 mb-1">
                  Valor Umbral
                </label>
                <input
                  type="number"
                  id="threshold"
                  name="threshold"
                  value={formData.threshold}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifyEmail"
                  name="notifyEmail"
                  checked={formData.notifyEmail}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyEmail" className="ml-2 block text-sm text-gray-700">
                  Notificar por Email
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifySystem"
                  name="notifySystem"
                  checked={formData.notifySystem}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="notifySystem" className="ml-2 block text-sm text-gray-700">
                  Notificar en el Sistema
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingAlertId ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de alertas configuradas */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">Alertas Configuradas</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay alertas configuradas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando una alerta para monitorear tus métricas importantes.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {alerts.map((alert) => (
              <li key={alert.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaBell className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {getMetricLabel(alert.metricName)} {getConditionLabel(alert.condition)} {alert.threshold}
                      </h3>
                      <div className="mt-1 text-sm text-gray-500 flex items-center space-x-4">
                        <span>Creada: {new Date(alert.createdAt).toLocaleDateString()}</span>
                        {alert.notifyEmail && (
                          <span className="flex items-center">
                            <svg className="mr-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            Email
                          </span>
                        )}
                        {alert.notifySystem && (
                          <span className="flex items-center">
                            <svg className="mr-1 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            Sistema
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditAlert(alert)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MetricAlertsPage;