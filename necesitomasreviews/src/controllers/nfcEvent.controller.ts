// src/controllers/nfcEvent.controller.ts

import { Request, Response } from 'express';
import NFCEvent from '../models/nfcEvent.model';
import NFCCard from '../models/nfcCard.model';
import Business from '../models/business.model';
import User from '../models/user.model';
import Notification from '../models/notification.model';
import { sendNotification } from '../services/notification.service';
import mongoose from 'mongoose';
import useragent from 'express-useragent';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

class NFCEventController {
  /**
   * Registra un evento de escaneo de tarjeta NFC
   * (Endpoint público que se llama cuando alguien escanea una tarjeta)
   */
  public async recordScanEvent(req: Request, res: Response) {
    try {
      const { cardId } = req.params;
      const { latitude, longitude } = req.body;

      // Validar cardId
      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).json({
          success: false,
          error: 'ID de tarjeta inválido'
        });
      }

      // Obtener información de la tarjeta
      const card = await NFCCard.findById(cardId).exec();

      if (!card) {
        return res.status(404).json({
          success: false,
          error: 'Tarjeta no encontrada'
        });
      }

      if (!card.isActive) {
        return res.status(400).json({
          success: false,
          error: 'Tarjeta inactiva'
        });
      }

      // Obtener información del negocio
      const business = await Business.findById(card.businessId).exec();

      if (!business) {
        return res.status(404).json({
          success: false,
          error: 'Negocio no encontrado'
        });
      }

      // Extraer información del dispositivo
      const ua = useragent.parse(req.headers['user-agent'] || '');

      // Crear evento de escaneo
      const scanEvent = new NFCEvent({
        cardId: card._id,
        userId: card.userId,
        businessId: card.businessId,
        eventType: 'scan',
        timestamp: new Date(),
        location: latitude && longitude ? { latitude, longitude } : undefined,
        deviceInfo: {
          type: ua.isMobile ? 'mobile' : (ua.isTablet ? 'tablet' : 'desktop'),
          browser: ua.browser,
          os: ua.os
        },
        ipAddress: req.ip
      });

      await scanEvent.save();

      // Buscar usuario con suscripción premium para enviar notificación
      const user = await User.findById(card.userId)
        .populate('subscriptionId')
        .exec();

      if (user &&
          user.subscriptionId &&
          (user.subscriptionId as any).plan === 'premium' &&
          (user.subscriptionId as any).status === 'active') {

        // Crear notificación para usuario premium
        const notification = new Notification({
          userId: user._id,
          cardId: card._id,
          businessId: card.businessId,
          eventType: 'scan',
          title: '¡Tarjeta escaneada!',
          message: `Tu tarjeta para ${business.name} ha sido escaneada.`,
          read: false,
          data: {
            cardId: card._id,
            businessId: business._id,
            timestamp: new Date()
          },
          timestamp: new Date()
        });

        await notification.save();

        // Enviar notificación en tiempo real
        await sendNotification(user._id.toString(), notification);
      }

      // Redireccionar a la URL de Google Reviews
      return res.status(200).json({
        success: true,
        message: 'Evento registrado correctamente',
        redirectUrl: business.googleReviewUrl || `https://search.google.com/local/writereview?placeid=${business.googlePlaceId}`
      });

    } catch (error) {
      console.error('Error al registrar evento de escaneo:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Registra un evento de inicio de reseña
   */
  public async recordReviewStarted(req: Request, res: Response) {
    try {
      const { cardId } = req.params;
      const { latitude, longitude } = req.body;

      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).json({
          success: false,
          error: 'ID de tarjeta inválido'
        });
      }

      const card = await NFCCard.findById(cardId).exec();

      if (!card) {
        return res.status(404).json({
          success: false,
          error: 'Tarjeta no encontrada'
        });
      }

      // Extraer información del dispositivo
      const ua = useragent.parse(req.headers['user-agent'] || '');

      // Crear evento de inicio de reseña
      const reviewStartedEvent = new NFCEvent({
        cardId: card._id,
        userId: card.userId,
        businessId: card.businessId,
        eventType: 'review_started',
        timestamp: new Date(),
        location: latitude && longitude ? { latitude, longitude } : undefined,
        deviceInfo: {
          type: ua.isMobile ? 'mobile' : (ua.isTablet ? 'tablet' : 'desktop'),
          browser: ua.browser,
          os: ua.os
        },
        ipAddress: req.ip
      });

      await reviewStartedEvent.save();

      return res.status(200).json({
        success: true,
        message: 'Inicio de reseña registrado correctamente'
      });
    } catch (error) {
      console.error('Error al registrar inicio de reseña:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Registra un evento de reseña completada
   * (Se llama cuando se confirma que se ha dejado una reseña)
   */
  public async recordReviewCompleted(req: Request, res: Response) {
    try {
      const { cardId } = req.params;
      const { reviewId, reviewRating, latitude, longitude } = req.body;

      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).json({
          success: false,
          error: 'ID de tarjeta inválido'
        });
      }

      if (!reviewId) {
        return res.status(400).json({
          success: false,
          error: 'ID de reseña requerido'
        });
      }

      const card = await NFCCard.findById(cardId).exec();

      if (!card) {
        return res.status(404).json({
          success: false,
          error: 'Tarjeta no encontrada'
        });
      }

      const business = await Business.findById(card.businessId).exec();

      if (!business) {
        return res.status(404).json({
          success: false,
          error: 'Negocio no encontrado'
        });
      }

      // Extraer información del dispositivo
      const ua = useragent.parse(req.headers['user-agent'] || '');

      // Crear evento de reseña completada
      const reviewCompletedEvent = new NFCEvent({
        cardId: card._id,
        userId: card.userId,
        businessId: card.businessId,
        eventType: 'review_completed',
        timestamp: new Date(),
        location: latitude && longitude ? { latitude, longitude } : undefined,
        deviceInfo: {
          type: ua.isMobile ? 'mobile' : (ua.isTablet ? 'tablet' : 'desktop'),
          browser: ua.browser,
          os: ua.os
        },
        ipAddress: req.ip,
        reviewId,
        reviewRating
      });

      await reviewCompletedEvent.save();

      // Incrementar contador de reseñas en la tarjeta
      await NFCCard.findByIdAndUpdate(
        cardId,
        { $inc: { reviewCount: 1 } }
      );

      // Buscar usuario con suscripción premium para enviar notificación
      const user = await User.findById(card.userId)
        .populate('subscriptionId')
        .exec();

      if (user &&
          user.subscriptionId &&
          (user.subscriptionId as any).plan === 'premium' &&
          (user.subscriptionId as any).status === 'active') {

        // Crear notificación para usuario premium
        const notification = new Notification({
          userId: user._id,
          cardId: card._id,
          businessId: card.businessId,
          eventType: 'review_completed',
          title: '¡Nueva reseña recibida!',
          message: `Se ha completado una reseña ${reviewRating ? `de ${reviewRating} estrellas` : ''} para ${business.name}.`,
          read: false,
          data: {
            cardId: card._id,
            businessId: business._id,
            reviewId,
            reviewRating,
            timestamp: new Date()
          },
          timestamp: new Date()
        });

        await notification.save();

        // Enviar notificación en tiempo real
        await sendNotification(user._id.toString(), notification);
      }

      return res.status(200).json({
        success: true,
        message: 'Reseña completada registrada correctamente'
      });
    } catch (error) {
      console.error('Error al registrar reseña completada:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtiene estadísticas para una tarjeta específica
   * (Solo para usuarios premium)
   */
  public async getCardStats(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado'
        });
      }

      const { cardId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).json({
          success: false,
          error: 'ID de tarjeta inválido'
        });
      }

      const card = await NFCCard.findById(cardId).exec();

      if (!card) {
        return res.status(404).json({
          success: false,
          error: 'Tarjeta no encontrada'
        });
      }

      // Verificar propiedad de la tarjeta o permisos administrativos
      if (card.userId.toString() !== req.user.id &&
          !['REGIONAL_ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: 'No tienes permiso para ver estadísticas de esta tarjeta'
        });
      }

      // Obtener eventos relacionados con la tarjeta
      const events = await NFCEvent.find({ cardId: card._id })
        .sort({ timestamp: -1 })
        .exec();

      // Calcular estadísticas
      const scanEvents = events.filter(e => e.eventType === 'scan');
      const reviewStartedEvents = events.filter(e => e.eventType === 'review_started');
      const reviewCompletedEvents = events.filter(e => e.eventType === 'review_completed');

      // Calcular tasas de conversión
      const scanToReviewStartRate = scanEvents.length > 0
        ? (reviewStartedEvents.length / scanEvents.length) * 100
        : 0;

      const reviewStartToCompleteRate = reviewStartedEvents.length > 0
        ? (reviewCompletedEvents.length / reviewStartedEvents.length) * 100
        : 0;

      const scanToReviewCompleteRate = scanEvents.length > 0
        ? (reviewCompletedEvents.length / scanEvents.length) * 100
        : 0;

      // Agrupar eventos por día para gráficos
      const dailyStats = this.groupEventsByDay(events);

      // Obtener horas populares
      const popularHours = this.getPopularHours(scanEvents);

      return res.status(200).json({
        success: true,
        data: {
          card: {
            id: card._id,
            name: card.name,
            status: card.isActive ? 'active' : 'inactive',
            createdAt: card.createdAt
          },
          counts: {
            scans: scanEvents.length,
            reviewsStarted: reviewStartedEvents.length,
            reviewsCompleted: reviewCompletedEvents.length
          },
          conversionRates: {
            scanToReviewStartRate: parseFloat(scanToReviewStartRate.toFixed(2)),
            reviewStartToCompleteRate: parseFloat(reviewStartToCompleteRate.toFixed(2)),
            scanToReviewCompleteRate: parseFloat(scanToReviewCompleteRate.toFixed(2))
          },
          dailyStats,
          popularHours,
          recentEvents: events.slice(0, 20).map(event => ({
            id: event._id,
            type: event.eventType,
            timestamp: event.timestamp,
            deviceInfo: event.deviceInfo,
            location: event.location,
            reviewRating: event.reviewRating
          }))
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas de tarjeta:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Obtiene estadísticas globales de todas las tarjetas del usuario
   * (Solo para usuarios premium)
   */
  public async getUserCardStats(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'No autenticado'
        });
      }

      // Obtener todas las tarjetas del usuario
      const cards = await NFCCard.find({ userId: req.user.id }).exec();

      if (cards.length === 0) {
        return res.status(200).json({
          success: true,
          data: {
            totalCards: 0,
            totalScans: 0,
            totalReviews: 0,
            conversionRate: 0,
            cardStats: []
          }
        });
      }

      const cardIds = cards.map(card => card._id);

      // Obtener eventos para todas las tarjetas
      const events = await NFCEvent.find({
        cardId: { $in: cardIds }
      }).exec();

      // Calcular estadísticas globales
      const scanEvents = events.filter(e => e.eventType === 'scan');
      const reviewCompletedEvents = events.filter(e => e.eventType === 'review_completed');

      const conversionRate = scanEvents.length > 0
        ? (reviewCompletedEvents.length / scanEvents.length) * 100
        : 0;

      // Estadísticas por tarjeta
      const cardStats = await Promise.all(cards.map(async (card) => {
        const cardEvents = events.filter(e => e.cardId.toString() === card._id.toString());
        const cardScans = cardEvents.filter(e => e.eventType === 'scan');
        const cardReviews = cardEvents.filter(e => e.eventType === 'review_completed');

        const cardConversionRate = cardScans.length > 0
          ? (cardReviews.length / cardScans.length) * 100
          : 0;

        return {
          id: card._id,
          name: card.name,
          status: card.isActive ? 'active' : 'inactive',
          scans: cardScans.length,
          reviews: cardReviews.length,
          conversionRate: parseFloat(cardConversionRate.toFixed(2)),
          lastScan: cardScans.length > 0
            ? cardScans.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0].timestamp
            : null
        };
      }));

      // Agrupar eventos por día para gráficos
      const dailyStats = this.groupEventsByDay(events);

      return res.status(200).json({
        success: true,
        data: {
          totalCards: cards.length,
          totalScans: scanEvents.length,
          totalReviews: reviewCompletedEvents.length,
          conversionRate: parseFloat(conversionRate.toFixed(2)),
          dailyStats,
          cardStats
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas globales:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  /**
   * Utilidad para agrupar eventos por día
   */
  private groupEventsByDay(events: any[]) {
    const dailyMap = new Map();

    events.forEach(event => {
      const date = new Date(event.timestamp);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!dailyMap.has(dateString)) {
        dailyMap.set(dateString, {
          date: dateString,
          scans: 0,
          reviewsStarted: 0,
          reviewsCompleted: 0
        });
      }

      const dayStats = dailyMap.get(dateString);

      if (event.eventType === 'scan') {
        dayStats.scans++;
      } else if (event.eventType === 'review_started') {
        dayStats.reviewsStarted++;
      } else if (event.eventType === 'review_completed') {
        dayStats.reviewsCompleted++;
      }
    });

    // Convertir Map a array y ordenar por fecha
    return Array.from(dailyMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Utilidad para obtener horas populares de escaneo
   */
  private getPopularHours(scanEvents: any[]) {
    const hourCounts = Array(24).fill(0);

    scanEvents.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour]++;
    });

    return hourCounts.map((count, hour) => ({
      hour,
      count
    }));
  }
}