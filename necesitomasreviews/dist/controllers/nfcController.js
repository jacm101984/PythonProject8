"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirectCard = exports.getCardStats = exports.deleteCard = exports.updateCard = exports.createCard = exports.getCardById = exports.getUserCards = void 0;
const nfcCardModel_1 = __importDefault(require("../models/nfcCardModel"));
const scanModel_1 = __importDefault(require("../models/scanModel")); // Modelo para registrar escaneos
const reviewModel_1 = __importDefault(require("../models/reviewModel")); // Modelo para registrar reseñas
// Obtener todas las tarjetas del usuario
const getUserCards = async (req, res) => {
    try {
        const cards = await nfcCardModel_1.default.find({ owner: req.user.id });
        res.status(200).json({
            success: true,
            data: cards
        });
    }
    catch (error) {
        console.error('Error al obtener tarjetas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tarjetas',
            error: error.message
        });
    }
};
exports.getUserCards = getUserCards;
// Obtener una tarjeta específica
const getCardById = async (req, res) => {
    try {
        const card = await nfcCardModel_1.default.findOne({
            _id: req.params.id,
            owner: req.user.id
        });
        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Tarjeta no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: card
        });
    }
    catch (error) {
        console.error('Error al obtener tarjeta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener tarjeta',
            error: error.message
        });
    }
};
exports.getCardById = getCardById;
// Crear nueva tarjeta
const createCard = async (req, res) => {
    try {
        const { name, googleLink } = req.body;
        // Validar inputs
        if (!name || !googleLink) {
            return res.status(400).json({
                success: false,
                message: 'Nombre y enlace de Google son requeridos'
            });
        }
        // Crear tarjeta
        const card = await nfcCardModel_1.default.create({
            owner: req.user.id,
            name,
            googleLink,
            isActive: true
        });
        res.status(201).json({
            success: true,
            data: card
        });
    }
    catch (error) {
        console.error('Error al crear tarjeta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear tarjeta',
            error: error.message
        });
    }
};
exports.createCard = createCard;
// Actualizar tarjeta
const updateCard = async (req, res) => {
    try {
        const { name, googleLink, isActive } = req.body;
        // Actualizar tarjeta
        const card = await nfcCardModel_1.default.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, { name, googleLink, isActive }, { new: true, runValidators: true });
        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Tarjeta no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: card
        });
    }
    catch (error) {
        console.error('Error al actualizar tarjeta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar tarjeta',
            error: error.message
        });
    }
};
exports.updateCard = updateCard;
// Eliminar tarjeta
const deleteCard = async (req, res) => {
    try {
        const card = await nfcCardModel_1.default.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.id
        });
        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Tarjeta no encontrada'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        console.error('Error al eliminar tarjeta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar tarjeta',
            error: error.message
        });
    }
};
exports.deleteCard = deleteCard;
// Obtener estadísticas de una tarjeta
const getCardStats = async (req, res) => {
    try {
        const cardId = req.params.id;
        // Verificar que la tarjeta existe y pertenece al usuario
        const card = await nfcCardModel_1.default.findOne({
            _id: cardId,
            owner: req.user.id
        });
        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Tarjeta no encontrada'
            });
        }
        // Obtener fecha de hace 30 días
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        // Obtener escaneos diarios
        const dailyScans = await scanModel_1.default.aggregate([
            {
                $match: {
                    card: mongoose.Types.ObjectId(cardId),
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        // Obtener reseñas diarias
        const dailyReviews = await reviewModel_1.default.aggregate([
            {
                $match: {
                    card: mongoose.Types.ObjectId(cardId),
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        // Formatear datos para la respuesta
        const dailyStats = [];
        const now = new Date();
        // Generar array de 30 días
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            // Buscar datos de escaneos para este día
            const scanData = dailyScans.find(item => item._id === dateString);
            // Buscar datos de reseñas para este día
            const reviewData = dailyReviews.find(item => item._id === dateString);
            dailyStats.push({
                date: dateString,
                scans: scanData ? scanData.count : 0,
                reviews: reviewData ? reviewData.count : 0
            });
        }
        // Estadísticas semanales
        const weeklyStats = [];
        for (let i = 0; i < 4; i++) {
            const startDate = new Date();
            startDate.setDate(now.getDate() - (i + 1) * 7);
            const endDate = new Date();
            endDate.setDate(now.getDate() - i * 7 - 1);
            const weekScans = await scanModel_1.default.countDocuments({
                card: cardId,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            const weekReviews = await reviewModel_1.default.countDocuments({
                card: cardId,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            weeklyStats.unshift({
                week: `Sem ${i + 1}`,
                scans: weekScans,
                reviews: weekReviews
            });
        }
        // Calcular tasa de conversión
        const conversionRate = card.totalScans > 0
            ? (card.totalReviews / card.totalScans) * 100
            : 0;
        res.status(200).json({
            success: true,
            data: {
                dailyStats,
                weeklyStats,
                totalScans: card.totalScans,
                totalReviews: card.totalReviews,
                conversionRate
            }
        });
    }
    catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};
exports.getCardStats = getCardStats;
// Redirigir escaneo de tarjeta
const redirectCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        // Buscar la tarjeta
        const card = await nfcCardModel_1.default.findById(cardId);
        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Tarjeta no encontrada'
            });
        }
        // Verificar si la tarjeta está activa
        if (!card.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Esta tarjeta no está activa'
            });
        }
        // Registrar el escaneo
        await scanModel_1.default.create({
            card: cardId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });
        // Actualizar estadísticas de la tarjeta
        card.totalScans += 1;
        card.lastScan = new Date();
        await card.save();
        // Redirigir al enlace de Google
        res.redirect(card.googleLink);
    }
    catch (error) {
        console.error('Error al redirigir tarjeta:', error);
        res.status(500).json({
            success: false,
            message: 'Error al redirigir tarjeta',
            error: error.message
        });
    }
};
exports.redirectCard = redirectCard;
//# sourceMappingURL=nfcController.js.map