import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create base API instance
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3300/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        });

        if (response.data.token) {
          // Save the new tokens
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;

          // Update axios default header
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other error cases with a toast notification
    const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';

    // Only show toast for client errors (4xx) but not for 401 since that's handled above
    if (error.response && error.response.status >= 400 && error.response.status < 500 && error.response.status !== 401) {
      toast.error(errorMessage);
    } else if (error.response && error.response.status >= 500) {
      // Server errors
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout errors
      toast.error('Request timed out. Please check your connection and try again.');
    } else if (!error.response) {
      // Network errors
      toast.error('Network error. Please check your connection and try again.');
    }

    return Promise.reject(error);
  }
);

// Typed API service object with all endpoints
export const apiService = {
  // Auth related endpoints
  auth: {
    login: (email: string, password: string) =>
      api.post('/auth/login', { email, password }),

    register: (userData: {
      name: string,
      email: string,
      password: string,
      role?: string,
      region?: string
    }) => api.post('/auth/register', userData),

    verifyEmail: (token: string) =>
      api.get(`/auth/verify-email/${token}`),

    forgotPassword: (email: string) =>
      api.post('/auth/forgot-password', { email }),

    resetPassword: (token: string, password: string) =>
      api.post('/auth/reset-password', { token, password }),

    refreshToken: (refreshToken: string) =>
      api.post('/auth/refresh-token', { refreshToken }),

    logout: () => api.post('/auth/logout'),

    getCurrentUser: () => api.get('/auth/me'),
  },

  // User related endpoints
  users: {
    getProfile: () =>
      api.get('/users/profile'),

    updateProfile: (userData: any) =>
      api.put('/users/profile', userData),

    updatePassword: (oldPassword: string, newPassword: string) =>
      api.put('/users/password', { oldPassword, newPassword }),

    getAll: (params?: { page?: number, limit?: number, search?: string, role?: string, region?: string }) =>
      api.get('/users', { params }),

    getById: (id: string) =>
      api.get(`/users/${id}`),

    create: (userData: any) =>
      api.post('/users', userData),

    update: (id: string, userData: any) =>
      api.put(`/users/${id}`, userData),

    delete: (id: string) =>
      api.delete(`/users/${id}`),

    changeRole: (id: string, role: string) =>
      api.put(`/users/${id}/role`, { role }),
  },

  // NFC Cards related endpoints
  cards: {
    getAll: (params?: { page?: number, limit?: number, status?: string, search?: string }) =>
      api.get('/cards', { params }),

    getById: (id: string) =>
      api.get(`/cards/${id}`),

    getStats: (id: string) =>
      api.get(`/cards/${id}/stats`),

    create: (cardData: any) =>
      api.post('/cards', cardData),

    update: (id: string, cardData: any) =>
      api.put(`/cards/${id}`, cardData),

    delete: (id: string) =>
      api.delete(`/cards/${id}`),

    activate: (id: string, googleProfileUrl: string) =>
      api.post(`/cards/${id}/activate`, { googleProfileUrl }),

    deactivate: (id: string) =>
      api.post(`/cards/${id}/deactivate`),

    transfer: (id: string, newOwnerId: string) =>
      api.post(`/cards/${id}/transfer`, { newOwnerId }),
  },

  // Orders related endpoints
  orders: {
    getAll: (params?: { page?: number, limit?: number, status?: string }) =>
      api.get('/orders', { params }),

    getById: (id: string) =>
      api.get(`/orders/${id}`),

    create: (orderData: any) =>
      api.post('/orders', orderData),

    update: (id: string, orderData: any) =>
      api.put(`/orders/${id}`, orderData),

    updateStatus: (id: string, status: string) =>
      api.put(`/orders/${id}/status`, { status }),

    getByUser: (userId: string) =>
      api.get(`/users/${userId}/orders`),
  },

  // Promoter related endpoints
  promoters: {
    getPromoCodes: (params?: { page?: number, limit?: number, active?: boolean }) =>
      api.get('/promoters/promo-codes', { params }),

    createPromoCode: (promoData: { code: string, discountPercentage: number, expiresAt?: Date }) =>
      api.post('/promoters/promo-codes', promoData),

    updatePromoCode: (id: string, promoData: { active?: boolean, discountPercentage?: number, expiresAt?: Date }) =>
      api.put(`/promoters/promo-codes/${id}`, promoData),

    deletePromoCode: (id: string) =>
      api.delete(`/promoters/promo-codes/${id}`),

    getCommissions: (params?: { startDate?: string, endDate?: string, page?: number, limit?: number }) =>
      api.get('/promoters/commissions', { params }),

    getStats: () =>
      api.get('/promoters/stats'),
  },

  // Admin related endpoints
  admin: {
    getDashboardStats: () =>
      api.get('/admin/dashboard'),

    getRegions: () =>
      api.get('/admin/regions'),

    createRegion: (regionData: { name: string, countryCode: string }) =>
      api.post('/admin/regions', regionData),

    updateRegion: (id: string, regionData: { name?: string, active?: boolean }) =>
      api.put(`/admin/regions/${id}`, regionData),

    deleteRegion: (id: string) =>
      api.delete(`/admin/regions/${id}`),

    getReports: (reportType: string, params?: any) =>
      api.get(`/admin/reports/${reportType}`, { params }),

    exportReport: (reportType: string, format: 'csv' | 'pdf' | 'excel', params?: any) =>
      api.get(`/admin/reports/${reportType}/export/${format}`, {
        params,
        responseType: 'blob'
      }),
  },

  // Checkout related endpoints
  checkout: {
    createCheckoutSession: (cartData: any) =>
      api.post('/checkout/session', cartData),

    verifyPromoCode: (code: string) =>
      api.post('/checkout/verify-promo', { code }),

    getPaymentMethods: () =>
      api.get('/checkout/payment-methods'),

    processPayment: (sessionId: string, paymentData: any) =>
      api.post(`/checkout/process/${sessionId}`, paymentData),

    getCheckoutStatus: (sessionId: string) =>
      api.get(`/checkout/status/${sessionId}`),
  }
};

// Exporting checkpoint service for direct import
export const checkoutService = apiService.checkout;

export default api;