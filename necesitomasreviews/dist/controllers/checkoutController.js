"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutController = void 0;
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
const PromoCode_1 = require("../models/PromoCode");
const paymentService_1 = __importDefault(require("../services/paymentService"));
const mailerService_1 = __importDefault(require("../services/mailerService"));
// Mapeo de planes disponibles
const PLANS = {
    basic: {
        id: 'basic',
        name: 'Básico',
        price: 29,
        cardCount: 1
    },
    standard: {
        id: 'standard',
        name: 'Estándar',
        price: 59,
        cardCount: 3
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        price: 79,
        cardCount: 5
    },
    enterprise: {
        id: 'enterprise',
        name: 'Empresarial',
        price: 119,
        cardCount: 10
    }
};
/**
 * Controlador para gestionar el checkout y procesamiento de pagos
 */
exports.checkoutController = {
    /**
     * Verificar un código promocional
     */
    async verifyPromoCode(req, res) {
        try {
            const { promoCode } = req.body;
            if (!promoCode) {
                return res.status(400).json({ error: 'Código promocional requerido' });
            }
            // Buscar el código promocional en la base de datos
            const promoCodeDoc = await PromoCode_1.PromoCode.findOne({
                code: promoCode.toUpperCase(),
                isActive: true,
                expiresAt: { $gt: new Date() }
            });
            if (!promoCodeDoc) {
                return res.status(404).json({ error: 'Código promocional inválido o expirado' });
            }
            // Verificar si el código ha alcanzado su límite de usos
            if (promoCodeDoc.maxUses !== null &&
                promoCodeDoc.maxUses !== undefined &&
                promoCodeDoc.usedCount >= promoCodeDoc.maxUses) {
                return res.status(400).json({ error: 'Este código ha alcanzado su límite de usos' });
            }
            return res.json({
                code: promoCodeDoc.code,
                discountPercentage: promoCodeDoc.discountPercentage,
                promoterId: promoCodeDoc.promoterId
            });
        }
        catch (error) {
            console.error('Error al verificar código promocional:', error);
            return res.status(500).json({ error: 'Error al verificar código promocional' });
        }
    },
    /**
     * Crear una nueva orden de compra
     */
    async createOrder(req, res) {
        try {
            const { planId, shippingInfo, paymentMethod, promoCode, paypalOrderId } = req.body;
            const userId = req.user.id;
            // Verificar que el plan exista
            if (!PLANS[planId]) {
                return res.status(400).json({ error: 'Plan no válido' });
            }
            const plan = PLANS[planId];
            let totalAmount = plan.price;
            let discountPercentage = 0;
            let promoterId = null;
            // Aplicar código promocional si existe
            if (promoCode) {
                const promoCodeDoc = await PromoCode_1.PromoCode.findOne({
                    code: promoCode.toUpperCase(),
                    isActive: true,
                    expiresAt: { $gt: new Date() }
                });
                if (promoCodeDoc) {
                    // Verificar límite de usos
                    if (promoCodeDoc.maxUses === null ||
                        promoCodeDoc.maxUses === undefined ||
                        promoCodeDoc.usedCount < promoCodeDoc.maxUses) {
                        discountPercentage = promoCodeDoc.discountPercentage;
                        promoterId = promoCodeDoc.promoterId;
                        totalAmount = totalAmount - (totalAmount * discountPercentage / 100);
                    }
                }
            }
            // Obtener datos del usuario
            const user = await User_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Crear la orden en la base de datos
            const order = new Order_1.Order({
                userId,
                planId: plan.id,
                planName: plan.name,
                cardCount: plan.cardCount,
                originalAmount: plan.price,
                discountPercentage,
                discountCode: promoCode || null,
                totalAmount,
                promoterId,
                paymentMethod,
                status: paypalOrderId ? Order_1.OrderStatus.COMPLETED : Order_1.OrderStatus.PENDING, // Si hay paypalOrderId, el pago ya está completado
                shippingInfo,
                paymentDetails: {
                    method: paymentMethod,
                    externalId: paypalOrderId || null,
                }
            });
            await order.save();
            // Incrementar el contador de usos del código promocional si se aplicó
            if (promoCode && discountPercentage > 0) {
                await PromoCode_1.PromoCode.findOneAndUpdate({ code: promoCode.toUpperCase() }, { $inc: { usedCount: 1 } });
            }
            // Si ya tenemos el ID de orden de PayPal (pago completado)
            if (paypalOrderId) {
                // Enviar correo de confirmación de pago
                await mailerService_1.default.sendPaymentConfirmationEmail(user.email, {
                    orderId: order._id.toString(),
                    planName: plan.name,
                    cardCount: plan.cardCount,
                    totalAmount
                });
                // Sí hay un promotor asociado, actualizar sus comisiones
                if (promoterId) {
                    const commission = totalAmount * 0.10; // 10% de comisión
                    await User_1.User.findByIdAndUpdate(promoterId, { $inc: { commissionBalance: commission } });
                }
                return res.json({
                    orderId: order._id,
                    status: 'completed'
                });
            }
            // Para otros métodos de pago, generar la URL de pago
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const returnUrl = `${baseUrl}/checkout/success/${order._id}`;
            const cancelUrl = `${baseUrl}/checkout/cancel/${order._id}`;
            const { paymentUrl, paymentId } = await paymentService_1.default.initiatePayment(order, user, paymentMethod, returnUrl, cancelUrl);
            // Actualizar la orden con el ID de pago externo
            await Order_1.Order.findByIdAndUpdate(order._id, {
                'paymentDetails.externalId': paymentId
            });
            // Enviar correo de confirmación de orden
            await mailerService_1.default.sendOrderConfirmationEmail(user.email, {
                orderId: order._id.toString(),
                planName: plan.name,
                cardCount: plan.cardCount,
                totalAmount
            });
            return res.json({
                orderId: order._id,
                paymentUrl
            });
        }
        catch (error) {
            console.error('Error al crear orden:', error);
            return res.status(500).json({ error: 'Error al procesar la orden' });
        }
    },
    /**
     * Procesar la confirmación de pago exitoso
     */
    async handlePaymentSuccess(req, res) {
        try {
            const { orderId } = req.params;
            const { token, payment_id, collection_id } = req.query;
            // Verificar que la orden exista
            const order = await Order_1.Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
            // Si la orden ya está completada, redirigir a la página de éxito
            if (order.status === Order_1.OrderStatus.COMPLETED) {
                const clientUrl = process.env.CLIENT_URL || 'http://localhost:5300';
                return res.redirect(`${clientUrl}/checkout/success/${orderId}`);
            }
            // Obtener el ID de pago externo según el método de pago
            let paymentId;
            if (order.paymentMethod === 'paypal') {
                paymentId = token;
            }
            else if (order.paymentMethod === 'webpay') {
                paymentId = token;
            }
            else if (order.paymentMethod === 'mercadopago') {
                paymentId = (payment_id || collection_id);
            }
            else {
                paymentId = order.paymentDetails.externalId;
            }
            // Verificar el estado del pago
            const { verified, transactionId } = await paymentService_1.default.verifyPayment(paymentId, order.paymentMethod);
            if (!verified) {
                // Actualizar estado de la orden a fallido
                await Order_1.Order.findByIdAndUpdate(orderId, {
                    status: Order_1.OrderStatus.FAILED,
                    'paymentDetails.transactionId': transactionId || null
                });
                const clientUrl = process.env.CLIENT_URL || 'http://localhost:5300';
                return res.redirect(`${clientUrl}/checkout/cancel/${orderId}`);
            }
            // Actualizar estado de la orden ha completado
            await Order_1.Order.findByIdAndUpdate(orderId, {
                status: Order_1.OrderStatus.COMPLETED,
                'paymentDetails.transactionId': transactionId || null
            });
            // Obtener el usuario para enviar email de confirmación
            const user = await User_1.User.findById(order.userId);
            // Enviar correo de confirmación de pago
            if (user) {
                await mailerService_1.default.sendPaymentConfirmationEmail(user.email, {
                    orderId: order._id.toString(),
                    planName: order.planName,
                    cardCount: order.cardCount,
                    totalAmount: order.totalAmount
                });
            }
            // Sí hay un promotor asociado, actualizar sus comisiones
            if (order.promoterId) {
                const commission = order.totalAmount * 0.10; // 10% de comisión
                await User_1.User.findByIdAndUpdate(order.promoterId, { $inc: { commissionBalance: commission } });
            }
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5300';
            return res.redirect(`${clientUrl}/checkout/success/${orderId}`);
        }
        catch (error) {
            console.error('Error al procesar confirmación de pago:', error);
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5300';
            return res.redirect(`${clientUrl}/checkout/cancel/${req.params.orderId}`);
        }
    },
    /**
     * Procesar la cancelación de pago
     */
    async handlePaymentCancel(req, res) {
        try {
            const { orderId } = req.params;
            // Actualizar estado de la orden ha cancelado
            await Order_1.Order.findByIdAndUpdate(orderId, {
                status: Order_1.OrderStatus.CANCELLED
            });
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5300';
            return res.redirect(`${clientUrl}/checkout/cancel/${orderId}`);
        }
        catch (error) {
            console.error('Error al procesar cancelación de pago:', error);
            const clientUrl = process.env.CLIENT_URL || 'http://localhost:5300';
            return res.redirect(`${clientUrl}/checkout/cancel/${req.params.orderId}`);
        }
    },
    /**
     * Obtener detalles de una orden
     */
    async getOrderDetails(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;
            // Buscar la orden
            const order = await Order_1.Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
            // Verificar que la orden pertenezca al usuario o sea un administrador
            if (order.userId.toString() !== userId && req.user.role !== 'ADMIN') {
                return res.status(403).json({ error: 'No tienes permiso para ver esta orden' });
            }
            return res.json({
                id: order._id,
                planName: order.planName,
                cardCount: order.cardCount,
                status: order.status,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt
            });
        }
        catch (error) {
            console.error('Error al obtener detalles de orden:', error);
            return res.status(500).json({ error: 'Error al obtener detalles de la orden' });
        }
    },
    /**
     * Verificar estado de un pago de PayPal
     */
    async verifyPayPalPayment(req, res) {
        try {
            const { paypalOrderId } = req.params;
            if (!paypalOrderId) {
                return res.status(400).json({ error: 'ID de orden de PayPal requerido' });
            }
            // Verificar el estado del pago con PayPal
            const { verified, transactionId } = await paymentService_1.default.verifyPayPalOrderDirectly(paypalOrderId);
            if (!verified) {
                return res.status(400).json({
                    success: false,
                    message: 'Pago no verificado o incompleto'
                });
            }
            return res.json({
                success: true,
                transactionId,
                message: 'Pago verificado correctamente'
            });
        }
        catch (error) {
            console.error('Error al verificar pago de PayPal:', error);
            return res.status(500).json({
                success: false,
                message: 'Error al verificar el pago con PayPal'
            });
        }
    },
    /**
     * Reintentar un pago fallido o cancelado
     */
    async retryPayment(req, res) {
        try {
            const { orderId } = req.params;
            const userId = req.user.id;
            // Buscar la orden
            const order = await Order_1.Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ error: 'Orden no encontrada' });
            }
            // Verificar que la orden pertenezca al usuario
            if (order.userId.toString() !== userId) {
                return res.status(403).json({ error: 'No tienes permiso para modificar esta orden' });
            }
            // Verificar que la orden esté en estado pendiente, fallido o cancelado
            if (![Order_1.OrderStatus.PENDING, Order_1.OrderStatus.FAILED, Order_1.OrderStatus.CANCELLED].includes(order.status)) {
                return res.status(400).json({ error: 'Esta orden no puede ser procesada nuevamente' });
            }
            // Actualizar el estado de la orden a pendiente
            await Order_1.Order.findByIdAndUpdate(orderId, {
                status: Order_1.OrderStatus.PENDING
            });
            // Obtener usuario
            const user = await User_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Generar nueva URL de pago
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            const returnUrl = `${baseUrl}/checkout/success/${order._id}`;
            const cancelUrl = `${baseUrl}/checkout/cancel/${order._id}`;
            const { paymentUrl, paymentId } = await paymentService_1.default.initiatePayment(order, user, order.paymentMethod, returnUrl, cancelUrl);
            // Actualizar la orden con el nuevo ID de pago externo
            await Order_1.Order.findByIdAndUpdate(order._id, {
                'paymentDetails.externalId': paymentId
            });
            return res.json({
                orderId: order._id,
                paymentUrl
            });
        }
        catch (error) {
            console.error('Error al reintentar pago:', error);
            return res.status(500).json({ error: 'Error al procesar el pago' });
        }
    },
    /**
     * Obtener órdenes del usuario actual
     */
    async getUserOrders(req, res) {
        try {
            const userId = req.user.id;
            // Buscar todas las órdenes del usuario
            const orders = await Order_1.Order.find({ userId })
                .sort({ createdAt: -1 })
                .lean();
            return res.json(orders.map(order => ({
                id: order._id,
                planName: order.planName,
                cardCount: order.cardCount,
                status: order.status,
                totalAmount: order.totalAmount,
                createdAt: order.createdAt
            })));
        }
        catch (error) {
            console.error('Error al obtener órdenes del usuario:', error);
            return res.status(500).json({ error: 'Error al obtener las órdenes' });
        }
    }
};
//# sourceMappingURL=checkoutController.js.map