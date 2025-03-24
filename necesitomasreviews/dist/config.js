"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// config.ts
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno
dotenv_1.default.config();
const config = {
    // Entorno
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3300'),
    // URLs
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5300',
    frontendUrl: process.env.CLIENT_URL || 'http://localhost:5300', // Alias para mantener compatibilidad
    // Base de datos
    mongodbUri: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/necesitomasreviews',
    // JWT
    jwtSecret: process.env.JWT_SECRET || 'necesitomasreviews-secure-jwt-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    // Email
    email: {
        host: process.env.EMAIL_HOST || 'smtp.godaddy.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        user: process.env.EMAIL_USER || 'contacto@necesitomasreviews.com',
        password: process.env.EMAIL_PASSWORD || '',
    },
    // PayPal
    paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID || '',
        clientSecret: process.env.PAYPAL_SECRET || '',
        mode: process.env.PAYPAL_MODE || 'sandbox'
    },
    // WebPay Plus
    webpay: {
        commerceCode: process.env.WEBPAY_COMMERCE_CODE || '',
        apiKey: process.env.WEBPAY_API_KEY || '',
        mode: process.env.WEBPAY_MODE || 'development'
    },
    // MercadoPago
    mercadoPago: {
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
        mode: process.env.MERCADOPAGO_MODE || 'sandbox'
    },
    // CORS
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5300'
};
exports.default = config;
//# sourceMappingURL=config.js.map