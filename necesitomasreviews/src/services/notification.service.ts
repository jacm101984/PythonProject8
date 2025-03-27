// src/services/notification.service.ts

import { Server as SocketServer } from 'socket.io';
import User from '../models/user.model';
import Notification from '../models/notification.model';
import admin from 'firebase-admin';
import nodemailer from 'nodemailer';

// Almacenamiento de conexiones de socket activas
const activeConnections: Map<string, string[]> = new Map();

// Referencia al servidor socket.io (se inicializa en server.ts)
let io: SocketServer;

/**
 * Inicializa el servicio de notificaciones con la instancia de socket.io
 */
export const initNotificationService = (socketServer: SocketServer) => {
  io = socketServer;

  // Configurar eventos de socket.io
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Autenticar usuario y asociar socket con userId
    socket.on('authenticate', async (token: string) => {
      try {
        // Aquí verificarías el JWT o token de sesión
        // Por simplicidad, asumimos que el token es el userId
        const userId = token; // En producción: validateToken(token);

        if (!userId) {
          socket.emit('error', { message: 'Autenticación inválida' });
          return;
        }

        // Guardar asociación socket.id -> userId
        if (!activeConnections.has(userId)) {
          activeConnections.set(userId, []);
        }

        activeConnections.get(userId)!.push(socket.id);

        // Unirse a la sala del usuario para poder enviar mensajes específicos
        socket.join(userId);

        console.log(`Usuario ${userId} autenticado, socket: ${socket.id}`);
        socket.emit('authenticated', { success: true });

        // Enviar notificaciones no leídas al conectarse
        const unreadNotifications = await Notification.find({
          userId,
          read: false
        })
        .sort({ timestamp: -1 })
        .limit(20)
        .exec();

        if (unreadNotifications.length > 0) {
          socket.emit('unread_notifications', unreadNotifications);
        }
      } catch (error) {
        console.error('Error durante autenticación de socket:', error);
        socket.emit('error', { message: 'Error de autenticación' });
      }
    });

    // Marcar notificaciones como leídas
    socket.on('mark_read', async (data: { notificationIds: string[] }) => {
      try {
        const { notificationIds } = data;

        if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
          socket.emit('error', { message: 'IDs de notificación inválidos' });
          return;
        }

        await Notification.updateMany(
          { _id: { $in: notificationIds } },
          { read: true }
        );

        socket.emit('notifications_marked_read', { success: true, notificationIds });
      } catch (error) {
        console.error('Error al marcar notificaciones como leídas:', error);
        socket.emit('error', { message: 'Error al actualizar notificaciones' });
      }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);

      // Eliminar socket.id de activeConnections
      for (const [userId, socketIds] of activeConnections.entries()) {
        const index = socketIds.indexOf(socket.id);
        if (index !== -1) {
          socketIds.splice(index, 1);
          console.log(`Socket ${socket.id} eliminado para usuario ${userId}`);

          // Si no quedan sockets para este usuario, eliminar la entrada
          if (socketIds.length === 0) {
            activeConnections.delete(userId);
            console.log(`Usuario ${userId} ya no tiene conexiones activas`);
          }
          break;
        }
      }
    });
  });

  console.log('Servicio de notificaciones inicializado');
};

/**
 * Envía una notificación a un usuario específico
 */
export const sendNotification = async (userId: string, notification: any) => {
  try {
    // 1. Enviar notificación por socket.io si el usuario está conectado
    if (io) {
      io.to(userId).emit('notification', notification);
    }

    // 2. Enviar notificación push si el usuario tiene tokens FCM registrados
    const user = await User.findById(userId).exec();

    if (!user) {
      console.error(`Usuario ${userId} no encontrado para enviar notificación`);
      return;
    }

    // Enviar notificación push si hay tokens FCM y las preferencias lo permiten
    if (user.fcmTokens && user.fcmTokens.length > 0 && user.preferences.pushNotifications) {
      await sendPushNotification(
        user.fcmTokens,
        notification.title,
        notification.message,
        notification.data
      );
    }

    // 3. Enviar correo electrónico si el usuario lo prefiere
    if (user.preferences.emailNotifications) {
      await sendEmailNotification(
        user.email,
        notification.title,
        notification.message,
        notification.data
      );
    }
  } catch (error) {
    console.error(`Error al enviar notificación a usuario ${userId}:`, error);
  }
};

/**
 * Envía una notificación push usando Firebase Cloud Messaging
 */
export const sendPushNotification = async (
  tokens: string[],
  title: string,
  body: string,
  data?: any
) => {
  try {
    // Verificar que Firebase Admin esté inicializado
    if (!admin.apps.length) {
      console.error('Firebase Admin no está inicializado');
      return;
    }

    const message = {
      notification: {
        title,
        body
      },
      data: data ? {
        ...data,
        // Convertir objetos a JSON strings
        ...(typeof data.timestamp === 'object' && { timestamp: data.timestamp.toISOString() })
      } : undefined,
      tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`Notificaciones push enviadas: ${response.successCount} exitosas, ${response.failureCount} fallidas`);

    // Manejar tokens inválidos
    if (response.failureCount > 0) {
      const failedTokens: string[] = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });

      console.log('Tokens para eliminar:', failedTokens);

      // Remover tokens inválidos de los usuarios
      await User.updateMany(
        { fcmTokens: { $in: failedTokens } },
        { $pullAll: { fcmTokens: failedTokens } }
      );
    }
  } catch (error) {
    console.error('Error al enviar notificación push:', error);
  }
};

/**
 * Envía una notificación por correo electrónico
 */
export const sendEmailNotification = async (
  email: string,
  subject: string,
  message: string,
  data?: any
) => {
  try {
    // Configuración de nodemailer
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'Outlook',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Personalizar el mensaje según el tipo de notificación
    let htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a90e2;">${subject}</h2>
        <p>${message}</p>
    `;

    if (data) {
      // Añadir detalles específicos según el tipo de evento
      if (data.eventType === 'review_completed') {
        htmlTemplate += `
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p><strong>Negocio:</strong> ${data.businessName || 'N/A'}</p>
            <p><strong>Calificación:</strong> ${data.reviewRating ? `${data.reviewRating} estrellas` : 'N/A'}</p>
            <p><strong>Fecha:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
          </div>
        `;
      } else if (data.eventType === 'scan') {
        htmlTemplate += `
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p><strong>Negocio:</strong> ${data.businessName || 'N/A'}</p>
            <p><strong>Fecha:</strong> ${new Date(data.timestamp).toLocaleString()}</p>
          </div>
        `;
      }
    }

    htmlTemplate += `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
          <p>Este es un mensaje automático de NecesitoMasReviews. No responda a este correo.</p>
          <p>Puede cambiar sus preferencias de notificación en su <a href="${process.env.FRONTEND_URL}/account/notifications" style="color: #4a90e2;">panel de usuario</a>.</p>
        </div>
      </div>
    `;

    // Enviar el correo
    const mailOptions = {
      from: `NecesitoMasReviews <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: htmlTemplate
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
  } catch (error) {
    console.error('Error al enviar correo electrónico:', error);
  }
};

/**
 * Registra un nuevo token FCM para notificaciones push
 */
export const registerFCMToken = async (userId: string, token: string) => {
  try {
    // Verificar que el usuario existe
    const user = await User.findById(userId).exec();

    if (!user) {
      throw new Error(`Usuario ${userId} no encontrado`);
    }

    // Verificar si el token ya está registrado
    if (user.fcmTokens.includes(token)) {
      return { success: true, message: 'Token ya registrado' };
    }

    // Añadir token al array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { fcmTokens: token } }
    );

    return { success: true, message: 'Token registrado correctamente' };
  } catch (error) {
    console.error(`Error al registrar token FCM para usuario ${userId}:`, error);
    throw error;
  }
};

/**
 * Elimina un token FCM
 */
export const unregisterFCMToken = async (userId: string, token: string) => {
  try {
    await User.findByIdAndUpdate(
      userId,
      { $pull: { fcmTokens: token } }
    );

    return { success: true, message: 'Token eliminado correctamente' };
  } catch (error) {
    console.error(`Error al eliminar token FCM para usuario ${userId}:`, error);
    throw error;
  }
};

export default {
  initNotificationService,
  sendNotification,
  sendPushNotification,
  sendEmailNotification,
  registerFCMToken,
  unregisterFCMToken
};