"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const config_1 = __importDefault(require("../config"));
// Middleware para proteger rutas - verifica el token JWT
const protect = async (req, res, next) => {
    try {
        let token;
        // Verificar si el token está en el header de Authorization
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Obtener el token del header
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.cookies?.token) {
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
            const jwtSecret = config_1.default.jwtSecret || process.env.JWT_SECRET || 'your-secret-key';
            const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
            // Obtener el usuario del token y excluir la contraseña
            const user = await userModel_1.default.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'No autorizado, usuario no encontrado'
                });
            }
            // Añadir el usuario a la solicitud
            req.user = user;
            next();
        }
        catch (error) {
            console.error('Error de verificación de token:', error);
            return res.status(401).json({
                success: false,
                message: 'No autorizado, token inválido o expirado'
            });
        }
    }
    catch (error) {
        console.error('Error en middleware de protección:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
exports.protect = protect;
// Middleware para restringir acceso por roles
const authorize = (...roles) => {
    return (req, res, next) => {
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
exports.authorize = authorize;
//# sourceMappingURL=authMiddleware.js.map