// client/src/services/subscriptionService.ts

import api from './api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  limitations?: string[];
  billingPeriod?: string;
}

export interface Subscription {
  _id: string;
  userId: string;
  plan: 'basic' | 'premium';
  startDate: Date;
  endDate: Date | null;
  autoRenew: boolean;
  paymentMethod: string;
  status: 'active' | 'canceled' | 'expired';
}

const subscriptionService = {
  /**
   * Obtiene los planes de suscripción disponibles
   */
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    try {
      const response = await api.get('/subscriptions/plans');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener planes de suscripción:', error);
      throw error;
    }
  },

  /**
   * Obtiene la suscripción actual del usuario
   */
  getCurrentSubscription: async (): Promise<Subscription | null> => {
    try {
      const response = await api.get('/subscriptions/current');
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener suscripción actual:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva suscripción premium
   */
  createPremiumSubscription: async (paymentMethod: string, paymentId: string, autoRenew: boolean): Promise<any> => {
    try {
      const response = await api.post('/subscriptions/premium', {
        paymentMethod,
        paymentId,
        autoRenew
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear suscripción premium:', error);
      throw error;
    }
  },

  /**
   * Cancela la suscripción premium
   */
  cancelSubscription: async (): Promise<any> => {
    try {
      const response = await api.put('/subscriptions/cancel');
      return response.data;
    } catch (error) {
      console.error('Error al cancelar suscripción:', error);
      throw error;
    }
  },

  /**
   * Actualiza la renovación automática
   */
  updateAutoRenew: async (autoRenew: boolean): Promise<any> => {
    try {
      const response = await api.put('/subscriptions/auto-renew', { autoRenew });
      return response.data;
    } catch (error) {
      console.error('Error al actualizar renovación automática:', error);
      throw error;
    }
  }
};

export default subscriptionService;