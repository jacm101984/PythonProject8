"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/dashboardRoutes.ts
const express_1 = __importDefault(require("express"));
const dashboardController_1 = __importDefault(require("../controllers/dashboardController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Proteger todas las rutas de dashboard con autenticación
router.use(authMiddleware_1.authenticate);
// Ruta para obtener estadísticas generales del dashboard
router.get('/stats', dashboardController_1.default.getDashboardStats);
// Ruta para obtener la actividad reciente del usuario
router.get('/activity', dashboardController_1.default.getUserActivity);
// Ruta para estadísticas específicas de promotores
router.get('/promoter-stats', dashboardController_1.default.getPromoterStats);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map