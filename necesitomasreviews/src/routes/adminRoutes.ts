const express = require('express');
const router = express.Router();

// Middleware que simula la verificación de autenticación
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // En producción, aquí verificarías el token JWT
    req.user = { id: 'temp-user-id', role: 'SUPER_ADMIN' };
    next();
  } else {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, inicie sesión para continuar'
    });
  }
};

// Middleware que simula la verificación de roles de administrador
const requireAdmin = (req, res, next) => {
  if (req.user && ['SUPER_ADMIN', 'REGIONAL_ADMIN'].includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Prohibido: Se requieren privilegios de administrador'
    });
  }
};

// Aplicar middleware a todas las rutas
router.use(requireAuth);
router.use(requireAdmin);

// Ruta principal del dashboard
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenido al panel de administración',
    user: req.user
  });
});

// Gestión de usuarios
router.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Lista de usuarios',
    data: [
      { id: 1, name: 'Usuario Demo 1', email: 'usuario1@example.com', role: 'USER' },
      { id: 2, name: 'Usuario Demo 2', email: 'usuario2@example.com', role: 'USER' },
      { id: 3, name: 'Admin Demo', email: 'admin@example.com', role: 'ADMIN' }
    ]
  });
});

// Gestión de órdenes
router.get('/orders', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Gestión de órdenes',
    data: [
      { id: 1, user: 'Usuario 1', amount: 59.99, status: 'Completed' },
      { id: 2, user: 'Usuario 2', amount: 29.99, status: 'Processing' },
      { id: 3, user: 'Usuario 3', amount: 79.99, status: 'Completed' }
    ]
  });
});

// Gestión de tarjetas NFC
router.get('/nfc-cards', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Gestión de tarjetas NFC',
    data: [
      { id: 1, user: 'Usuario 1', status: 'Active', scans: 45 },
      { id: 2, user: 'Usuario 2', status: 'Inactive', scans: 0 },
      { id: 3, user: 'Usuario 3', status: 'Active', scans: 127 }
    ]
  });
});

// Estadísticas generales
router.get('/stats', (req, res) => {
  res.status(200).json({
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

module.exports = router;