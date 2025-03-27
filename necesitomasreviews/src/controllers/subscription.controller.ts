// src/controllers/subscription.controller.ts

import { Request, Response } from 'express';
import User from '../models/user.model';
import Subscription from '../models/subscription.model';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class SubscriptionController {
  /**
   * Obtiene la suscripción actual del usuario
   */
  public async getCurrentSubscription(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado'
        });
      }

      const user = await User.findById(req.user.id).exec();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      if (!user.subscriptionId) {
        // Si no tiene suscripción, retornamos el plan básico por defecto
        return res.status(200).json({
          success: true,
          data: {
            plan: 'basic',
            status: 'active'
          }
        });
      }

      const subscription = await Subscription.findById(user.subscriptionId).exec();

      if (!subscription) {
        return res.status(200).json({
          success: true,
          data: {
            plan: 'basic',
            status: 'active'
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      console.error('Error al obtener suscripción:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Crea una nueva suscripción premium
   */
  public async createPremiumSubscription(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado'
        });
      }

      const { paymentMethod, paymentId, autoRenew } = req.body;

      if (!paymentMethod || !paymentId) {
        return res.status(400).json({
          success: false,
          error: 'Información de pago incompleta'
        });
      }

      const user = await User.findById(req.user.id).exec();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      // Si ya tiene una suscripción activa, cancelarla primero
      if (user.subscriptionId) {
        const existingSubscription = await Subscription.findById(user.subscriptionId).exec();

        if (existingSubscription && existingSubscription.status === 'active') {
          existingSubscription.status = 'canceled';
          await existingSubscription.save();
        }
      }

      // Calcular fecha de finalización (1 mes después)
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      // Crear nueva suscripción
      const newSubscription = new Subscription({
        userId: user._id,
        plan: 'premium',
        startDate: new Date(),
        endDate: endDate,
        autoRenew: autoRenew || false,
        paymentMethod,
        paymentId,
        status: 'active'
      });

      await newSubscription.save();

      // Actualizar referencia en el usuario
      user.subscriptionId = newSubscription._id;
      await user.save();

      return res.status(201).json({
        success: true,
        data: newSubscription
      });
    } catch (error) {
      console.error('Error al crear suscripción premium:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Cancela una suscripción premium
   */
  public async cancelSubscription(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado'
        });
      }

      const user = await User.findById(req.user.id).exec();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      if (!user.subscriptionId) {
        return res.status(400).json({
          success: false,
          error: 'No tienes una suscripción activa'
        });
      }

      const subscription = await Subscription.findById(user.subscriptionId).exec();

      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'Suscripción no encontrada'
        });
      }

      if (subscription.status !== 'active') {
        return res.status(400).json({
          success: false,
          error: 'La suscripción ya está cancelada o expirada'
        });
      }

      // Cancelar suscripción
      subscription.status = 'canceled';
      subscription.autoRenew = false;
      await subscription.save();

      return res.status(200).json({
        success: true,
        message: 'Suscripción cancelada correctamente',
        data: subscription
      });
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Actualiza la configuración de renovación automática
   */
  public async updateAutoRenew(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado'
        });
      }

      const { autoRenew } = req.body;

      if (autoRenew === undefined) {
        return res.status(400).json({
          success: false,
          error: 'El valor de autoRenew es requerido'
        });
      }

      const user = await User.findById(req.user.id).exec();

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      if (!user.subscriptionId) {
        return res.status(400).json({
          success: false,
          error: 'No tienes una suscripción activa'
        });
      }

      const subscription = await Subscription.findById(user.subscriptionId).exec();

      if (!subscription) {
        return res.status(404).json({
          success: false,
          error: 'Suscripción no encontrada'
        });
      }

      // Actualizar autoRenew
      subscription.autoRenew = autoRenew;
      await subscription.save();

      return res.status(200).json({
        success: true,
        message: `Renovación automática ${autoRenew ? 'activada' : 'desactivada'}`,
        data: subscription
      });
    } catch (error) {
      console.error('Error al actualizar renovación automática:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtiene los planes de suscripción disponibles
   */
  public async getSubscriptionPlans(req: Request, res: Response) {
    try {
      // Definición de planes
      const plans = [
        {
          id: 'basic',
          name: 'Plan Básico',
          price: 0,
          currency: 'USD',
          description: 'Acceso básico para configurar y activar tarjetas NFC',
          features: [
            'Activación de tarjetas NFC',
            'Configuración de perfil de Google',
            'Configuración de mensajes personalizados'
          ],
          limitations: [
            'Sin estadísticas de escaneo',
            'Sin notificaciones en tiempo real',
            'Sin dashboard analítico'
          ]
        },
        {
          id: 'premium',
          name: 'Plan Premium',
          price: 19.99,
          currency: 'USD',
          billingPeriod: 'monthly',
          description: 'Acceso completo a estadísticas y notificaciones en tiempo real',
          features: [
            'Activación de tarjetas NFC',
            'Configuración de perfil de Google',
            'Estadísticas detalladas de escaneo',
            'Notificaciones en tiempo real',
            'Dashboard analítico completo',
            'Exportación de reportes'
          ]
        }
      ];

      return res.status(200).json({
        success: true,
        data: plans
      });
    } catch (error) {
      console.error('Error al obtener planes de suscripción:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

export default new SubscriptionController();