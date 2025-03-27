// src/routes/subscription.routes.ts

import { Router } from 'express';
import subscriptionController from '../controllers/subscription.controller';
import { authenticate } from '../middleware/auth.middleware';
import { checkPremiumSubscription } from '../middleware/checkPremiumSubscription';

const router = Router();

// Rutas públicas
router.get('/plans', subscriptionController.getSubscriptionPlans);

// Rutas protegidas
router.get('/current', authenticate, subscriptionController.getCurrentSubscription);
router.post('/premium', authenticate, subscriptionController.createPremiumSubscription);
router.put('/cancel', authenticate, subscriptionController.cancelSubscription);
router.put('/auto-renew', authenticate, subscriptionController.updateAutoRenew);

export default router;