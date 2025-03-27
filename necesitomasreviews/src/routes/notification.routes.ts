// src/routes/notification.routes.ts

import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { checkPremiumSubscription } from '../middleware/checkPremiumSubscription';
import Notification from '../models/notification.model';
import { registerFCMToken, unregisterFCMToken } from '../services/notification.service';

const router = Router();

// Todas las rutas de notificaciones requieren autenticación y suscripción premium
router.use(authenticate, checkPremiumSubscription);

/**
 * Obtiene las notificaciones del usuario
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    // Construir filtro
    const filter: any = { userId: req.user.id };

    if (unreadOnly === 'true') {
      filter.read = false;
    }

    // Obtener notificaciones con paginación
    const notifications = await Notification.find(filter)
      .sort({ timestamp: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .exec();

    // Contar total para paginación
    const total = await Notification.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          total,
          totalPages: Math.ceil(total / limitNum),
          currentPage: pageNum,
          limit: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Marca notificaciones como leídas
 */
router.put('/read', async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un array de IDs de notificaciones'
      });
    }

    // Verificar que las notificaciones pertenecen al usuario
    const count = await Notification.countDocuments({
      _id: { $in: ids },
      userId: req.user.id
    });

    if (count !== ids.length) {
      return res.status(403).json({
        success: false,
        error: 'Algunas notificaciones no pertenecen al usuario'
      });
    }

    // Marcar como leídas
    await Notification.updateMany(
      { _id: { $in: ids } },
      { read: true }
    );

    return res.status(200).json({
      success: true,
      message: `${count} notificación(es) marcada(s) como leída(s)`
    });
  } catch (error) {
    console.error('Error al marcar notificaciones como leídas:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Marca todas las notificaciones como leídas
 */
router.put('/read-all', async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notificación(es) marcada(s) como leída(s)`
    });
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Elimina una notificación
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la notificación pertenece al usuario
    const notification = await Notification.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notificación no encontrada o no pertenece al usuario'
      });
    }

    // Eliminar notificación
    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Notificación eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Registra un token FCM para notificaciones push
 */
router.post('/fcm-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token FCM requerido'
      });
    }

    const result = await registerFCMToken(req.user.id, token);

    return res.status(200).json({
      success: true,
      message: 'Token FCM registrado correctamente'
    });
  } catch (error) {
    console.error('Error al registrar token FCM:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Elimina un token FCM
 */
router.delete('/fcm-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token FCM requerido'
      });
    }

    const result = await unregisterFCMToken(req.user.id, token);

    return res.status(200).json({
      success: true,
      message: 'Token FCM eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar token FCM:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * Actualiza las preferencias de notificación del usuario
 */
router.put('/preferences', async (req, res) => {
  try {
    const { emailNotifications, pushNotifications, dailyReports } = req.body;

    if (emailNotifications === undefined &&
        pushNotifications === undefined &&
        dailyReports === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere al menos una preferencia para actualizar'
      });
    }

    // Construir objeto de actualización
    const updateObj: any = {};

    if (emailNotifications !== undefined) {
      updateObj['preferences.emailNotifications'] = emailNotifications;
    }

    if (pushNotifications !== undefined) {
      updateObj['preferences.pushNotifications'] = pushNotifications;
    }

    if (dailyReports !== undefined) {
      updateObj['preferences.dailyReports'] = dailyReports;
    }

    // Actualizar preferencias
    await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateObj }
    );

    return res.status(200).json({
      success: true,
      message: 'Preferencias de notificación actualizadas correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar preferencias de notificación:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

export default router;