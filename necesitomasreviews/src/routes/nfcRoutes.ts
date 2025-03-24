// Rutas para tarjetas NFC (src/routes/nfcRoutes.ts)
import express from 'express';
import {
  getUserCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getCardStats,
  redirectCard
} from '../controllers/nfcController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Rutas protegidas
router.use('/cards', protect);
router.route('/cards').get(getUserCards).post(createCard);
router.route('/cards/:id').get(getCardById).put(updateCard).delete(deleteCard);
router.route('/cards/:id/stats').get(getCardStats);

// Ruta pública para redirección de escaneos
router.get('/redirect/:id', redirectCard);

export default router;