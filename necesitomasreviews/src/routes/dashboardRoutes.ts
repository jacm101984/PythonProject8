// src/routes/dashboardRoutes.ts
import express from 'express';
import dashboardController from '../controllers/dashboardController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// Proteger todas las rutas de dashboard con autenticación
router.use(authenticate);

// Ruta para obtener estadísticas generales del dashboard
router.get('/stats', dashboardController.getDashboardStats);

// Ruta para obtener la actividad reciente del usuario
router.get('/activity', dashboardController.getUserActivity);

// Ruta para estadísticas específicas de promotores
router.get('/promoter-stats', dashboardController.getPromoterStats);

export default router;