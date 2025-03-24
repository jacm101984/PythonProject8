"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.changePassword = exports.updateProfile = exports.getCurrentUser = exports.login = exports.resetPassword = exports.requestPasswordReset = exports.resendVerificationEmail = exports.verifyEmail = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const crypto_1 = __importDefault(require("crypto"));
const emailService_1 = require("../utils/emailService");
const config_1 = __importDefault(require("../config"));
// Register user
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // Validar campos requeridos
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona nombre, email y contraseña'
            });
        }
        // Check if user already exists
        const existingUser = await userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }
        // Generate verification token
        const verificationToken = crypto_1.default.randomBytes(20).toString('hex');
        // Create new user
        const user = await userModel_1.default.create({
            name,
            email,
            password,
            verificationToken,
            emailVerified: false,
            role: 'USER',
        });
        // Send verification email
        try {
            await (0, emailService_1.sendVerificationEmail)(user.email, user.name, verificationToken);
            console.log('✅ Verification email sent successfully to:', user.email);
        }
        catch (emailError) {
            console.error('❌ Failed to send verification email:', emailError);
            // Continuar el flujo aun si falla el envío de correo
        }
        // Generate JWT
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente. Por favor verifica tu correo electrónico.',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
                emailVerified: user.emailVerified,
            }
        });
    }
    catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
};
exports.register = register;
// Verify email
const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        // Find user by verification token
        const user = await userModel_1.default.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token de verificación inválido'
            });
        }
        // Update user
        user.emailVerified = true;
        user.verificationToken = undefined;
        await user.save();
        // Send welcome email
        try {
            await (0, emailService_1.sendWelcomeEmail)(user.email, user.name);
            console.log('✅ Welcome email sent successfully to:', user.email);
        }
        catch (emailError) {
            console.error('❌ Failed to send welcome email:', emailError);
            // Continuar el flujo aun si falla el envío de correo
        }
        res.json({
            success: true,
            message: 'Email verificado correctamente. Ahora puedes iniciar sesión.'
        });
    }
    catch (error) {
        console.error('Error en verificación de email:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al verificar email',
            error: error.message
        });
    }
};
exports.verifyEmail = verifyEmail;
// Resend verification email
const resendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona un email'
            });
        }
        // Find user by email
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // Check if email is already verified
        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: 'El correo ya ha sido verificado'
            });
        }
        // Generate new verification token
        const verificationToken = crypto_1.default.randomBytes(20).toString('hex');
        user.verificationToken = verificationToken;
        await user.save();
        // Send verification email
        try {
            await (0, emailService_1.sendVerificationEmail)(user.email, user.name, verificationToken);
            console.log('✅ Verification email resent successfully to:', user.email);
        }
        catch (emailError) {
            console.error('❌ Failed to resend verification email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Error al enviar el correo de verificación. Por favor, inténtalo más tarde.'
            });
        }
        res.json({
            success: true,
            message: 'Correo de verificación reenviado correctamente'
        });
    }
    catch (error) {
        console.error('Error al reenviar correo de verificación:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al reenviar correo de verificación',
            error: error.message
        });
    }
};
exports.resendVerificationEmail = resendVerificationEmail;
// Request password reset
const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona un email'
            });
        }
        // Find user by email
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            // Por seguridad, no indicamos si el email existe o no
            return res.json({
                success: true,
                message: 'Si tu email está registrado, recibirás un correo con instrucciones para restablecer tu contraseña'
            });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();
        // Send reset email
        try {
            await (0, emailService_1.sendPasswordResetEmail)(user.email, user.name, resetToken);
            console.log('✅ Password reset email sent successfully to:', user.email);
        }
        catch (emailError) {
            console.error('❌ Failed to send password reset email:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Error al enviar el correo. Por favor, inténtalo más tarde.'
            });
        }
        res.json({
            success: true,
            message: 'Si tu email está registrado, recibirás un correo con instrucciones para restablecer tu contraseña'
        });
    }
    catch (error) {
        console.error('Error al solicitar restablecimiento de contraseña:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al solicitar restablecimiento de contraseña',
            error: error.message
        });
    }
};
exports.requestPasswordReset = requestPasswordReset;
// Reset password
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona el token y la nueva contraseña'
            });
        }
        // Find user by reset token and check expiration
        const user = await userModel_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'El token es inválido o ha expirado'
            });
        }
        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({
            success: true,
            message: 'Contraseña restablecida correctamente'
        });
    }
    catch (error) {
        console.error('Error al restablecer contraseña:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al restablecer contraseña',
            error: error.message
        });
    }
};
exports.resetPassword = resetPassword;
// Login user
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona email y contraseña'
            });
        }
        // Find user by email
        const user = await userModel_1.default.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(401).json({
                success: false,
                message: 'Por favor verifica tu correo electrónico antes de iniciar sesión',
                needsVerification: true,
                email: user.email
            });
        }
        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales incorrectas'
            });
        }
        // Generate JWT
        const token = generateToken(user._id);
        res.json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token,
                emailVerified: user.emailVerified,
            }
        });
    }
    catch (error) {
        console.error('Error en inicio de sesión:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
};
exports.login = login;
// Get current user
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await userModel_1.default.findById(req.user._id).select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        console.error('Error al obtener usuario actual:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener usuario actual',
            error: error.message
        });
    }
};
exports.getCurrentUser = getCurrentUser;
// Update profile
const updateProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const userId = req.user._id;
        // Verificar que al menos un campo sea proporcionado
        if (!name && !email) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona al menos un campo para actualizar'
            });
        }
        // If email is changing, check if the new email is already in use
        if (email) {
            const existingUser = await userModel_1.default.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El correo electrónico ya está en uso'
                });
            }
        }
        // Crear objeto con los campos a actualizar
        const updateFields = {};
        if (name)
            updateFields.name = name;
        if (email)
            updateFields.email = email;
        // Update user
        const updatedUser = await userModel_1.default.findByIdAndUpdate(userId, updateFields, { new: true, runValidators: true }).select('-password -verificationToken -resetPasswordToken -resetPasswordExpires');
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            success: true,
            data: updatedUser
        });
    }
    catch (error) {
        console.error('Error al actualizar perfil:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar perfil',
            error: error.message
        });
    }
};
exports.updateProfile = updateProfile;
// Change password
const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporciona la contraseña actual y la nueva contraseña'
            });
        }
        // Find user
        const user = await userModel_1.default.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }
        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });
        }
        // Update password
        user.password = newPassword;
        await user.save();
        res.json({
            success: true,
            message: 'Contraseña actualizada correctamente'
        });
    }
    catch (error) {
        console.error('Error al cambiar contraseña:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al cambiar contraseña',
            error: error.message
        });
    }
};
exports.changePassword = changePassword;
// Logout user (para sesiones con cookies, si estás usando JWT esto no es necesario en el cliente)
const logout = (req, res) => {
    if (req.logout) {
        req.logout((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al cerrar sesión'
                });
            }
            res.json({
                success: true,
                message: 'Sesión cerrada correctamente'
            });
        });
    }
    else {
        res.json({
            success: true,
            message: 'Sesión cerrada correctamente'
        });
    }
};
exports.logout = logout;
// Generate JWT token
const generateToken = (id) => {
    try {
        const jwtSecret = config_1.default.jwtSecret || process.env.JWT_SECRET || 'your-secret-key';
        const jwtExpiresIn = config_1.default.jwtExpiresIn || process.env.JWT_EXPIRES_IN || '7d';
        return jsonwebtoken_1.default.sign({ id }, jwtSecret, { expiresIn: jwtExpiresIn });
    }
    catch (error) {
        console.error('Error al generar token JWT:', error);
        throw new Error('Error al generar token de autenticación');
    }
};
//# sourceMappingURL=authController.js.map