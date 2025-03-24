"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCode = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Esquema principal de PromoCode
const PromoCodeSchema = new mongoose_1.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        default: null
    },
    maxUses: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    promoterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });
// Método para verificar si un código promocional es válido
PromoCodeSchema.methods.isValid = function () {
    // Verificar si está activo
    if (!this.isActive)
        return false;
    // Verificar si ha expirado
    if (this.expiresAt && new Date() > this.expiresAt)
        return false;
    // Verificar si se ha alcanzado el límite de usos
    if (this.maxUses !== null && this.usedCount >= this.maxUses)
        return false;
    return true;
};
// Índices para mejorar el rendimiento de las consultas
PromoCodeSchema.index({ code: 1 }, { unique: true });
PromoCodeSchema.index({ promoterId: 1 });
PromoCodeSchema.index({ isActive: 1, expiresAt: 1 });
exports.PromoCode = mongoose_1.default.model('PromoCode', PromoCodeSchema);
//# sourceMappingURL=PromoCode.js.map