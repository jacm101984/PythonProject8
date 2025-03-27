// src/routes/index.ts

import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import nfcCardRoutes from './nfcCard.routes';
import businessRoutes from './business.routes';
import adminRoutes from './admin.routes';
import subscriptionRoutes from './subscription.routes';
import nfcEventRoutes from './nfcEvent.routes';
import notificationRoutes from './notification.routes';

const router = Router();

// Rutas base
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/nfc-cards', nfcCardRoutes);
router.use('/businesses', businessRoutes);
router.use('/admin', adminRoutes);

// Nuevas rutas para suscripciones y eventos
router.use('/subscriptions', subscriptionRoutes);
router.use('/events', nfcEventRoutes);
router.use('/notifications', notificationRoutes);

export default router;