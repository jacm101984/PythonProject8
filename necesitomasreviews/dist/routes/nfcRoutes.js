"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Rutas para tarjetas NFC (src/routes/nfcRoutes.ts)
const express_1 = __importDefault(require("express"));
const nfcController_1 = require("../controllers/nfcController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Rutas protegidas
router.use('/cards', authMiddleware_1.protect);
router.route('/cards').get(nfcController_1.getUserCards).post(nfcController_1.createCard);
router.route('/cards/:id').get(nfcController_1.getCardById).put(nfcController_1.updateCard).delete(nfcController_1.deleteCard);
router.route('/cards/:id/stats').get(nfcController_1.getCardStats);
// Ruta pública para redirección de escaneos
router.get('/redirect/:id', nfcController_1.redirectCard);
exports.default = router;
//# sourceMappingURL=nfcRoutes.js.map