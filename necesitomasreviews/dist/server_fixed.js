const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const { rateLimit } = require('express-rate-limit');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Cargar variables de entorno antes de cualquier otra operación
dotenv.config();

// Crear router para administrador directamente
const adminRouter = express.Router();
adminRouter.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Panel de administración',
    stats: {
      totalUsers: 150,
      activeUsers: 120,
      totalCards: 280,
      totalOrders: 75
    }
  });
});

adminRouter.get('/users', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Lista de usuarios',
    data: [
      { id: 1, name: 'Usuario Demo 1', email: 'usuario1@example.com', role: 'USER' },
      { id: 2, name: 'Usuario Demo 2', email: 'usuario2@example.com', role: 'USER' },
      { id: 3, name: 'Admin Demo', email: 'admin@example.com', role: 'ADMIN' }
    ]
  });
});

adminRouter.get('/orders', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Gestión de órdenes',
    data: [
      { id: 1, user: 'Usuario 1', amount: 59.99, status: 'Completed' },
      { id: 2, user: 'Usuario 2', amount: 29.99, status: 'Processing' },
      { id: 3, user: 'Usuario 3', amount: 79.99, status: 'Completed' }
    ]
  });
});

adminRouter.get('/nfc-cards', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Gestión de tarjetas NFC',
    data: [
      { id: 1, user: 'Usuario 1', status: 'Active', scans: 45 },
      { id: 2, user: 'Usuario 2', status: 'Inactive', scans: 0 },
      { id: 3, user: 'Usuario 3', status: 'Active', scans: 127 }
    ]
  });
});

adminRouter.get('/stats', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Estadísticas generales',
    data: {
      totalUsers: 150,
      totalCards: 275,
      activeCards: 183,
      totalScans: 1450
    }
  });
});

// Uso directo del router de administrador
const adminRoutes = adminRouter;

// Crear router para pruebas
const testRouter = express.Router();
testRouter.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Ruta de prueba funcionando correctamente'
  });
});

// Uso directo del router de prueba
const testRoutes = testRouter;

// Define el middleware de error directamente para evitar problemas de importación
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

// Implementación directa de la conexión a la base de datos
const connectDB = async () => {
  try {
    // Usar MONGODB_URI como primera opción (como se define en él .env),
    // MONGO_URI como segunda opción, o una URL local por defecto
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/necesitomasreviews';
    console.log(`Intentando conectar a MongoDB en: ${mongoUri}`);

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      family: 4 // Forzar IPv4
    });

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión a MongoDB: ${error && error.message}`);
    console.warn("⚠️ La aplicación continuará sin conexión a la base de datos");
  }
};

// Servicio de email simulado
const emailServiceMock = {
  sendVerificationEmail: async (email, name, token) => {
    console.log(`[EMAIL SIMULADO] Enviando correo de verificación a ${email} para ${name} con token ${token}`);
    return true;
  },
  sendTestEmail: async (email) => {
    console.log(`[EMAIL SIMULADO] Enviando correo de prueba a ${email}`);
    return true;
  }
};

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3300;

// Connect to database
connectDB();

// Verificar variables de entorno críticas
console.log('Verificando configuración de variables de entorno:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'no definido (usando development)'}`);
console.log(`- PORT: ${PORT}`);
console.log(`- CLIENT_URL: ${process.env.CLIENT_URL || 'no definido (usando default)'}`);
console.log(`- EMAIL_HOST: ${process.env.EMAIL_HOST || 'no definido (¡CRÍTICO!)'}`);

if (!process.env.EMAIL_HOST) {
  console.warn('⚠️ EMAIL_HOST no está definido - El envío de correos puede fallar');
}

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : ['http://localhost:5300', 'http://localhost:5301'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Rutas básicas para verificar el estado del servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// IMPORTANTES: Implementar rutas de autenticación directamente
// Ruta de registro
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar campos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona nombre, email y contraseña'
      });
    }

    // Generar token de verificación
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Crear id temporal para el usuario
    const userId = 'user-' + Date.now();

    // Generar JWT token
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Intentar enviar correo de verificación
    try {
      await emailServiceMock.sendVerificationEmail(email, name, verificationToken);
      console.log(`✅ Correo de verificación enviado a ${email}`);
    } catch (emailError) {
      console.error('❌ Error al enviar correo de verificación:', emailError);
      // Continuamos aunque falle el envío de correo
    }

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente. Por favor verifica tu correo electrónico.',
      data: {
        _id: userId,
        name,
        email,
        role: 'USER',
        token,
        emailVerified: false
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error && error.message
    });
  }
});

// Ruta de login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación de campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona email y contraseña'
      });
    }

    // Simulación de login exitoso
    const userId = 'user-' + Date.now();

    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      data: {
        _id: userId,
        name: 'Usuario Simulado',
        email,
        role: 'USER',
        token,
        emailVerified: true
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error && error.message
    });
  }
});

// Mantener la ruta de verificación de email
app.get('/api/auth/verify-email/:token', (req, res) => {
  const { token } = req.params;

  // Simulación de verificación exitosa
  return res.status(200).json({
    success: true,
    message: 'Email verificado correctamente. Ahora puedes iniciar sesión.'
  });
});

// Ruta para reenviar email de verificación
app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona un email'
      });
    }

    // Generar nuevo token de verificación
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Intentar enviar correo de verificación
    try {
      await emailServiceMock.sendVerificationEmail(email, 'Usuario', verificationToken);
      console.log(`✅ Correo de verificación reenviado a ${email}`);
    } catch (emailError) {
      console.error('❌ Error al reenviar correo de verificación:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error al enviar el correo de verificación'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Correo de verificación reenviado correctamente'
    });
  } catch (error) {
    console.error('Error al reenviar verificación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al procesar la solicitud',
      error: error && error.message
    });
  }
});

// Añadir la ruta de prueba solo en entornos de desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/test', testRoutes);
  console.log('🧪 Rutas de prueba habilitadas en /api/test');
}

// Montar rutas de administrador
app.use('/api/admin', adminRoutes);
console.log('👑 Rutas de administrador habilitadas en /api/admin');

// Ruta para probar correo electrónico directamente
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere una dirección de correo para la prueba'
      });
    }

    // Simulación de envío de correo de prueba
    try {
      await emailServiceMock.sendTestEmail(email);

      return res.status(200).json({
        success: true,
        message: `Correo de prueba enviado a ${email}`
      });
    } catch (emailError) {
      console.error('Error al enviar correo de prueba:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Error al enviar correo de prueba',
        error: emailError && emailError.message
      });
    }
  } catch (error) {
    console.error('Error en la ruta de prueba de email:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error && error.message
    });
  }
});

// Rutas temporales para desarrollo/prueba
app.post('/api/auth/register-basic', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Simular registro exitoso
    console.log(`Registro básico: ${name}, ${email}`);

    // Intenta enviar correo si el servicio está disponible
    try {
      const mockToken = `test-token-${Date.now()}`;
      await emailServiceMock.sendVerificationEmail(email, name, mockToken);
      console.log(`Correo de verificación enviado a ${email} con token: ${mockToken}`);
    } catch (emailError) {
      console.error('Error al enviar correo de verificación:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado. Por favor verifica tu correo electrónico.',
      data: {
        id: 'user-' + Date.now(),
        name,
        email,
        emailVerified: false
      }
    });
  } catch (error) {
    console.error('Error en registro básico:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor al procesar el registro',
      error: error && error.message
    });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`🌐 URL de la API: http://localhost:${PORT}/api`);
  console.log(`🧪 Ruta de prueba de correo: http://localhost:${PORT}/api/test-email`);
  console.log(`🔐 Ruta de registro: http://localhost:${PORT}/api/auth/register`);
  if (process.env.CLIENT_URL) {
    console.log(`📱 URL del cliente: ${process.env.CLIENT_URL}`);
  }
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // La aplicación continúa ejecutándose
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // La aplicación continúa ejecutándose
});

module.exports = app;