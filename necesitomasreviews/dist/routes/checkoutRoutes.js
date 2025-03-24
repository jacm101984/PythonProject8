"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkoutController_1 = require("../controllers/checkoutController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
/**
 * @route POST /api/checkout/verify-promo
 * @desc Verificar código promocional
 * @access Public
 */
router.post('/verify-promo', checkoutController_1.checkoutController.verifyPromoCode);
/**
 * @route POST /api/checkout/create-order
 * @desc Crear una nueva orden de compra
 * @access Private
 */
router.post('/create-order', authMiddleware_1.authMiddleware, checkoutController_1.checkoutController.createOrder);
/**
 * @route GET /api/checkout/success/:orderId
 * @desc Manejar confirmación de pago exitoso
 * @access Public
 */
router.get('/success/:orderId', checkoutController_1.checkoutController.handlePaymentSuccess);
/**
 * @route GET /api/checkout/cancel/:orderId
 * @desc Manejar cancelación de pago
 * @access Public
 */
router.get('/cancel/:orderId', checkoutController_1.checkoutController.handlePaymentCancel);
/**
 * @route GET /api/checkout/orders/:orderId
 * @desc Obtener detalles de una orden
 * @access Private
 */
router.get('/orders/:orderId', authMiddleware_1.authMiddleware, checkoutController_1.checkoutController.getOrderDetails);
/**
 * @route GET /api/checkout/verify-paypal/:paypalOrderId
 * @desc Verificar el estado de un pago de PayPal
 * @access Public
 */
router.get('/verify-paypal/:paypalOrderId', checkoutController_1.checkoutController.verifyPayPalPayment);
/**
 * @route POST /api/checkout/retry-payment/:orderId
 * @desc Reintentar un pago fallido o cancelado
 * @access Private
 */
router.post('/retry-payment/:orderId', authMiddleware_1.authMiddleware, checkoutController_1.checkoutController.retryPayment);
/**
 * @route GET /api/checkout/orders
 * @desc Obtener órdenes del usuario actual
 * @access Private
 */
router.get('/orders', authMiddleware_1.authMiddleware, checkoutController_1.checkoutController.getUserOrders);
exports.default = router;
//# sourceMappingURL=checkoutRoutes.js.map