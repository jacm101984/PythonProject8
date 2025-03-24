"use strict";
// src/config/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    // JWT Secret
    jwtSecret: process.env.JWT_SECRET || 'tu_secreto_seguro_para_jwt',
    // Tiempo de expiración del token JWT
    jwtExpiresIn: '30d',
    // URL del frontend para los enlaces de verificación
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    // MongoDB connection string
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/necesitomasreviews',
    // Puerto del servidor
    port: parseInt(process.env.PORT || '3000', 10),
    // Entorno de la aplicación
    nodeEnv: process.env.NODE_ENV || 'development',
    // Opciones de cookies
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },
};
exports.default = config;
//# sourceMappingURL=index.js.map