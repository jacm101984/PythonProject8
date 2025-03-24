// src/services/csrfProtection.ts
import { api } from './api';

export const setupCSRFProtection = async () => {
  try {
    // Obtener el token CSRF del servidor
    const response = await api.get('/csrf-token');
    const csrfToken = response.data.csrfToken;

    // Configurar el token en los headers de todas las peticiones
    api.interceptors.request.use(config => {
      if (config.method !== 'get') {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
      return config;
    });

    console.log('CSRF protection initialized');
  } catch (error) {
    console.error('Failed to initialize CSRF protection:', error);
  }
};

// Función para renovar el token periódicamente
export const setupCSRFTokenRenewal = () => {
  // Renovar cada 30 minutos
  const RENEWAL_INTERVAL = 30 * 60 * 1000;

  const renewToken = async () => {
    try {
      const response = await api.get('/csrf-token/renew');
      const newToken = response.data.csrfToken;

      // Actualizar el token en el interceptor
      api.interceptors.request.handlers.forEach(handler => {
        const requestInterceptor = handler.fulfilled;
        if (requestInterceptor && typeof requestInterceptor === 'function') {
          requestInterceptor.csrfToken = newToken;
        }
      });

      console.log('CSRF token renewed');
    } catch (error) {
      console.error('Failed to renew CSRF token:', error);
    }
  };

  // Iniciar renovación periódica
  setInterval(renewToken, RENEWAL_INTERVAL);
};