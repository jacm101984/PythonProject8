// src/services/notificationService.ts
import { toast } from 'react-hot-toast';

// Tipos de notificaciones
export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

// Definir el modo de desarrollo directamente
// Puedes cambiar esto a false si estás en producción
const isDevelopment = true;

class NotificationService {
  // Método para mostrar una notificación de éxito
  success(message: string, duration = 3000) {
    // Registrar en consola en desarrollo
    if (isDevelopment) {
      console.log('✅ SUCCESS:', message);
    }

    return toast.success(message, { duration });
  }

  // Método para mostrar una notificación de error
  error(message: string, duration = 4000) {
    // Registrar en consola en desarrollo
    if (isDevelopment) {
      console.error('❌ ERROR:', message);
    }

    return toast.error(message, { duration });
  }

  // Método para mostrar una notificación informativa
  info(message: string, duration = 3000) {
    // Registrar en consola en desarrollo
    if (isDevelopment) {
      console.info('ℹ️ INFO:', message);
    }

    return toast(message, { duration });
  }

  // Método para mostrar una notificación de advertencia
  warning(message: string, duration = 3500) {
    // Registrar en consola en desarrollo
    if (isDevelopment) {
      console.warn('⚠️ WARNING:', message);
    }

    return toast(message, {
      duration,
      icon: '⚠️',
    });
  }

  // Método genérico para mostrar cualquier tipo de notificación
  notify(type: NotificationType, message: string, duration?: number) {
    switch (type) {
      case NotificationType.SUCCESS:
        return this.success(message, duration);
      case NotificationType.ERROR:
        return this.error(message, duration);
      case NotificationType.INFO:
        return this.info(message, duration);
      case NotificationType.WARNING:
        return this.warning(message, duration);
      default:
        return this.info(message, duration);
    }
  }
}

// Exportar una instancia única del servicio
export const notificationService = new NotificationService();

// Exportación por defecto para compatibilidad
export default notificationService;