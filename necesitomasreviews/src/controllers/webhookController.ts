// Ejemplo de webhook para reseñas (src/controllers/webhookController.ts)
import { Request, Response } from 'express';
import NFCCard from '../models/nfcCardModel';
import Review from '../models/reviewModel';

// Webhook para registrar nuevas reseñas
export const googleReviewWebhook = async (req: Request, res: Response) => {
  try {
    // Verificar clave de autenticación del webhook
    const authKey = req.headers['x-webhook-key'];
    if (authKey !== process.env.REVIEW_WEBHOOK_KEY) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    const { businessId, reviewId, rating, timestamp, cardId } = req.body;

    // Verificar datos requeridos
    if (!businessId || !reviewId || !rating || !cardId) {
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos'
      });
    }

    // Verificar que la tarjeta existe
    const card = await NFCCard.findById(cardId);
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Tarjeta no encontrada'
      });
    }

    // Verificar si la reseña ya existe
    const existingReview = await Review.findOne({ reviewId });
    if (existingReview) {
      return res.status(200).json({
        success: true,
        message: 'Reseña ya registrada'
      });
    }

    // Crear registro de la reseña
    await Review.create({
      card: cardId,
      reviewId,
      rating,
      createdAt: timestamp ? new Date(timestamp) : new Date()
    });

    // Actualizar contador de reseñas en la tarjeta
    card.totalReviews += 1;
    await card.save();

    res.status(200).json({
      success: true,
      message: 'Reseña registrada correctamente'
    });
  } catch (error) {
    console.error('Error en webhook de reseñas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar webhook',
      error: error.message
    });
  }
};