// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/notificationService';

interface Notification {
  id: string;
  type: 'user' | 'order' | 'card' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Conectar al servicio de WebSockets cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated && token) {
      notificationService.connect(token);

      // Escuchar nuevas notificaciones
      const unsubscribe = notificationService.addNotificationListener(handleNewNotification);

      // Desconectar al desmontar
      return () => {
        unsubscribe();
        notificationService.disconnect();
      };
    }
  }, [isAuthenticated, token]);

  // Cargar notificaciones iniciales
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async (reset = true) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const data = await notificationService.getNotifications('all', currentPage);

      if (reset) {
        setNotifications(data.notifications);
      } else {
        setNotifications(prev => [...prev, ...data.notifications]);
      }

      setUnreadCount(data.unreadCount);
      setHasMore(data.hasMore);

      if (!reset) {
        setPage(currentPage + 1);
      } else {
        setPage(2);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewNotification = (notification: Notification) => {
    // Añadir la nueva notificación al principio de la lista
    setNotifications(prev => [notification, ...prev]);

    // Incrementar contador de no leídas
    setUnreadCount(prev => prev + 1);

    // Mostrar toast de notificación
    toast(
      <div onClick={() => markAsRead(notification.id)}>
        <p className="font-bold">{notification.title}</p>
        <p className="text-sm">{notification.message}</p>
      </div>,
      {
        icon: getNotificationIcon(notification.type),
        duration: 5000,
      }
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'user':
        return '👤';
      case 'order':
        return '🛒';
      case 'card':
        return '💳';
      case 'system':
        return '⚠️';
      default:
        return '📣';
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);

      // Actualizar estado local
      setNotifications(prev => prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));

      // Actualizar contador de no leídas
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      // Actualizar estado local
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));

      // Actualizar contador de no leídas
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);

      // Eliminar de estado local
      const notification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));

      // Actualizar contador si la notificación no estaba leída
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const loadMore = async () => {
    if (!hasMore || isLoading) return;
    await fetchNotifications(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        loadMore,
        hasMore,
        isLoading
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};