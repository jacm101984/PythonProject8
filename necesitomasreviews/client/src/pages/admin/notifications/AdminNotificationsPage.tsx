// src/pages/AdminNotificationsPage.tsx
import React, { useState, useEffect } from 'react';
import { FaBell, FaCog, FaCheckCircle, FaTimesCircle, FaSyncAlt, FaArchive, FaUserCircle, FaShoppingBag, FaCreditCard, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

interface Notification {
  id: string;
  type: 'user' | 'order' | 'card' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: {
    userId?: string;
    userName?: string;
    orderId?: string;
    orderNumber?: string;
    cardId?: string;
    cardUid?: string;
    [key: string]: any;
  };
}

const AdminNotificationsPage: React.FC = () => {
  const { isSuperAdmin } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'user' | 'order' | 'card' | 'system'>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    userRegistrations: true,
    newOrders: true,
    cardActivations: true,
    systemAlerts: true
  });

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // En producción, esto sería una llamada real a la API
      // const response = await api.get(`/admin/notifications?filter=${filter}`);
      // setNotifications(response.data.data);

      // Por ahora, usamos datos de ejemplo
      setTimeout(() => {
        // Generar notificaciones de ejemplo
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'user',
            title: 'Nuevo usuario registrado',
            message: 'Juan Pérez se ha registrado en la plataforma.',
            read: false,
            createdAt: '2025-03-10T14:30:00Z',
            data: {
              userId: 'user1',
              userName: 'Juan Pérez'
            }
          },
          {
            id: '2',
            type: 'order',
            title: 'Nueva orden recibida',
            message: 'Se ha recibido una nueva orden de 5 tarjetas NFC.',
            read: false,
            createdAt: '2025-03-09T10:15:00Z',
            data: {
              orderId: 'order1',
              orderNumber: 'ORD-001',
              userId: 'user1',
              userName: 'Juan Pérez'
            }
          },
          {
            id: '3',
            type: 'card',
            title: 'Tarjeta activada',
            message: 'Una tarjeta NFC ha sido activada exitosamente.',
            read: true,
            createdAt: '2025-03-08T16:45:00Z',
            data: {
              cardId: 'card1',
              cardUid: 'NFC001',
              userId: 'user2',
              userName: 'María López'
            }
          },
          {
            id: '4',
            type: 'system',
            title: 'Alerta de sistema',
            message: 'Se ha detectado un alto número de intentos de login fallidos.',
            read: true,
            createdAt: '2025-03-07T08:20:00Z'
          },
          {
            id: '5',
            type: 'order',
            title: 'Pago confirmado',
            message: 'El pago de la orden ORD-002 ha sido confirmado.',
            read: false,
            createdAt: '2025-03-06T11:30:00Z',
            data: {
              orderId: 'order2',
              orderNumber: 'ORD-002',
              userId: 'user3',
              userName: 'Carlos Rodríguez'
            }
          }
        ];

        // Filtrar notificaciones según el filtro seleccionado
        let filteredNotifications = mockNotifications;
        if (filter === 'unread') {
          filteredNotifications = mockNotifications.filter(n => !n.read);
        } else if (filter !== 'all') {
          filteredNotifications = mockNotifications.filter(n => n.type === filter);
        }

        setNotifications(filteredNotifications);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
      toast.error('No se pudieron cargar las notificaciones');
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // En producción, esto sería una llamada real a la API
      // await api.post(`/admin/notifications/${id}/read`);

      // Por ahora, actualizamos el estado local
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      toast.success('Notificación marcada como leída');
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      toast.error('No se pudo actualizar la notificación');
    }
  };

  const markAllAsRead = async () => {
    try {
      // En producción, esto sería una llamada real a la API
      // await api.post('/admin/notifications/read-all');

      // Por ahora, actualizamos el estado local
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );

      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      toast.error('No se pudieron actualizar las notificaciones');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // En producción, esto sería una llamada real a la API
      // await api.delete(`/admin/notifications/${id}`);

      // Por ahora, actualizamos el estado local
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== id)
      );

      toast.success('Notificación eliminada');
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      toast.error('No se pudo eliminar la notificación');
    }
  };

  const archiveAll = async () => {
    try {
      // En producción, esto sería una llamada real a la API
      // await api.post('/admin/notifications/archive-all');

      // Por ahora, actualizamos el estado local
      setNotifications([]);

      toast.success('Todas las notificaciones han sido archivadas');
    } catch (error) {
      console.error('Error al archivar notificaciones:', error);
      toast.error('No se pudieron archivar las notificaciones');
    }
  };

  const saveSettings = () => {
    // En producción, esto sería una llamada real a la API
    // api.post('/admin/notification-settings', notificationSettings);

    toast.success('Configuración de notificaciones guardada');
    setSettingsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <FaUserCircle className="text-blue-500" />;
      case 'order':
        return <FaShoppingBag className="text-green-500" />;
      case 'card':
        return <FaCreditCard className="text-purple-500" />;
      case 'system':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaBell className="mr-2" /> Centro de Notificaciones
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            <FaCog className="mr-2" /> Configuración
          </button>
          {isSuperAdmin && (
            <button
              onClick={archiveAll}
              className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              <FaArchive className="mr-2" /> Archivar Todo
            </button>
          )}
          <button
            onClick={markAllAsRead}
            className="flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <FaCheckCircle className="mr-2" /> Marcar Todo como Leído
          </button>
          <button
            onClick={fetchNotifications}
            className="flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            <FaSyncAlt className="mr-2" /> Actualizar
          </button>
        </div>
      </div>

      {/* Configuración de notificaciones */}
      {settingsOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuración de Notificaciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => setNotificationSettings({
                    ...notificationSettings,
                    emailNotifications: !notificationSettings.emailNotifications
                  })}
                  className="h-5 w-5 rounded"
                />
                <span>Recibir notificaciones por email</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.userRegistrations}
                  onChange={() => setNotificationSettings({
                    ...notificationSettings,
                    userRegistrations: !notificationSettings.userRegistrations
                  })}
                  className="h-5 w-5 rounded"
                />
                <span>Nuevos registros de usuarios</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.newOrders}
                  onChange={() => setNotificationSettings({
                    ...notificationSettings,
                    newOrders: !notificationSettings.newOrders
                  })}
                  className="h-5 w-5 rounded"
                />
                <span>Nuevas órdenes</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.cardActivations}
                  onChange={() => setNotificationSettings({
                    ...notificationSettings,
                    cardActivations: !notificationSettings.cardActivations
                  })}
                  className="h-5 w-5 rounded"
                />
                <span>Activaciones de tarjetas</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.systemAlerts}
                  onChange={() => setNotificationSettings({
                    ...notificationSettings,
                    systemAlerts: !notificationSettings.systemAlerts
                  })}
                  className="h-5 w-5 rounded"
                />
                <span>Alertas del sistema</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setSettingsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={saveSettings}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            No leídas
          </button>
          <button
            onClick={() => setFilter('user')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center ${
              filter === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FaUserCircle className="mr-2" /> Usuarios
          </button>
          <button
            onClick={() => setFilter('order')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center ${
              filter === 'order' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FaShoppingBag className="mr-2" /> Órdenes
          </button>
          <button
            onClick={() => setFilter('card')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center ${
              filter === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FaCreditCard className="mr-2" /> Tarjetas
          </button>
          <button
            onClick={() => setFilter('system')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center ${
              filter === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FaExclamationTriangle className="mr-2" /> Sistema
          </button>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaBell className="mx-auto text-4xl mb-3" />
            <p>No hay notificaciones disponibles</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-500">{formatDate(notification.createdAt)}</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                    {/* Información adicional basada en el tipo */}
                    {notification.data && (
                      <div className="mt-2 text-xs text-gray-500">
                        {notification.type === 'user' && notification.data.userName && (
                          <p>Usuario: {notification.data.userName}</p>
                        )}
                        {notification.type === 'order' && notification.data.orderNumber && (
                          <p>Orden: {notification.data.orderNumber}</p>
                        )}
                        {notification.type === 'card' && notification.data.cardUid && (
                          <p>Tarjeta: {notification.data.cardUid}</p>
                        )}
                      </div>
                    )}

                    <div className="mt-2 flex">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-500 hover:text-blue-700 text-xs flex items-center mr-3"
                        >
                          <FaCheckCircle className="mr-1" /> Marcar como leída
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-700 text-xs flex items-center"
                      >
                        <FaTimesCircle className="mr-1" /> Eliminar
                      </button>
                    </div>
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

export default AdminNotificationsPage;