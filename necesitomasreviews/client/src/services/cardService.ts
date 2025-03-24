// src/services/cardService.ts
import { api } from './api';

interface Card {
  id: string;
  uid: string;
  status: 'active' | 'inactive';
  businessName?: string;
  googlePlaceId?: string;
  activationDate?: string;
  userId: string;
  totalScans: number;
  totalReviews: number;
  reviewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface CardActivationData {
  googlePlaceId: string;
  businessName: string;
}

interface CardAnalytics {
  labels: string[];
  scans: number[];
  reviews: number[];
  conversionRate: number[];
}

export const cardService = {
  // Obtener todas las tarjetas del usuario
  getUserCards: async (): Promise<Card[]> => {
    try {
      const response = await api.get('/cards');
      return response.data;
    } catch (error) {
      console.error('Error fetching user cards:', error);
      throw error;
    }
  },

  // Obtener detalles de una tarjeta
  getCardDetails: async (cardId: string): Promise<Card> => {
    try {
      const response = await api.get(`/cards/${cardId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching card details:', error);
      throw error;
    }
  },

  // Activar una tarjeta
  activateCard: async (cardId: string, data: CardActivationData): Promise<Card> => {
    try {
      const response = await api.post(`/cards/${cardId}/activate`, data);
      return response.data;
    } catch (error) {
      console.error('Error activating card:', error);
      throw error;
    }
  },

  // Actualizar una tarjeta
  updateCard: async (cardId: string, data: Partial<Card>): Promise<Card> => {
    try {
      const response = await api.put(`/cards/${cardId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  },

  // Validar un Place ID de Google
  validateGooglePlaceId: async (placeId: string): Promise<boolean> => {
    try {
      const response = await api.post('/cards/validate-place-id', { placeId });
      return response.data.valid;
    } catch (error) {
      console.error('Error validating Google Place ID:', error);
      return false;
    }
  },

  // Obtener análisis de una tarjeta
  getCardAnalytics: async (cardId: string, timeframe: string): Promise<CardAnalytics> => {
    try {
      const response = await api.get(`/cards/${cardId}/analytics`, {
        params: { timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching card analytics:', error);
      throw error;
    }
  },

  // Para administradores: obtener todas las tarjetas
  getAllCards: async (filters: {
    regionId?: string;
    status?: 'active' | 'inactive' | 'all';
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ cards: Card[]; total: number; pages: number }> => {
    try {
      const response = await api.get('/admin/cards', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching all cards:', error);
      throw error;
    }
  },

  // Para administradores: activar/desactivar tarjeta
  toggleCardStatus: async (cardId: string, active: boolean): Promise<Card> => {
    try {
      const response = await api.patch(`/admin/cards/${cardId}/status`, {
        active
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling card status:', error);
      throw error;
    }
  },

  // Para administradores: asignar tarjeta a usuario
  assignCardToUser: async (cardId: string, userId: string): Promise<Card> => {
    try {
      const response = await api.patch(`/admin/cards/${cardId}/assign`, {
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning card to user:', error);
      throw error;
    }
  }
};

// Export individual functions for direct import
export const updateCard = cardService.updateCard;
export const getUserCards = cardService.getUserCards;
export const getCardDetails = cardService.getCardDetails;
export const activateCard = cardService.activateCard;
export const validateGooglePlaceId = cardService.validateGooglePlaceId;
export const getCardAnalytics = cardService.getCardAnalytics;
export const getAllCards = cardService.getAllCards;
export const toggleCardStatus = cardService.toggleCardStatus;
export const assignCardToUser = cardService.assignCardToUser;

// Re-export types
export type { Card, CardActivationData, CardAnalytics };