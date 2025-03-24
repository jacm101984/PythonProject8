// src/services/checkoutService.ts
import api from './api';

export interface ShippingInfo {
  fullName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface CheckoutData {
  packageType: string;
  paymentMethod: string;
  promoCode?: string;
  shippingAddress: ShippingInfo;
}

export const createCheckout = async (checkoutData: CheckoutData) => {
  try {
    const response = await api.post('/api/checkout/create', checkoutData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validatePromoCode = async (code: string) => {
  try {
    const response = await api.get(`/api/checkout/validate-code/${code}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPackagePrices = async () => {
  try {
    const response = await api.get('/api/checkout/packages');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const response = await api.get('/api/checkout/orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderDetails = async (orderId: string) => {
  try {
    const response = await api.get(`/api/checkout/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};