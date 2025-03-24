// src/tests/test-email.ts

import { testEmailService } from '../services/emailService';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const runTest = async () => {
  console.log('===== INICIANDO PRUEBA DE SERVICIO DE CORREO =====');
  console.log('Enviando correo de prueba...');

  try {
    // Cambia esta dirección por tu correo real para la prueba
    const testEmail = 'tu-correo@ejemplo.com';

    const result = await testEmailService(testEmail);

    if (result.success) {
      console.log('===== PRUEBA EXITOSA =====');
      console.log('ID del mensaje:', result.messageId);
      console.log('Revisa tu bandeja de entrada en:', testEmail);
    } else {
      console.log('===== PRUEBA FALLIDA =====');
      console.log('Error:', result.error);
      console.log('Código de error:', result.code);
      console.log('Detalles:', JSON.stringify(result.details, null, 2));
    }
  } catch (error) {
    console.error('Error inesperado durante la prueba:', error);
  }
};

runTest();