// client/src/config.ts

// Obtener la URL de la API según el entorno
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // URLs predeterminadas según el entorno
  if (import.meta.env.MODE === 'production') {
    return 'https://api.necesitomasreviews.com/api';
  } else if (import.meta.env.MODE === 'staging') {
    return 'https://staging-api.necesitomasreviews.com/api';
  } else {
    return 'http://localhost:3300/api';
  }
};

// Configuración general de la aplicación
export const APP_NAME = 'NecesitoMasReviews';
export const APP_VERSION = '1.0.0';

// URL de la API
export const API_URL = getApiUrl();

// Tiempo máximo de espera para peticiones (ms)
export const API_TIMEOUT = 30000;

// Configuración de autenticación
export const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_USER_KEY = 'auth_user';

// Configuración de Google Maps
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCdeobdEV5r3d2TyGiku4LJfrL6DU3qAiQ';

// Planes disponibles
export const PLANS = {
  BASIC: {
    id: 'basic',
    name: 'Básico',
    price: 29,
    cardCount: 1
  },
  STANDARD: {
    id: 'standard',
    name: 'Estándar',
    price: 59,
    cardCount: 3
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 79,
    cardCount: 5
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Empresarial',
    price: 119,
    cardCount: 10
  }
};

// Configuración de paginación predeterminada
export const DEFAULT_PAGE_SIZE = 10;

// Exportar configuración completa por defecto
export default {
  API_URL,
  API_TIMEOUT,
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  GOOGLE_MAPS_API_KEY,
  PLANS,
  DEFAULT_PAGE_SIZE
};