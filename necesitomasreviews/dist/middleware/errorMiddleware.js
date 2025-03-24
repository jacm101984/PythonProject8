"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorMiddleware.js.map