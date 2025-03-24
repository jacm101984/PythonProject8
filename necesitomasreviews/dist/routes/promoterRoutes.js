"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/promoterRoutes.ts
const express_1 = __importDefault(require("express"));
const promoterController_1 = require("../controllers/promoterController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// All routes are protected and require promoter role
router.use(authMiddleware_1.protect);
router.use((0, authMiddleware_1.authorize)('PROMOTER'));
// Dashboard
router.get('/dashboard', promoterController_1.getDashboardStats);
// Discount codes
router.get('/discount-codes', promoterController_1.getDiscountCodes);
router.post('/discount-codes', promoterController_1.createDiscountCode);
router.put('/discount-codes/:id', promoterController_1.updateDiscountCode);
// Orders
router.get('/orders', promoterController_1.getPromoterOrders);
router.put('/orders/:id/status', promoterController_1.updateOrderStatus);
// Commissions
router.get('/commissions', promoterController_1.getCommissions);
exports.default = router;
//# sourceMappingURL=promoterRoutes.js.map