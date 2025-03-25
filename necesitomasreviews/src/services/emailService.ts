// src/utils/emailService.ts

import nodemailer from 'nodemailer';
import config from '../config';

// Obtener configuración del archivo de configuración (que debe usar las variables de entorno)
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.godaddy.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || 'contacto@necesitomasreviews.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'QWEasdZXC123'; // Cambiado de EMAIL_PASSWORD a EMAIL_PASS
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5300';

// Mostrar la configuración que se está usando (sin mostrar la contraseña)
console.log('Configuración de email:');
console.log(`- Host: ${EMAIL_HOST}`);
console.log(`- Puerto: ${EMAIL_PORT}`);
console.log(`- Usuario: ${EMAIL_USER}`);
console.log(`- Secure: ${EMAIL_SECURE}`);
console.log(`- URL del cliente: ${CLIENT_URL}`);

// Configuración del transportador de correo para GoDaddy
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE, // true para 465, false para otros puertos
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS, // Cambiado de EMAIL_PASSWORD a EMAIL_PASS
  },
  tls: {
    // No fallar en certificados inválidos
    rejectUnauthorized: false,
    // Configuración amplia de cifrados para mayor compatibilidad
    ciphers: 'SSLv3',
    // Versión mínima de TLS para mayor compatibilidad
    minVersion: 'TLSv1'
  },
  // Habilitar debug para ver detalles (quitar en producción)
  debug: process.env.NODE_ENV !== 'production',
  logger: process.env.NODE_ENV !== 'production'
});

// Verificar la conexión con el servidor de correo
transporter.verify()
  .then(() => {
    console.log('✅ Servidor de correo listo para enviar mensajes');
  })
  .catch((error) => {
    console.error('❌ Error al conectar con el servidor de correo:');
    console.error(error);

    // Analizar errores comunes
    if (error.message.includes('Authentication')) {
      console.error('El problema parece ser de autenticación. Verifica usuario y contraseña.');
    } else if (error.message.includes('connection refused') || error.message.includes('ECONNREFUSED')) {
      console.error('No se pudo conectar al servidor. Verifica que el host y puerto sean correctos.');
    } else if (error.message.includes('certificate')) {
      console.error('Hay un problema con el certificado SSL. Estamos intentando ignorarlo, pero podría seguir causando problemas.');
    }
  });

// Función para intentar envío con reintentos
async function sendMailWithRetry(mailOptions, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Intento ${attempt} de envío de correo a ${mailOptions.to}`);
      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ Email enviado (intento ${attempt}): ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`❌ Error en intento ${attempt}:`, error.message);
      lastError = error;

      // Esperar antes de reintentar (espera exponencial)
      if (attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s, ...
        console.log(`Esperando ${delay}ms antes del siguiente intento...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  // Si llegamos aquí, todos los intentos fallaron
  throw lastError;
}

// Enviar correo de verificación
export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  try {
    console.log(`Preparando correo de verificación para ${email} con token ${token}`);

    // URL de verificación
    const verificationUrl = `${CLIENT_URL}/verify-email/${token}`;
    console.log(`URL de verificación: ${verificationUrl}`);

    // Información del correo
    const mailOptions = {
      from: `"NecesitoMasReviews" <${EMAIL_USER}>`,
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
      // Agregar versión texto plano para mejor entrega
      text: `Hola ${name}, 
      
Gracias por registrarte en NecesitoMasReviews. Para completar tu registro, visita el siguiente enlace:
      
${verificationUrl}
      
Si no has solicitado la creación de una cuenta, puedes ignorar este correo.
      
Saludos,
El equipo de NecesitoMasReviews`
    };

    // Enviar el correo con reintentos
    return await sendMailWithRetry(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
    throw error;
  }
};

// Enviar correo de restablecimiento de contraseña
export const sendPasswordResetEmail = async (email: string, name: string, token: string) => {
  try {
    console.log(`Preparando correo de restablecimiento para ${email} con token ${token}`);

    const resetUrl = `${CLIENT_URL}/reset-password/${token}`;
    console.log(`URL de restablecimiento: ${resetUrl}`);

    const mailOptions = {
      from: `"NecesitoMasReviews" <${EMAIL_USER}>`,
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
      text: `Hola ${name}, 
      
Has solicitado restablecer tu contraseña. Visita el siguiente enlace para crear una nueva contraseña:
      
${resetUrl}
      
Si no has solicitado restablecer tu contraseña, puedes ignorar este correo.
      
Saludos,
El equipo de NecesitoMasReviews`
    };

    return await sendMailWithRetry(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento:', error);
    throw error;
  }
};

// Enviar correo de bienvenida (opcional, después de verificación)
export const sendWelcomeEmail = async (email: string, name: string) => {
  try {
    console.log(`Preparando correo de bienvenida para ${email}`);

    const mailOptions = {
      from: `"NecesitoMasReviews" <${EMAIL_USER}>`,
      to: email,
      subject: '¡Bienvenido a NecesitoMasReviews!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">¡Bienvenido, ${name}!</h2>
          <p>Tu cuenta ha sido verificada exitosamente. Ahora puedes comenzar a usar nuestros servicios para obtener más reseñas para tu negocio.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${CLIENT_URL}/dashboard" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Ir a mi dashboard
            </a>
          </div>
          
          <p>Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este correo.</p>
          
          <p>Saludos,<br>El equipo de NecesitoMasReviews</p>
        </div>
      `,
      text: `¡Bienvenido, ${name}!
      
Tu cuenta ha sido verificada exitosamente. Ahora puedes comenzar a usar nuestros servicios para obtener más reseñas para tu negocio.
      
Visita tu dashboard: ${CLIENT_URL}/dashboard
      
Si tienes alguna pregunta, no dudes en contactarnos.
      
Saludos,
El equipo de NecesitoMasReviews`
    };

    return await sendMailWithRetry(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo de bienvenida:', error);
    throw error;
  }
};

// Función para enviar un correo de prueba
export const sendTestEmail = async (email: string) => {
  try {
    console.log(`Preparando correo de prueba para ${email}`);

    const mailOptions = {
      from: `"NecesitoMasReviews Test" <${EMAIL_USER}>`,
      to: email,
      subject: 'Prueba de envío de correo - NecesitoMasReviews',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Prueba de envío de correo</h2>
          <p>Este es un correo de prueba para verificar la configuración del servidor de correo.</p>
          <p>Si estás viendo esto, la configuración es correcta.</p>
          <p>Fecha y hora: ${new Date().toLocaleString()}</p>
          <p>Saludos,<br>El equipo de NecesitoMasReviews</p>
        </div>
      `,
      text: `Prueba de envío de correo
      
Este es un correo de prueba para verificar la configuración del servidor de correo.
Si estás viendo esto, la configuración es correcta.
      
Fecha y hora: ${new Date().toLocaleString()}
      
Saludos,
El equipo de NecesitoMasReviews`
    };

    return await sendMailWithRetry(mailOptions);
  } catch (error) {
    console.error('Error al enviar el correo de prueba:', error);
    throw error;
  }
};