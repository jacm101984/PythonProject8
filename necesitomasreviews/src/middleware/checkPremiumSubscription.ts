// src/middleware/checkPremiumSubscription.ts

import { Request, Response, NextFunction } from 'express';
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

/**
 * Middleware para verificar si un usuario tiene una suscripción premium activa
 */
export const checkPremiumSubscription = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado'
      });
    }

    const userId = req.user.id;

    // Administradores siempre tienen acceso a funciones premium
    if (['REGIONAL_ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return next();
    }

    // Buscar usuario con su suscripción
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    if (!user.subscriptionId) {
      return res.status(403).json({
        success: false,
        error: 'Requiere suscripción premium',
        code: 'SUBSCRIPTION_REQUIRED'
      });
    }

    // Verificar la suscripción
    const subscription = await Subscription.findOne({
      _id: user.subscriptionId,
      status: 'active',
      plan: 'premium'
    }).exec();

    if (!subscription) {
      return res.status(403).json({
        success: false,
        error: 'Requiere suscripción premium activa',
        code: 'PREMIUM_REQUIRED'
      });
    }

    // Si tiene endDate, verificar que no haya expirado
    if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
      // Actualizar estado de la suscripción
      await Subscription.findByIdAndUpdate(
        subscription._id,
        { status: 'expired' }
      );

      return res.status(403).json({
        success: false,
        error: 'Tu suscripción premium ha expirado',
        code: 'SUBSCRIPTION_EXPIRED'
      });
    }

    // Si todo está bien, continuar
    next();
  } catch (error) {
    console.error('Error al verificar suscripción premium:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};