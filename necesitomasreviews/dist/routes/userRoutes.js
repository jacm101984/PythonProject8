"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// All routes are protected
router.use(authMiddleware_1.protect);
// User profile
router.put('/profile', userController_1.updateProfile);
router.put('/password', userController_1.changePassword);
router.get('/dashboard', userController_1.getUserDashboard);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map