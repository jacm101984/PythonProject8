// src/routes/testRoutes.ts

import express from 'express';
import { sendTestEmail, sendVerificationEmail } from '../utils/emailService';

const router = express.Router();

/**
 * @route   GET /api/test
 * @desc    Ruta de prueba básica para verificar que el enrutador funciona
 * @access  Public (solo para desarrollo)
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rutas de prueba funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   POST /api/test/email
 * @desc    Envía un correo de prueba genérico
 * @access  Public (solo para desarrollo)
 */
router.post('/email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere una dirección de correo para la prueba'
      });
    }

    console.log(`Iniciando prueba de envío de correo a ${email}`);

    await sendTestEmail(email);

    return res.status(200).json({
      success: true,
      message: `Correo de prueba enviado a ${email}`
    });
  } catch (error) {
    console.error('Error al enviar correo de prueba:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al enviar correo de prueba',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/test/verification-email
 * @desc    Envía un correo de verificación de prueba
 * @access  Public (solo para desarrollo)
 */
router.post('/verification-email', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere email y nombre para la prueba'
      });
    }

    console.log(`Iniciando prueba de envío de correo de verificación a ${email}`);

    // Crear un token de verificación de prueba
    const testToken = `test-token-${Date.now()}`;

    await sendVerificationEmail(email, name, testToken);

    return res.status(200).json({
      success: true,
      message: `Correo de verificación enviado a ${email}`,
      testToken
    });
  } catch (error) {
    console.error('Error al enviar correo de verificación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al enviar correo de verificación',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/test/config
 * @desc    Muestra la configuración actual del servidor (sin mostrar secretos)
 * @access  Public (solo para desarrollo)
 */
router.get('/config', (req, res) => {
  // Crear objeto con la configuración que es segura mostrar
  const safeConfig = {
    environment: process.env.NODE_ENV || 'development',
    server: {
      port: process.env.PORT || 3300,
      clientUrl: process.env.CLIENT_URL || 'http://localhost:5300',
      corsOrigin: process.env.CORS_ORIGIN || ['http://localhost:5300', 'http://localhost:5301']
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      user: process.env.EMAIL_USER
      // No incluir contraseña por seguridad
    },
    database: {
      uri: process.env.MONGODB_URI ? 'Configurado (oculto por seguridad)' : 'No configurado',
      connected: mongoose.connection.readyState === 1 // 1 = conectado
    }
  };

  try {
    // Importar mongoose para verificar el estado de la conexión
    const mongoose = require('mongoose');
    safeConfig.database.connected = mongoose.connection.readyState === 1;
  } catch (error) {
    safeConfig.database.connected = false;
  }

  res.status(200).json({
    success: true,
    config: safeConfig,
    timestamp: new Date().toISOString()
  });
});

export = router;