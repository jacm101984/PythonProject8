import express from 'express';
import { checkoutController } from '../controllers/checkoutController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route POST /api/checkout/verify-promo
 * @desc Verificar código promocional
 * @access Public
 */
router.post('/verify-promo', checkoutController.verifyPromoCode);

/**
 * @route POST /api/checkout/create-order
 * @desc Crear una nueva orden de compra
 * @access Private
 */
router.post('/create-order', authMiddleware, checkoutController.createOrder);

/**
 * @route GET /api/checkout/success/:orderId
 * @desc Manejar confirmación de pago exitoso
 * @access Public
 */
router.get('/success/:orderId', checkoutController.handlePaymentSuccess);

/**
 * @route GET /api/checkout/cancel/:orderId
 * @desc Manejar cancelación de pago
 * @access Public
 */
router.get('/cancel/:orderId', checkoutController.handlePaymentCancel);

/**
 * @route GET /api/checkout/orders/:orderId
 * @desc Obtener detalles de una orden
 * @access Private
 */
router.get('/orders/:orderId', authMiddleware, checkoutController.getOrderDetails);

/**
 * @route GET /api/checkout/verify-paypal/:paypalOrderId
 * @desc Verificar el estado de un pago de PayPal
 * @access Public
 */
router.get('/verify-paypal/:paypalOrderId', checkoutController.verifyPayPalPayment);

/**
 * @route POST /api/checkout/retry-payment/:orderId
 * @desc Reintentar un pago fallido o cancelado
 * @access Private
 */
router.post('/retry-payment/:orderId', authMiddleware, checkoutController.retryPayment);

/**
 * @route GET /api/checkout/orders
 * @desc Obtener órdenes del usuario actual
 * @access Private
 */
router.get('/orders', authMiddleware, checkoutController.getUserOrders);

export default router;