/**
 * Tipos de métodos de pago soportados por la plataforma
 */
export type PaymentMethod = 'paypal' | 'webpay' | 'mercadopago';

/**
 * Interfaz para la configuración de pasarelas de pago
 */
export interface PaymentGatewayConfig {
  paypal: {
    clientId: string;
    secret: string;
    isProduction: boolean;
  };
  webpay: {
    commerceCode: string;
    apiKey: string;
    isProduction: boolean;
  };
  mercadopago: {
    accessToken: string;
    isProduction: boolean;
  };
}

/**
 * Interfaz para la estructura de la notificación de pago
 */
export interface PaymentNotification {
  orderId: string;
  planName: string;
  cardCount: number;
  totalAmount: number;
}