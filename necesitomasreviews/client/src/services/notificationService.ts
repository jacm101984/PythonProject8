// src/services/notificationService.ts
import { io, Socket } from 'socket.io-client';
import { api } from './api';

interface Notification {
  id: string;
  type: 'user' | 'order' | 'card' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Array<(notification: Notification) => void> = [];
  private apiUrl: string = process.env.REACT_APP_API_URL || 'http://localhost:3300';

  constructor() {
    // Inicialización aplazada - conectaremos cuando el usuario inicie sesión
  }

  // Conectar al servidor de WebSockets
  connect(token: string) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(this.apiUrl, {
      auth: {
        token
      }
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servicio de notificaciones');
    });

    this.socket.on('notification', (notification: Notification) => {
      // Notificar a todos los listeners registrados
      this.listeners.forEach(listener => listener(notification));
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servicio de notificaciones');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión al servicio de notificaciones:', error);
    });
  }

  // Desconectar del servidor
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Registrar un listener para nuevas notificaciones
  addNotificationListener(listener: (notification: Notification) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Obtener notificaciones
  async getNotifications(filter: 'all' | 'unread' | string = 'all', page: number = 1, limit: number = 10) {
    try {
      const response = await api.get('/notifications', {
        params: { filter, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Marcar notificación como leída
  async markAsRead(id: string) {
    try {
      const response = await api.post(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Marcar todas las notificaciones como leídas
  async markAllAsRead() {
    try {
      const response = await api.post('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Eliminar una notificación
  async deleteNotification(id: string) {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Obtener configuración de notificaciones
  async getNotificationSettings() {
    try {
      const response = await api.get('/notifications/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }

  // Actualizar configuración de notificaciones
  async updateNotificationSettings(settings: Record<string, boolean>) {
    try {
      const response = await api.patch('/notifications/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }
}

// Exportar una instancia singleton
export const notificationService = new NotificationService();