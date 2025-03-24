// src/controllers/dashboardController.ts
import { Request, Response } from 'express';
import Card from '../models/Card';
import User from '../models/User';
import Order from '../models/Order';
import Scan from '../models/Scan';
import Review from '../models/Review';
import { Types } from 'mongoose';

/**
 * Obtiene estadísticas generales para el dashboard del usuario
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Contar tarjetas totales del usuario
    const totalCards = await Card.countDocuments({ userId });

    // Contar tarjetas activas
    const activeCards = await Card.countDocuments({
      userId,
      isActive: true
    });

    // Contar escaneos totales
    const scans = await Scan.find({
      cardId: {
        $in: await Card.find({ userId }).distinct('_id')
      }
    });
    const totalScans = scans.length;

    // Contar reseñas obtenidas
    const reviews = await Review.find({
      cardId: {
        $in: await Card.find({ userId }).distinct('_id')
      }
    });
    const totalReviews = reviews.length;

    // Si el usuario es promotor, obtener datos adicionales
    let promoterStats = null;
    if (req.user.role === 'PROMOTER') {
      // Total de comisiones ganadas
      const totalCommissions = await Order.aggregate([
        {
          $match: {
            promoterId: new Types.ObjectId(userId),
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$commission' }
          }
        }
      ]);

      // Cantidad de códigos promocionales
      const totalPromoCodes = await PromotionalCode.countDocuments({
        createdBy: userId
      });

      // Conversiones (órdenes completadas con códigos del promotor)
      const totalConversions = await Order.countDocuments({
        promoterId: userId,
        status: 'completed'
      });

      promoterStats = {
        totalCommissions: totalCommissions.length > 0 ? totalCommissions[0].total : 0,
        totalPromoCodes,
        totalConversions
      };
    }

    // Devolver los datos
    return res.status(200).json({
      success: true,
      data: {
        totalCards,
        activeCards,
        totalScans,
        totalReviews,
        ...(promoterStats && { promoterStats })
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del dashboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtiene la actividad reciente del usuario
 */
export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit as string) || 5;

    // Obtener IDs de las tarjetas del usuario
    const userCardIds = await Card.find({ userId }).distinct('_id');

    // Obtener escaneos recientes
    const recentScans = await Scan.find({
      cardId: { $in: userCardIds }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('cardId', 'name identifier');

    // Obtener reseñas recientes
    const recentReviews = await Review.find({
      cardId: { $in: userCardIds }
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('cardId', 'name identifier');

    // Obtener activaciones recientes
    const recentActivations = await Card.find({
      userId,
      activatedAt: { $exists: true, $ne: null }
    })
    .sort({ activatedAt: -1 })
    .limit(limit)
    .select('_id name identifier activatedAt');

    // Obtener órdenes recientes
    const recentOrders = await Order.find({
      userId
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('_id orderNumber status total createdAt');

    // Convertir los datos a formato unificado de actividad
    const activities = [
      ...recentScans.map(scan => ({
        id: scan._id.toString(),
        type: 'scan',
        message: `Tu tarjeta "${scan.cardId.name}" ha sido escaneada`,
        cardId: scan.cardId._id.toString(),
        timestamp: scan.createdAt,
        data: {
          location: scan.location,
          userAgent: scan.userAgent
        }
      })),

      ...recentReviews.map(review => ({
        id: review._id.toString(),
        type: 'review',
        message: `Has recibido una nueva reseña para tu tarjeta "${review.cardId.name}"`,
        cardId: review.cardId._id.toString(),
        timestamp: review.createdAt,
        data: {
          rating: review.rating,
          content: review.content
        }
      })),

      ...recentActivations.map(card => ({
        id: `activation-${card._id.toString()}`,
        type: 'activation',
        message: `Tu tarjeta "${card.name}" ha sido activada`,
        cardId: card._id.toString(),
        timestamp: card.activatedAt,
        data: {
          identifier: card.identifier
        }
      })),

      ...recentOrders.map(order => ({
        id: order._id.toString(),
        type: 'order',
        message: `Tu pedido #${order.orderNumber} está ${getOrderStatusText(order.status)}`,
        timestamp: order.createdAt,
        data: {
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total
        }
      }))
    ];

    // Ordenar por fecha (más reciente primero)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limitar a la cantidad solicitada
    const limitedActivities = activities.slice(0, limit);

    return res.status(200).json({
      success: true,
      data: limitedActivities
    });

  } catch (error) {
    console.error('Error al obtener la actividad del usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la actividad del usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtiene texto descriptivo para el estado de una orden
 */
const getOrderStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'pendiente de pago';
    case 'processing':
      return 'en procesamiento';
    case 'shipped':
      return 'enviado';
    case 'completed':
      return 'completado';
    case 'cancelled':
      return 'cancelado';
    default:
      return status;
  }
};

/**
 * Obtiene estadísticas específicas para un promotor
 */
export const getPromoterStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    // Verificar que el usuario es promotor
    if (req.user.role !== 'PROMOTER') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a estas estadísticas'
      });
    }

    // Códigos promocionales creados por el promotor
    const promoCodes = await PromotionalCode.find({ createdBy: userId });

    // Estadísticas de uso para cada código
    const promoCodesStats = await Promise.all(
      promoCodes.map(async (code) => {
        const usageCount = await Order.countDocuments({
          promoCode: code.code,
          status: { $ne: 'cancelled' }
        });

        const completedOrders = await Order.countDocuments({
          promoCode: code.code,
          status: 'completed'
        });

        const totalAmount = await Order.aggregate([
          {
            $match: {
              promoCode: code.code,
              status: 'completed'
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$total' }
            }
          }
        ]);

        return {
          code: code.code,
          discount: code.discount,
          isActive: code.isActive,
          usageCount,
          completedOrders,
          totalAmount: totalAmount.length > 0 ? totalAmount[0].total : 0,
          createdAt: code.createdAt,
          expiresAt: code.expiresAt
        };
      })
    );

    // Comisiones ganadas (mensual)
    const monthlyCommissions = await Order.aggregate([
      {
        $match: {
          promoterId: new Types.ObjectId(userId),
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$commission' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    return res.status(200).json({
      success: true,
      data: {
        promoCodesStats,
        monthlyCommissions
      }
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del promotor:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del promotor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  getDashboardStats,
  getUserActivity,
  getPromoterStats
};