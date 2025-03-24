// src/services/orderService.ts
import { api } from './api';

interface Order {
  id: string;
  userId: string;
  packageId: string;
  packageName: string;
  cardCount: number;
  price: number;
  discount: number;
  finalPrice: number;
  status: 'pending' | 'paid' | 'canceled' | 'completed' | 'shipped';
  paymentMethod: string;
  paymentId?: string;
  shippingInfo: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
  };
  trackingNumber?: string;
  promoCode?: string;
  cards?: string[];
  createdAt: string;
  updatedAt: string;
}

export const orderService = {
  // Obtener órdenes del usuario actual
  getUserOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },

  // Obtener detalles de una orden
  getOrderDetails: async (orderId: string): Promise<Order> => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // Verificar código promocional
  verifyPromoCode: async (promoCode: string, packageId: string): Promise<{
    valid: boolean;
    discountPercentage: number;
    message: string;
  }> => {
    try {
      const response = await api.post('/checkout/verify-promo', {
        promoCode,
        packageId
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying promo code:', error);
      throw error;
    }
  },

  // Crear nueva orden
  createOrder: async (orderData: {
    packageId: string;
    shippingInfo: {
      fullName: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      phoneNumber: string;
    };
    paymentMethod: string;
    promoCode?: string;
    paypalOrderId?: string;
  }): Promise<{
    orderId: string;
    paymentUrl?: string;
  }> => {
    try {
      const response = await api.post('/checkout/create-order', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Para administradores: obtener todas las órdenes
  getAllOrders: async (filters: {
    regionId?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<{
    orders: Order[];
    total: number;
    pages: number;
  }> => {
    try {
      const response = await api.get('/admin/orders', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  },

  // Para administradores: actualizar estado de orden
  updateOrderStatus: async (
    orderId: string,
    status: 'pending' | 'paid' | 'canceled' | 'completed' | 'shipped',
    trackingNumber?: string
  ): Promise<Order> => {
    try {
      const response = await api.patch(`/admin/orders/${orderId}/status`, {
        status,
        trackingNumber
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Para administradores: asignar tarjetas a una orden
  assignCardsToOrder: async (orderId: string, cardIds: string[]): Promise<Order> => {
    try {
      const response = await api.post(`/admin/orders/${orderId}/assign-cards`, {
        cardIds
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning cards to order:', error);
      throw error;
    }
  }
};