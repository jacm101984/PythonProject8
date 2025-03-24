"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getCommissions = exports.getPromoterOrders = exports.updateDiscountCode = exports.createDiscountCode = exports.getDiscountCodes = exports.getDashboardStats = void 0;
const discountCodeModel_1 = __importDefault(require("../models/discountCodeModel"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
// Get promoter dashboard stats
const getDashboardStats = async (req, res, next) => {
    try {
        // Check if user is a promoter
        if (req.user.role !== 'PROMOTER') {
            return res.status(403).json({ message: 'No autorizado' });
        }
        // Get discount codes
        const discountCodes = await discountCodeModel_1.default.find({ promoterId: req.user._id });
        const codeIds = discountCodes.map(code => code.code);
        // Get order count
        const orderCount = await orderModel_1.default.countDocuments({
            promoCode: { $in: codeIds },
            status: { $ne: 'cancelled' }
        });
        // Get total revenue and commissions
        const revenueStats = await orderModel_1.default.aggregate([
            {
                $match: {
                    promoCode: { $in: codeIds },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            }
        ]);
        // Calculate commission (20% of revenue)
        const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;
        const totalCommission = totalRevenue * 0.2;
        // Get recent orders
        const recentOrders = await orderModel_1.default.find({
            promoCode: { $in: codeIds }
        })
            .sort({ createdAt: -1 })
            .limit(5);
        res.json({
            discountCodeCount: discountCodes.length,
            orderCount,
            totalRevenue,
            totalCommission,
            recentOrders
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardStats = getDashboardStats;
// Get all discount codes
const getDiscountCodes = async (req, res, next) => {
    try {
        const discountCodes = await discountCodeModel_1.default.find({ promoterId: req.user._id })
            .sort({ createdAt: -1 });
        res.json(discountCodes);
    }
    catch (error) {
        next(error);
    }
};
exports.getDiscountCodes = getDiscountCodes;
// Create a new discount code
const createDiscountCode = async (req, res, next) => {
    try {
        const { code, discountPercentage } = req.body;
        // Check if code already exists
        const existingCode = await discountCodeModel_1.default.findOne({ code });
        if (existingCode) {
            return res.status(400).json({ message: 'El código de descuento ya existe' });
        }
        // Validate discount percentage
        if (discountPercentage < 5 || discountPercentage > 25) {
            return res.status(400).json({ message: 'El porcentaje de descuento debe estar entre 5% y 25%' });
        }
        // Create discount code
        const discountCode = await discountCodeModel_1.default.create({
            code,
            promoterId: req.user._id,
            discountPercentage,
            isActive: true,
            usageCount: 0
        });
        res.status(201).json(discountCode);
    }
    catch (error) {
        next(error);
    }
};
exports.createDiscountCode = createDiscountCode;
// Update a discount code
const updateDiscountCode = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        // Find discount code by ID
        const discountCode = await discountCodeModel_1.default.findById(id);
        if (!discountCode) {
            return res.status(404).json({ message: 'Código de descuento no encontrado' });
        }
        // Check if code belongs to promoter
        if (discountCode.promoterId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        // Update code
        discountCode.isActive = isActive;
        const updatedCode = await discountCode.save();
        res.json(updatedCode);
    }
    catch (error) {
        next(error);
    }
};
exports.updateDiscountCode = updateDiscountCode;
// Get promoter orders
const getPromoterOrders = async (req, res, next) => {
    try {
        // Get all discount codes by the promoter
        const discountCodes = await discountCodeModel_1.default.find({ promoterId: req.user._id });
        const codeIds = discountCodes.map(code => code.code);
        // Get orders with promoter's discount codes
        const orders = await orderModel_1.default.find({ promoCode: { $in: codeIds } })
            .sort({ createdAt: -1 })
            .populate('userId', 'name email');
        res.json(orders);
    }
    catch (error) {
        next(error);
    }
};
exports.getPromoterOrders = getPromoterOrders;
// Get commission details
const getCommissions = async (req, res, next) => {
    try {
        const { period } = req.query;
        let startDate = new Date();
        let groupFormat = "%Y-%m-%d"; // Daily by default
        // Set time period
        if (period === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        }
        else if (period === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
            groupFormat = "%Y-%m-%d";
        }
        else if (period === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
            groupFormat = "%Y-%m";
        }
        else if (period === 'all') {
            startDate = new Date(0); // Beginning of time
            groupFormat = "%Y-%m";
        }
        // Get all discount codes by the promoter
        const discountCodes = await discountCodeModel_1.default.find({ promoterId: req.user._id });
        const codeIds = discountCodes.map(code => code.code);
        // Get commission data grouped by date
        const commissionData = await orderModel_1.default.aggregate([
            {
                $match: {
                    promoCode: { $in: codeIds },
                    status: { $ne: 'cancelled' },
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupFormat, date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    date: "$_id",
                    revenue: 1,
                    orderCount: 1,
                    commission: { $multiply: ["$revenue", 0.2] } // 20% commission
                }
            },
            { $sort: { date: 1 } }
        ]);
        // Get commission data grouped by discount code
        const codeCommissionData = await orderModel_1.default.aggregate([
            {
                $match: {
                    promoCode: { $in: codeIds },
                    status: { $ne: 'cancelled' },
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: "$promoCode",
                    revenue: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    code: "$_id",
                    revenue: 1,
                    orderCount: 1,
                    commission: { $multiply: ["$revenue", 0.2] } // 20% commission
                }
            },
            { $sort: { revenue: -1 } }
        ]);
        // Get total commission
        const totalStats = await orderModel_1.default.aggregate([
            {
                $match: {
                    promoCode: { $in: codeIds },
                    status: { $ne: 'cancelled' },
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $project: {
                    totalRevenue: 1,
                    totalOrders: 1,
                    totalCommission: { $multiply: ["$totalRevenue", 0.2] }
                }
            }
        ]);
        res.json({
            totalStats: totalStats.length > 0 ? totalStats[0] : { totalRevenue: 0, totalOrders: 0, totalCommission: 0 },
            commissionData,
            codeCommissionData
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCommissions = getCommissions;
// Update order shipping status (for promoters who handle shipping)
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Find order
        const order = await orderModel_1.default.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        // Get all discount codes by the promoter
        const discountCodes = await discountCodeModel_1.default.find({ promoterId: req.user._id });
        const codeIds = discountCodes.map(code => code.code);
        // Check if order used promoter's discount code
        if (!codeIds.includes(order.promoCode)) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        // Update status (promoters can only set to processing, shipped, delivered)
        if (['processing', 'shipped', 'delivered'].includes(status)) {
            order.status = status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        }
        else {
            return res.status(400).json({ message: 'Estado no válido' });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrderStatus = updateOrderStatus;
//# sourceMappingURL=promoterController.js.map