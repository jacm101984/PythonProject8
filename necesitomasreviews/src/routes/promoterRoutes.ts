// src/routes/promoterRoutes.ts
import express from 'express';
import {
  getDashboardStats,
  getDiscountCodes,
  createDiscountCode,
  updateDiscountCode,
  getPromoterOrders,
  getCommissions,
  updateOrderStatus
} from '../controllers/promoterController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected and require promoter role
router.use(protect);
router.use(authorize('PROMOTER'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Discount codes
router.get('/discount-codes', getDiscountCodes);
router.post('/discount-codes', createDiscountCode);
router.put('/discount-codes/:id', updateDiscountCode);

// Orders
router.get('/orders', getPromoterOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Commissions
router.get('/commissions', getCommissions);

export default router;