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
exports.Order = exports.OrderStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Enum para los estados de la orden
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["REFUNDED"] = "REFUNDED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
// Esquema para la información de envío
const ShippingInfoSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true }
});
// Esquema para los detalles de pago
const PaymentDetailsSchema = new mongoose_1.Schema({
    method: { type: String, required: true },
    externalId: { type: String },
    transactionId: { type: String }
});
// Esquema principal de Order
const OrderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    cardCount: { type: Number, required: true },
    originalAmount: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    discountCode: { type: String, default: null },
    totalAmount: { type: Number, required: true },
    promoterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    paymentMethod: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING
    },
    shippingInfo: { type: ShippingInfoSchema, required: true },
    paymentDetails: { type: PaymentDetailsSchema, required: true },
    cards: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'NfcCard' }]
}, { timestamps: true });
// Índices para mejorar el rendimiento de las consultas
OrderSchema.index({ userId: 1 });
OrderSchema.index({ promoterId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: 1 });
exports.Order = mongoose_1.default.model('Order', OrderSchema);
//# sourceMappingURL=Order.js.map