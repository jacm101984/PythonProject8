// src/services/cardService.ts
import axios from 'axios';
import { API_URL } from '../config';

// Interfaces
export interface Card {
  id: string;
  name: string;
  uid: string;
  isActive: boolean;
  businessName?: string;
  googleReviewLink?: string;
  totalScans: number;
  lastScan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardStats {
  dailyStats: {
    date: string;
    scans: number;
    reviews: number;
  }[];
  weeklyStats: {
    week: string;
    scans: number;
    reviews: number;
  }[];
  totalScans: number;
  totalReviews: number;
  conversionRate: number;
}

// Obtener todas las tarjetas del usuario
export const getUserCards = async (): Promise<Card[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/nfc/cards`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};

// Obtener una tarjeta específica
export const getCardById = async (id: string): Promise<Card> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/nfc/cards/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};

// Crear una nueva tarjeta
export const createCard = async (cardData: Partial<Card>): Promise<Card> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/nfc/cards`, cardData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};

// Actualizar una tarjeta
export const updateCard = async (id: string, cardData: Partial<Card>): Promise<Card> => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/nfc/cards/${id}`, cardData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};

// Eliminar una tarjeta
export const deleteCard = async (id: string): Promise<boolean> => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/nfc/cards/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.success;
};

// Obtener estadísticas de una tarjeta
export const getCardStats = async (id: string): Promise<CardStats> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/nfc/cards/${id}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.data;
};

// Obtener URL del QR para una tarjeta
export const getCardQRUrl = (uid: string): string => {
  return `${API_URL}/nfc/redirect/${uid}`;
};

// Exportar como objeto nombrado cardService
export const cardService = {
  getUserCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getCardStats,
  getCardQRUrl
};

// También mantener la exportación por defecto para compatibilidad
export default {
  getUserCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  getCardStats,
  getCardQRUrl
};