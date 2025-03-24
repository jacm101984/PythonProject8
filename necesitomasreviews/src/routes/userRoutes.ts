// src/routes/userRoutes.ts
import express from 'express';
import {
  updateProfile,
  changePassword,
  getUserDashboard
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile
router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.get('/dashboard', getUserDashboard);

export default router;