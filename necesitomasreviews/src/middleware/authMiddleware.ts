import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import config from '../config';

// Extiende la interfaz Request directamente
declare module 'express' {
  interface Request {
    user?: any;
  }
}

// Middleware para proteger rutas - verifica el token JWT
export const protect = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    let token;

    // Verificar si el token está en el header de Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Obtener el token del header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      // Alternativamente, verificar si el token está en cookies
      token = req.cookies.token;
    }

    // Verificar que el token exista
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, no se proporcionó token'
      });
    }

    try {
      // Verificar el token con un manejo más robusto de la clave secreta
      const jwtSecret = config.jwtSecret || process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, jwtSecret) as any;

      // Obtener el usuario del token y excluir la contraseña
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'No autorizado, usuario no encontrado'
        });
      }

      // Añadir el usuario a la solicitud
      req.user = user;
      next();
    } catch (error) {
      console.error('Error de verificación de token:', error);
      return res.status(401).json({
        success: false,
        message: 'No autorizado, token inválido o expirado'
      });
    }
  } catch (error) {
    console.error('Error en middleware de protección:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Middleware para restringir acceso por roles
export const authorize = (...roles: string[]) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Verificar si el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Verificar si el usuario tiene alguno de los roles requeridos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para realizar esta acción'
      });
    }

    next();
  };
};