"use strict";
// src/utils/emailService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendPasswordResetEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
// Configuración del transportador de correo para Outlook/Office365
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp-mail.outlook.com', // Servidor SMTP de Outlook
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: 'contacto@necesitomasreviews.com',
        pass: 'QWEasdZXC123',
    },
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    }
});
// Verificar la conexión con el servidor de correo
transporter.verify()
    .then(() => {
    console.log('Servidor de correo listo para enviar mensajes');
})
    .catch((error) => {
    console.error('Error al conectar con el servidor de correo:', error);
});
// Enviar correo de verificación
const sendVerificationEmail = async (email, name, token) => {
    try {
        // URL de verificación
        const verificationUrl = `${config_1.default.frontendUrl}/verify-email/${token}`;
        // Información del correo
        const mailOptions = {
            from: '"NecesitoMasReviews" <contacto@necesitomasreviews.com>',
            to: email,
            subject: 'Verifica tu cuenta en NecesitoMasReviews',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Hola ${name},</h2>
          <p>Gracias por registrarte en NecesitoMasReviews. Para completar tu registro, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Verificar mi cuenta
            </a>
          </div>
          
          <p>Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
          <p><a href="${verificationUrl}" style="color: #3b82f6;">${verificationUrl}</a></p>
          
          <p>Si no has solicitado la creación de una cuenta, puedes ignorar este correo.</p>
          
          <p>Saludos,<br>El equipo de NecesitoMasReviews</p>
        </div>
      `,
        };
        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de verificación enviado:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error al enviar el correo de verificación:', error);
        throw error;
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
// Enviar correo de restablecimiento de contraseña
const sendPasswordResetEmail = async (email, name, token) => {
    try {
        const resetUrl = `${config_1.default.frontendUrl}/reset-password/${token}`;
        const mailOptions = {
            from: '"NecesitoMasReviews" <contacto@necesitomasreviews.com>',
            to: email,
            subject: 'Restablece tu contraseña en NecesitoMasReviews',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Hola ${name},</h2>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Restablecer contraseña
            </a>
          </div>
          
          <p>Si no puedes hacer clic en el botón, copia y pega el siguiente enlace en tu navegador:</p>
          <p><a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a></p>
          
          <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este correo.</p>
          
          <p>Saludos,<br>El equipo de NecesitoMasReviews</p>
        </div>
      `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de restablecimiento enviado:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error al enviar el correo de restablecimiento:', error);
        throw error;
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
// Enviar correo de bienvenida (opcional, después de verificación)
const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: '"NecesitoMasReviews" <contacto@necesitomasreviews.com>',
            to: email,
            subject: '¡Bienvenido a NecesitoMasReviews!',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">¡Bienvenido, ${name}!</h2>
          <p>Tu cuenta ha sido verificada exitosamente. Ahora puedes comenzar a usar nuestros servicios para obtener más reseñas para tu negocio.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config_1.default.frontendUrl}/dashboard" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Ir a mi dashboard
            </a>
          </div>
          
          <p>Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este correo.</p>
          
          <p>Saludos,<br>El equipo de NecesitoMasReviews</p>
        </div>
      `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de bienvenida enviado:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Error al enviar el correo de bienvenida:', error);
        throw error;
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
//# sourceMappingURL=emailService.js.map