"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleReviewWebhook = void 0;
const nfcCardModel_1 = __importDefault(require("../models/nfcCardModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
// Webhook para registrar nuevas reseñas
const googleReviewWebhook = async (req, res) => {
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
        const card = await nfcCardModel_1.default.findById(cardId);
        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Tarjeta no encontrada'
            });
        }
        // Verificar si la reseña ya existe
        const existingReview = await reviewModel_1.default.findOne({ reviewId });
        if (existingReview) {
            return res.status(200).json({
                success: true,
                message: 'Reseña ya registrada'
            });
        }
        // Crear registro de la reseña
        await reviewModel_1.default.create({
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
    }
    catch (error) {
        console.error('Error en webhook de reseñas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar webhook',
            error: error.message
        });
    }
};
exports.googleReviewWebhook = googleReviewWebhook;
//# sourceMappingURL=webhookController.js.map