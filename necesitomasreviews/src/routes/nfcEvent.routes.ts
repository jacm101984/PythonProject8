// src/routes/nfcEvent.routes.ts

import { Router } from 'express';
import nfcEventController from '../controllers/nfcEvent.controller';
import { authenticate } from '../middleware/auth.middleware';
import { checkPremiumSubscription } from '../middleware/checkPremiumSubscription';

const router = Router();

// Rutas públicas (para registrar eventos desde tarjetas NFC)
router.post('/cards/:cardId/scan', nfcEventController.recordScanEvent);
router.post('/cards/:cardId/review-started', nfcEventController.recordReviewStarted);
router.post('/cards/:cardId/review-completed', nfcEventController.recordReviewCompleted);

// Rutas protegidas (solo para usuarios premium)
router.get('/cards/:cardId/stats', authenticate, checkPremiumSubscription, nfcEventController.getCardStats);
router.get('/user/stats', authenticate, checkPremiumSubscription, nfcEventController.getUserCardStats);

export default router;