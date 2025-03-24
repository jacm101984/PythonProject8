"use strict";
// src/tests/test-email.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emailService_1 = require("../services/emailService");
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno
dotenv_1.default.config();
const runTest = async () => {
    console.log('===== INICIANDO PRUEBA DE SERVICIO DE CORREO =====');
    console.log('Enviando correo de prueba...');
    try {
        // Cambia esta dirección por tu correo real para la prueba
        const testEmail = 'tu-correo@ejemplo.com';
        const result = await (0, emailService_1.testEmailService)(testEmail);
        if (result.success) {
            console.log('===== PRUEBA EXITOSA =====');
            console.log('ID del mensaje:', result.messageId);
            console.log('Revisa tu bandeja de entrada en:', testEmail);
        }
        else {
            console.log('===== PRUEBA FALLIDA =====');
            console.log('Error:', result.error);
            console.log('Código de error:', result.code);
            console.log('Detalles:', JSON.stringify(result.details, null, 2));
        }
    }
    catch (error) {
        console.error('Error inesperado durante la prueba:', error);
    }
};
runTest();
//# sourceMappingURL=test-email.js.map