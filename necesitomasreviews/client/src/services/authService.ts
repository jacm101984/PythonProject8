// src/services/authService.ts
import { api } from './api';
import jwtDecode from 'jwt-decode';

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'USER' | 'PROMOTER' | 'REGIONAL_ADMIN' | 'SUPER_ADMIN';
    emailVerified: boolean;
    region?: string;
  }
}

interface TokenPayload {
  userId: string;
  role: string;
  exp: number;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_DATA_KEY = 'user_data';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;

      // Guardar tokens y datos de usuario
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

      // Configurar token en encabezados para futuras peticiones
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: { name: string; email: string; password: string }): Promise<void> => {
    try {
      await api.post('/auth/register', userData);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    delete api.defaults.headers.common['Authorization'];
  },

  refreshToken: async (): Promise<string> => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      const { token } = response.data;

      localStorage.setItem(TOKEN_KEY, token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Si hay error al refrescar, hacemos logout
      authService.logout();
      throw error;
    }
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;

      // Si el token está a punto de expirar (menos de 5 minutos), intentamos refrescarlo
      if (decoded.exp - currentTime < 300) {
        authService.refreshToken().catch(() => {
          // Si falla el refresh, el usuario tendrá que volver a iniciar sesión
          return false;
        });
      }

      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  verifyEmail: async (token: string): Promise<void> => {
    try {
      await api.post('/auth/verify-email', { token });
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  updateProfile: async (userData: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<void> => {
    try {
      const response = await api.patch('/users/profile', userData);

      // Actualizar datos de usuario en localStorage
      const currentUser = authService.getCurrentUser();
      if (currentUser && userData.name) {
        currentUser.name = userData.name;
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(currentUser));
      }

      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }
};

// Configurar interceptor para refrescar token automáticamente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si es error 401 y no es un intento de refresh previo
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authService.refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Inicializar token en headers si existe
const token = localStorage.getItem(TOKEN_KEY);
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}