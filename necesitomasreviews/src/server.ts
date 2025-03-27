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
const http = require('http');
const { Server: SocketServer } = require('socket.io');

// Cargar variables de entorno antes de cualquier otra operación
dotenv.config();

// Verificar variables de entorno críticas
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET === 'your-secret-key') {
  console.error('⚠️ JWT_SECRET no configurado correctamente. Por favor configura esta variable en el archivo .env');
  // En producción, podrías querer terminar el proceso aquí
  // process.exit(1);
}

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET || SESSION_SECRET === 'your-secret-key') {
  console.error('⚠️ SESSION_SECRET no configurado correctamente. Por favor configura esta variable en el archivo .env');
}

// Importar rutas
let authRoutes;
try {
  authRoutes = require('./routes/authRoutes');
  console.log('✅ Rutas de autenticación cargadas correctamente');
} catch (error) {
  console.error('❌ Error al cargar las rutas de autenticación:', error && error.message);
  authRoutes = express.Router();
  authRoutes.all('*', (req, res) => {
    return res.status(501).json({ message: 'Funcionalidad de autenticación no implementada aún' });
  });
}

// Crear un router básico de administrador
const adminRouter = express.Router();
adminRouter.get('/', (req, res) => {
  return res.status(200).json({ message: 'Panel de administración (router básico)' });
});

// Intentar cargar rutas de administrador de manera segura
let adminRoutes;
try {
  // Cargar el módulo
  const adminModule = require('./routes/adminRoutes');

  // Verificar que sea un objeto (router de Express)
  if (adminModule && typeof adminModule === 'object') {
    adminRoutes = adminModule;
    console.log('✅ Rutas de administrador cargadas correctamente');
  } else {
    console.warn('⚠️ Las rutas de administrador no son un router válido, creando uno básico');
    adminRoutes = adminRouter;
  }
} catch (error) {
  console.error('❌ Error al cargar las rutas de administrador:', error && error.message);
  adminRoutes = adminRouter;
}

// Initializar router de prueba
let testRoutes = express.Router();

// Intenta importar las rutas de prueba
try {
  // Verificar si el archivo existe
  const testRoutesPath = path.join(__dirname, './routes/testRoutes.js');

  if (fs.existsSync(testRoutesPath)) {
    testRoutes = require('./routes/testRoutes');
    console.log('✅ Rutas de prueba cargadas correctamente');
  } else {
    console.warn('⚠️ Archivo de rutas de prueba no encontrado. Las rutas de prueba no estarán disponibles.');
  }
} catch (error) {
  console.error('❌ Error al verificar rutas de prueba:', error && error.message);
}

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

    // No mostrar la URI completa en los logs para evitar exponer credenciales
    const redactedUri = mongoUri.replace(/:([^@]+)@/, ':*****@');
    console.log(`Intentando conectar a MongoDB en: ${redactedUri}`);

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

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3300;

// Create HTTP server and Socket.io server
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5300',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

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

// Configuración de CORS mejorada para permitir múltiples orígenes
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5300', 'http://localhost:5301'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas solicitudes, por favor intente más tarde' }
});

// Aplicar rate limiting a todas las rutas de la API
app.use('/api/', limiter);

// Middleware
app.use(express.json({ limit: '1mb' })); // Limitar tamaño de payload
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Logging basado en el entorno
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Configuración segura de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Headers de seguridad
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

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

// Middleware de autenticación para verificar el token JWT
const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No hay token, autorización denegada'
      });
    }

    // Extraer el token
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No hay token, autorización denegada'
      });
    }

    // Verificar el token usando la clave secreta del entorno
    const decoded = jwt.verify(token, process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'));

    // Añadir la información del usuario decodificada a la solicitud
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Error al autenticar token:', error);
    return res.status(401).json({
      success: false,
      message: 'Token no válido'
    });
  }
};

// Middleware para verificar suscripción premium
const checkPremiumSubscription = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'No autenticado'
      });
    }

    const userId = req.user.id;

    // Administradores siempre tienen acceso a funciones premium
    if (['REGIONAL_ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return next();
    }

    // Buscar usuario con su suscripción
    // Simulación: en un sistema real, aquí consultarías la base de datos
    const user = {
      _id: userId,
      name: 'Usuario Simulado',
      email: 'usuario@example.com',
      subscriptionId: req.user.subscriptionId || null
    };

    if (!user.subscriptionId) {
      return res.status(403).json({
        success: false,
        error: 'Requiere suscripción premium',
        code: 'SUBSCRIPTION_REQUIRED'
      });
    }

    // Simulación de verificación de suscripción premium
    // En producción, aquí consultarías la colección de suscripciones en la base de datos
    const hasPremium = req.user.hasPremium === true;

    if (!hasPremium) {
      return res.status(403).json({
        success: false,
        error: 'Requiere suscripción premium activa',
        code: 'PREMIUM_REQUIRED'
      });
    }

    // Si todo está bien, continuar
    next();
  } catch (error) {
    console.error('Error al verificar suscripción premium:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// IMPORTANTE: Implementar rutas de autenticación directamente en server.js
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
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Crear id temporal para el usuario
    const userId = 'user-' + Date.now();

    // Generar JWT token usando la clave secreta del entorno
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Intentar enviar correo de verificación
    try {
      const emailService = require('./utils/emailService');
      await emailService.sendVerificationEmail(email, name, verificationToken);
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

    // Generar JWT token usando la clave secreta del entorno
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
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

// AÑADIDO: Ruta para obtener información del usuario actual
app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    // Simulación de recuperación de usuario
    // En producción, aquí consultarías la base de datos usando req.user.id

    return res.status(200).json({
      _id: req.user.id,
      name: 'Usuario Simulado',
      email: 'usuario@example.com',
      role: 'USER',
      emailVerified: true
    });
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener información del usuario',
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
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Intentar enviar correo de verificación
    try {
      const emailService = require('./utils/emailService');
      await emailService.sendVerificationEmail(email, 'Usuario', verificationToken);
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

// NUEVAS RUTAS PARA SISTEMA DE SUSCRIPCIÓN

// Obtener planes de suscripción disponibles
app.get('/api/subscriptions/plans', (req, res) => {
  try {
    // Definición de planes
    const plans = [
      {
        id: 'basic',
        name: 'Plan Básico',
        price: 0,
        currency: 'USD',
        description: 'Acceso básico para configurar y activar tarjetas NFC',
        features: [
          'Activación de tarjetas NFC',
          'Configuración de perfil de Google',
          'Configuración de mensajes personalizados'
        ],
        limitations: [
          'Sin estadísticas de escaneo',
          'Sin notificaciones en tiempo real',
          'Sin dashboard analítico'
        ]
      },
      {
        id: 'premium',
        name: 'Plan Premium',
        price: 19.99,
        currency: 'USD',
        billingPeriod: 'monthly',
        description: 'Acceso completo a estadísticas y notificaciones en tiempo real',
        features: [
          'Activación de tarjetas NFC',
          'Configuración de perfil de Google',
          'Estadísticas detalladas de escaneo',
          'Notificaciones en tiempo real',
          'Dashboard analítico completo',
          'Exportación de reportes'
        ]
      }
    ];

    return res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Error al obtener planes de suscripción:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Obtener la suscripción actual del usuario
app.get('/api/subscriptions/current', authMiddleware, (req, res) => {
  try {
    // Simulación: En producción consultarías la base de datos
    const hasPremium = req.user.hasPremium === true;

    if (hasPremium) {
      // Usuario con suscripción premium
      return res.status(200).json({
        success: true,
        data: {
          _id: 'sub-' + Date.now(),
          userId: req.user.id,
          plan: 'premium',
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
          endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 días en el futuro
          autoRenew: true,
          paymentMethod: 'card',
          status: 'active'
        }
      });
    } else {
      // Usuario con plan básico
      return res.status(200).json({
        success: true,
        data: {
          plan: 'basic',
          status: 'active'
        }
      });
    }
  } catch (error) {
    console.error('Error al obtener suscripción:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Crear suscripción premium
app.post('/api/subscriptions/premium', authMiddleware, (req, res) => {
  try {
    const { paymentMethod, paymentId, autoRenew } = req.body;

    if (!paymentMethod || !paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Información de pago incompleta'
      });
    }

    // Calcular fecha de finalización (1 mes después)
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Simulación de creación de suscripción
    const subscription = {
      _id: 'sub-' + Date.now(),
      userId: req.user.id,
      plan: 'premium',
      startDate: new Date(),
      endDate: endDate,
      autoRenew: autoRenew === true,
      paymentMethod,
      paymentId,
      status: 'active'
    };

    // En producción, aquí guardarías la suscripción en la base de datos
    // y actualizarías el usuario con la referencia a la suscripción

    // Simulamos actualización del token con información de premium
    const newToken = jwt.sign(
      {
        id: req.user.id,
        hasPremium: true,
        subscriptionId: subscription._id
      },
      process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      success: true,
      data: subscription,
      token: newToken
    });
  } catch (error) {
    console.error('Error al crear suscripción premium:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Cancelar suscripción
app.put('/api/subscriptions/cancel', authMiddleware, (req, res) => {
  try {
    // Simulación: En producción consultarías y actualizarías la base de datos
    const hasPremium = req.user.hasPremium === true;

    if (!hasPremium) {
      return res.status(400).json({
        success: false,
        error: 'No tienes una suscripción activa'
      });
    }

    // Simulación de cancelación
    const subscription = {
      _id: 'sub-' + Date.now(),
      userId: req.user.id,
      plan: 'premium',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 días en el futuro
      autoRenew: false,
      paymentMethod: 'card',
      status: 'canceled'
    };

    // Simulamos actualización del token con información actualizada
    const newToken = jwt.sign(
      {
        id: req.user.id,
        hasPremium: true, // Mantener premium hasta el final del período
        subscriptionId: subscription._id
      },
      process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Suscripción cancelada correctamente',
      data: subscription,
      token: newToken
    });
  } catch (error) {
    console.error('Error al cancelar suscripción:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Actualizar renovación automática
app.put('/api/subscriptions/auto-renew', authMiddleware, (req, res) => {
  try {
    const { autoRenew } = req.body;

    if (autoRenew === undefined) {
      return res.status(400).json({
        success: false,
        error: 'El valor de autoRenew es requerido'
      });
    }

    // Simulación: En producción consultarías y actualizarías la base de datos
    const hasPremium = req.user.hasPremium === true;

    if (!hasPremium) {
      return res.status(400).json({
        success: false,
        error: 'No tienes una suscripción activa'
      });
    }

    // Simulación de actualización
    const subscription = {
      _id: 'sub-' + Date.now(),
      userId: req.user.id,
      plan: 'premium',
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
      endDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 días en el futuro
      autoRenew: autoRenew,
      paymentMethod: 'card',
      status: 'active'
    };

    return res.status(200).json({
      success: true,
      message: `Renovación automática ${autoRenew ? 'activada' : 'desactivada'}`,
      data: subscription
    });
  } catch (error) {
    console.error('Error al actualizar renovación automática:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// RUTAS DE EVENTOS NFC Y NOTIFICACIONES (Simuladas)

// Registrar escaneo de tarjeta
app.post('/api/events/cards/:cardId/scan', (req, res) => {
  try {
    const { cardId } = req.params;
    const { latitude, longitude } = req.body;

    console.log(`Escaneo registrado para tarjeta ${cardId}`);

    // En producción, aquí guardarías el evento en la base de datos
    // y enviarías notificación al usuario premium

    return res.status(200).json({
      success: true,
      message: 'Evento registrado correctamente',
      redirectUrl: `https://search.google.com/local/writereview?placeid=dummy-place-id-${cardId}`
    });
  } catch (error) {
    console.error('Error al registrar evento de escaneo:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Obtener estadísticas de tarjeta (solo premium)
app.get('/api/events/cards/:cardId/stats', authMiddleware, checkPremiumSubscription, (req, res) => {
  try {
    const { cardId } = req.params;

    // Simulación de estadísticas
    const randomCount = () => Math.floor(Math.random() * 20) + 1;

    // Generar datos simulados para dashboard
    const dailyStats = [];
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      dailyStats.push({
        date: dateString,
        scans: randomCount(),
        reviewsStarted: randomCount() - Math.floor(Math.random() * 5),
        reviewsCompleted: randomCount() - Math.floor(Math.random() * 10)
      });
    }

    // Generar horas populares
    const popularHours = Array(24).fill().map((_, hour) => ({
      hour,
      count: Math.floor(Math.random() * 10)
    }));

    // Generar eventos recientes
    const eventTypes = ['scan', 'review_started', 'review_completed'];
    const recentEvents = Array(10).fill().map((_, i) => {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const timestamp = new Date(now);
      timestamp.setHours(timestamp.getHours() - i);

      return {
        id: `event-${Date.now()}-${i}`,
        type: eventType,
        timestamp: timestamp.toISOString(),
        deviceInfo: {
          type: Math.random() > 0.5 ? 'mobile' : 'desktop',
          browser: 'Chrome',
          os: Math.random() > 0.5 ? 'Android' : 'iOS'
        },
        location: Math.random() > 0.3 ? {
          latitude: 19.4326 + (Math.random() - 0.5) * 0.1,
          longitude: -99.1332 + (Math.random() - 0.5) * 0.1
        } : undefined,
        reviewRating: eventType === 'review_completed' ? Math.floor(Math.random() * 5) + 1 : undefined
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        card: {
          id: cardId,
          name: `Tarjeta #${cardId}`,
          status: 'active',
          createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        counts: {
          scans: 156,
          reviewsStarted: 83,
          reviewsCompleted: 47
        },
        conversionRates: {
          scanToReviewStartRate: 53.2,
          reviewStartToCompleteRate: 56.6,
          scanToReviewCompleteRate: 30.1
        },
        dailyStats,
        popularHours,
        recentEvents
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de tarjeta:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Obtener estadísticas globales (solo premium)
app.get('/api/events/user/stats', authMiddleware, checkPremiumSubscription, (req, res) => {
  try {
    // Simulación de estadísticas globales
    const randomCount = () => Math.floor(Math.random() * 50) + 10;

    // Generar datos simulados para dashboard
    const dailyStats = [];
    const now = new Date();

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      dailyStats.push({
        date: dateString,
        scans: randomCount(),
        reviewsStarted: randomCount() - Math.floor(Math.random() * 15),
        reviewsCompleted: randomCount() - Math.floor(Math.random() * 25)
      });
    }

    // Simular estadísticas por tarjeta
    const cardStats = Array(5).fill().map((_, i) => {
      const scans = randomCount();
      const reviews = Math.floor(scans * (0.2 + Math.random() * 0.3));

      return {
        id: `card-${i + 1}`,
        name: `Tarjeta #${i + 1}`,
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        scans,
        reviews,
        conversionRate: parseFloat(((reviews / scans) * 100).toFixed(2)),
        lastScan: new Date(now.getTime() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalCards: cardStats.length,
        totalScans: 389,
        totalReviews: 117,
        conversionRate: 30.1,
        dailyStats,
        cardStats
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas globales:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// RUTAS DE NOTIFICACIONES (Solo premium)

// Obtener notificaciones
app.get('/api/notifications', authMiddleware, checkPremiumSubscription, (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Simulación de notificaciones
    const generateNotification = (index, read = false) => {
      const now = new Date();
      const timestamp = new Date(now);
      timestamp.setHours(timestamp.getHours() - index);

      const isReviewEvent = Math.random() > 0.6;
      const eventType = isReviewEvent ? 'review_completed' : 'scan';
      const cardId = `card-${Math.floor(Math.random() * 5) + 1}`;
      const businessName = `Negocio ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;

      return {
        _id: `notif-${Date.now()}-${index}`,
        userId: req.user.id,
        cardId,
        businessId: `business-${Math.floor(Math.random() * 10) + 1}`,
        eventType,
        title: isReviewEvent ? '¡Nueva reseña recibida!' : '¡Tarjeta escaneada!',
        message: isReviewEvent
          ? `Se ha completado una reseña para ${businessName}.`
          : `Tu tarjeta para ${businessName} ha sido escaneada.`,
        read,
        data: {
          cardId,
          businessName,
          timestamp: timestamp.toISOString()
        },
        timestamp: timestamp.toISOString()
      };
    };

    // Generar notificaciones de prueba
    const totalNotifications = 35;
    const totalUnread = 8;

    let notifications = [];
    for (let i = 0; i < totalNotifications; i++) {
      notifications.push(generateNotification(i, i >= totalUnread));
    }

    // Filtrar si se solicitan solo no leídas
    if (unreadOnly === 'true') {
      notifications = notifications.filter(n => !n.read);
    }

    // Paginar resultados
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginatedNotifications = notifications.slice(startIndex, endIndex);

    return res.status(200).json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          total: notifications.length,
          totalPages: Math.ceil(notifications.length / limitNum),
          currentPage: pageNum,
          limit: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Marcar notificaciones como leídas
app.put('/api/notifications/read', authMiddleware, checkPremiumSubscription, (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un array de IDs de notificaciones'
      });
    }

    // Simulación de actualización
    // En producción, aquí actualizarías la base de datos

    return res.status(200).json({
      success: true,
      message: `${ids.length} notificación(es) marcada(s) como leída(s)`
    });
  } catch (error) {
    console.error('Error al marcar notificaciones como leídas:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Marcar todas las notificaciones como leídas
app.put('/api/notifications/read-all', authMiddleware, checkPremiumSubscription, (req, res) => {
  try {
    // Simulación de actualización
    // En producción, aquí actualizarías la base de datos

    return res.status(200).json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    });
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Eliminar notificación
app.delete('/api/notifications/:id', authMiddleware, checkPremiumSubscription, (req, res) => {
  try {
    const { id } = req.params;

    // Simulación de eliminación
    // En producción, aquí eliminarías de la base de datos

    return res.status(200).json({
      success: true,
      message: 'Notificación eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Registrar token FCM para notificaciones push
app.post('/api/notifications/fcm-token', authMiddleware, checkPremiumSubscription, (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token FCM requerido'
      });
    }

    // Simulación de registro de token
    // En producción, aquí actualizarías el usuario en la base de datos

    return res.status(200).json({
      success: true,
      message: 'Token FCM registrado correctamente'
    });
  } catch (error) {
    console.error('Error al registrar token FCM:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Eliminar token FCM
app.delete('/api/notifications/fcm-token', authMiddleware, checkPremiumSubscription, (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token FCM requerido'
      });
    }

    // Simulación de eliminación de token
    // En producción, aquí actualizarías el usuario en la base de datos

    return res.status(200).json({
      success: true,
      message: 'Token FCM eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar token FCM:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Actualizar preferencias de notificación
app.put('/api/notifications/preferences', authMiddleware, checkPremiumSubscription, (req, res) => {
  try {
    const { emailNotifications, pushNotifications, dailyReports } = req.body;

    if (emailNotifications === undefined &&
        pushNotifications === undefined &&
        dailyReports === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere al menos una preferencia para actualizar'
      });
    }

    // Simulación de actualización de preferencias
    // En producción, aquí actualizarías el usuario en la base de datos

    return res.status(200).json({
      success: true,
      message: 'Preferencias de notificación actualizadas correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar preferencias de notificación:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Montar rutas de la API
// app.use('/api/auth', authRoutes);

// Añadir la ruta de prueba solo en entornos de desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/test', testRoutes);
  console.log('🧪 Rutas de prueba habilitadas en /api/test');
}

// Montar rutas de administrador - Simplificado para evitar errores
app.use('/api/admin', adminRoutes);
console.log('👑 Rutas de administrador habilitadas en /api/admin');

// Otras rutas que se añadirán a medida que estén disponibles
// app.use('/api/users', userRoutes);
// app.use('/api/nfc', nfcRoutes);
// app.use('/api/promoter', promoterRoutes);
// app.use('/api/checkout', checkoutRoutes);

// Ruta para probar correo electrónico directamente
// Esta es una ruta temporal para desarrollo que puedes comentar cuando implementes testRoutes completo
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere una dirección de correo para la prueba'
      });
    }

    // Importar el servicio de email
    try {
      const emailService = require('./utils/emailService');
      console.log(`Intentando enviar correo de prueba a ${email}`);

      await emailService.sendTestEmail(email);

      return res.status(200).json({
        success: true,
        message: `Correo de prueba enviado a ${email}`
      });
    } catch (emailError) {
      console.error('Error al importar o usar el servicio de email:', emailError);
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
      const emailService = require('./utils/emailService');
      const mockToken = `test-token-${Date.now()}`;
      await emailService.sendVerificationEmail(email, name, mockToken);
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

// Configurar Socket.IO para notificaciones en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Autenticar usuario y asociar socket con userId
  socket.on('authenticate', (token) => {
    try {
      // En un sistema real, verificarías el JWT aquí
      // Por simplicidad, asumimos que el token es el userId
      const userId = token;

      if (!userId) {
        socket.emit('error', { message: 'Autenticación inválida' });
        return;
      }

      // Unirse a la sala del usuario para poder enviar mensajes específicos
      socket.join(userId);

      console.log(`Usuario ${userId} autenticado, socket: ${socket.id}`);
      socket.emit('authenticated', { success: true });

      // Enviar algunas notificaciones no leídas al conectarse
      const unreadNotifications = [];
      for (let i = 0; i < 3; i++) {
        unreadNotifications.push({
          _id: `notif-${Date.now()}-${i}`,
          title: `Notificación de prueba #${i + 1}`,
          message: 'Esta es una notificación de prueba generada al conectarse',
          timestamp: new Date().toISOString(),
          read: false
        });
      }

      if (unreadNotifications.length > 0) {
        socket.emit('unread_notifications', unreadNotifications);
      }
    } catch (error) {
      console.error('Error durante autenticación de socket:', error);
      socket.emit('error', { message: 'Error de autenticación' });
    }
  });

  // Marcar notificaciones como leídas
  socket.on('mark_read', (data) => {
    try {
      const { notificationIds } = data;

      if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
        socket.emit('error', { message: 'IDs de notificación inválidos' });
        return;
      }

      // Simulación de actualización en base de datos
      console.log(`Marcando como leídas: ${notificationIds.join(', ')}`);

      socket.emit('notifications_marked_read', { success: true, notificationIds });
    } catch (error) {
      console.error('Error al marcar notificaciones como leídas:', error);
      socket.emit('error', { message: 'Error al actualizar notificaciones' });
    }
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
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
server.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en el puerto ${PORT}`);
  console.log(`🌐 URL de la API: http://localhost:${PORT}/api`);
  console.log(`🧪 Ruta de prueba de correo: http://localhost:${PORT}/api/test-email`);
  console.log(`🔐 Ruta de registro: http://localhost:${PORT}/api/auth/register`);
  console.log(`👤 Ruta de info de usuario: http://localhost:${PORT}/api/auth/me`);
  console.log(`💎 Ruta de planes de suscripción: http://localhost:${PORT}/api/subscriptions/plans`);
  console.log(`📊 Ruta de estadísticas (premium): http://localhost:${PORT}/api/events/cards/:cardId/stats`);
  if (process.env.CLIENT_URL) {
    console.log(`📱 URL del cliente: ${process.env.CLIENT_URL}`);
  }
});

// Cierre elegante del servidor
const gracefulShutdown = () => {
  console.log('Recibida señal de cierre...');
  server.close(() => {
    console.log('Servidor HTTP cerrado');
    mongoose.connection.close(false, () => {
      console.log('Conexión a MongoDB cerrada');
      process.exit(0);
    });
  });

  // Si el servidor no se cierra en 10 segundos, forzar salida
  setTimeout(() => {
    console.error('No se pudo cerrar elegantemente, forzando salida');
    process.exit(1);
  }, 10000);
};

// Capturar señales de cierre
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // La aplicación continúa ejecutándose, pero en producción podrías querer cerrarla
  // Si es crítico, puedes terminar: process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // La aplicación continúa ejecutándose, pero en producción podrías querer cerrarla
  // Si es crítico, puedes terminar: process.exit(1);
});

module.exports = app;