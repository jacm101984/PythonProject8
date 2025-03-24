import express from 'express';
import {
  register,
  verifyEmail,
  resendVerificationEmail,
  login,
  requestPasswordReset,
  resetPassword,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/login', login);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', logout);

export default router;