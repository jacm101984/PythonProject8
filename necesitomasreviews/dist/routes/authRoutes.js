"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Auth routes
router.post('/register', authController_1.register);
router.get('/verify-email/:token', authController_1.verifyEmail);
router.post('/resend-verification', authController_1.resendVerificationEmail);
router.post('/login', authController_1.login);
router.post('/forgot-password', authController_1.requestPasswordReset);
router.post('/reset-password', authController_1.resetPassword);
router.get('/me', authMiddleware_1.protect, authController_1.getCurrentUser);
router.put('/profile', authMiddleware_1.protect, authController_1.updateProfile);
router.put('/change-password', authMiddleware_1.protect, authController_1.changePassword);
router.post('/logout', authController_1.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map