import axios from 'axios';
import { Order } from '../models/Order';
import { User } from '../models/User';
import { PaymentMethod } from '../types/PaymentTypes';
import config from '../config';

// Configuración de credenciales para los servicios de pago
const PAYPAL_CLIENT_ID = config.payment.paypal.clientId;
const PAYPAL_SECRET = config.payment.paypal.secret;
const PAYPAL_API_URL = config.payment.paypal.isProduction
  ? 'https://api.paypal.com'
  : 'https://api.sandbox.paypal.com';

const WEBPAY_API_KEY = config.payment.webpay.apiKey;
const WEBPAY_COMMERCE_CODE = config.payment.webpay.commerceCode;
const WEBPAY_API_URL = config.payment.webpay.isProduction
  ? 'https://webpay3g.transbank.cl'
  : 'https://webpay3gint.transbank.cl';

const MERCADOPAGO_ACCESS_TOKEN = config.payment.mercadopago.accessToken;
const MERCADOPAGO_API_URL = 'https://api.mercadopago.com';

/**
 * Clase para manejar el procesamiento de pagos con diferentes pasarelas
 */
export class PaymentService {
  /**
   * Iniciar un proceso de pago según el método seleccionado
   */
  async initiatePayment(
    order: Order,
    user: User,
    paymentMethod: PaymentMethod,
    returnUrl: string,
    cancelUrl: string
  ): Promise<{ paymentUrl: string; paymentId?: string }> {
    switch (paymentMethod) {
      case 'paypal':
        return this.initiatePayPalPayment(order, returnUrl, cancelUrl);
      case 'webpay':
        return this.initiateWebPayPayment(order, returnUrl, cancelUrl);
      case 'mercadopago':
        return this.initiateMercadoPagoPayment(order, user, returnUrl, cancelUrl);
      default:
        throw new Error(`Método de pago no soportado: ${paymentMethod}`);
    }
  }

  /**
   * Verificar el estado de un pago
   */
  async verifyPayment(
    paymentId: string,
    paymentMethod: PaymentMethod
  ): Promise<{ verified: boolean; transactionId?: string }> {
    switch (paymentMethod) {
      case 'paypal':
        return this.verifyPayPalPayment(paymentId);
      case 'webpay':
        return this.verifyWebPayPayment(paymentId);
      case 'mercadopago':
        return this.verifyMercadoPagoPayment(paymentId);
      default:
        throw new Error(`Método de pago no soportado: ${paymentMethod}`);
    }
  }

  /**
   * Reembolsar un pago
   */
  async refundPayment(
    paymentId: string,
    paymentMethod: PaymentMethod
  ): Promise<boolean> {
    switch (paymentMethod) {
      case 'paypal':
        return this.refundPayPalPayment(paymentId);
      case 'webpay':
        return this.refundWebPayPayment(paymentId);
      case 'mercadopago':
        return this.refundMercadoPagoPayment(paymentId);
      default:
        throw new Error(`Método de pago no soportado: ${paymentMethod}`);
    }
  }

  /**
   * Iniciar pago con PayPal
   */
  private async initiatePayPalPayment(
    order: Order,
    returnUrl: string,
    cancelUrl: string
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    try {
      // Obtener token de acceso para la API de PayPal
      const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
      const tokenResponse = await axios.post(
        `${PAYPAL_API_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Crear orden de PayPal
      const response = await axios.post(
        `${PAYPAL_API_URL}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: order._id.toString(),
              description: `Pedido de tarjetas NFC - Plan ${order.planName}`,
              amount: {
                currency_code: 'USD',
                value: order.totalAmount.toString()
              }
            }
          ],
          application_context: {
            brand_name: 'necesitomasreviews.com',
            landing_page: 'BILLING',
            user_action: 'PAY_NOW',
            return_url: returnUrl,
            cancel_url: cancelUrl
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const { id } = response.data;
      const approveLink = response.data.links.find((link: any) => link.rel === 'approve').href;

      return {
        paymentUrl: approveLink,
        paymentId: id
      };
    } catch (error) {
      console.error('Error al iniciar pago con PayPal:', error);
      throw new Error('Error al procesar el pago con PayPal');
    }
  }

  /**
   * Verificar pago con PayPal
   */
  private async verifyPayPalPayment(
    paymentId: string
  ): Promise<{ verified: boolean; transactionId?: string }> {
    try {
      // Obtener token de acceso para la API de PayPal
      const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
      const tokenResponse = await axios.post(
        `${PAYPAL_API_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Capturar el pago
      const response = await axios.post(
        `${PAYPAL_API_URL}/v2/checkout/orders/${paymentId}/capture`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      const { status } = response.data;
      const transactionId = response.data.purchase_units[0].payments.captures[0].id;

      return {
        verified: status === 'COMPLETED',
        transactionId
      };
    } catch (error) {
      console.error('Error al verificar pago con PayPal:', error);
      return { verified: false };
    }
  }

  /**
   * Reembolsar pago con PayPal
   */
  private async refundPayPalPayment(paymentId: string): Promise<boolean> {
    try {
      // Obtener token de acceso para la API de PayPal
      const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
      const tokenResponse = await axios.post(
        `${PAYPAL_API_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`
          }
        }
      );

      const accessToken = tokenResponse.data.access_token;

      // Realizar el reembolso
      const response = await axios.post(
        `${PAYPAL_API_URL}/v2/payments/captures/${paymentId}/refund`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      return response.data.status === 'COMPLETED';
    } catch (error) {
      console.error('Error al reembolsar pago con PayPal:', error);
      return false;
    }
  }

  /**
   * Iniciar pago con WebPay Plus
   */
  private async initiateWebPayPayment(
    order: Order,
    returnUrl: string,
    cancelUrl: string
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    try {
      const response = await axios.post(
        `${WEBPAY_API_URL}/rswebpaytransaction/api/webpay/v1.2/transactions`,
        {
          buy_order: order._id.toString(),
          session_id: order.userId.toString(),
          amount: order.totalAmount,
          return_url: returnUrl
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Tbk-Api-Key-Id': WEBPAY_COMMERCE_CODE,
            'Tbk-Api-Key-Secret': WEBPAY_API_KEY
          }
        }
      );

      return {
        paymentUrl: response.data.url,
        paymentId: response.data.token
      };
    } catch (error) {
      console.error('Error al iniciar pago con WebPay:', error);
      throw new Error('Error al procesar el pago con WebPay');
    }
  }

  /**
   * Verificar pago con WebPay Plus
   */
  private async verifyWebPayPayment(
    paymentId: string
  ): Promise<{ verified: boolean; transactionId?: string }> {
    try {
      const response = await axios.put(
        `${WEBPAY_API_URL}/rswebpaytransaction/api/webpay/v1.2/transactions/${paymentId}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Tbk-Api-Key-Id': WEBPAY_COMMERCE_CODE,
            'Tbk-Api-Key-Secret': WEBPAY_API_KEY
          }
        }
      );

      return {
        verified: response.data.status === 'AUTHORIZED',
        transactionId: response.data.buy_order
      };
    } catch (error) {
      console.error('Error al verificar pago con WebPay:', error);
      return { verified: false };
    }
  }

  /**
   * Reembolsar pago con WebPay Plus
   */
  private async refundWebPayPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${WEBPAY_API_URL}/rswebpaytransaction/api/webpay/v1.2/transactions/${paymentId}/refunds`,
        {
          amount: 0 // Reembolso completo
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Tbk-Api-Key-Id': WEBPAY_COMMERCE_CODE,
            'Tbk-Api-Key-Secret': WEBPAY_API_KEY
          }
        }
      );

      return response.data.type === 'NULLIFIED';
    } catch (error) {
      console.error('Error al reembolsar pago con WebPay:', error);
      return false;
    }
  }

  /**
   * Iniciar pago con MercadoPago
   */
  private async initiateMercadoPagoPayment(
    order: Order,
    user: User,
    returnUrl: string,
    cancelUrl: string
  ): Promise<{ paymentUrl: string; paymentId: string }> {
    try {
      const response = await axios.post(
        `${MERCADOPAGO_API_URL}/checkout/preferences`,
        {
          items: [
            {
              id: order._id.toString(),
              title: `Plan ${order.planName} - Tarjetas NFC`,
              quantity: 1,
              currency_id: 'USD',
              unit_price: order.totalAmount
            }
          ],
          payer: {
            email: user.email,
            name: user.name,
            identification: {
              type: 'DNI',
              number: '12345678'
            }
          },
          back_urls: {
            success: returnUrl,
            failure: cancelUrl,
            pending: cancelUrl
          },
          auto_return: 'approved',
          external_reference: order._id.toString()
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
          }
        }
      );

      return {
        paymentUrl: response.data.init_point,
        paymentId: response.data.id
      };
    } catch (error) {
      console.error('Error al iniciar pago con MercadoPago:', error);
      throw new Error('Error al procesar el pago con MercadoPago');
    }
  }

  /**
   * Verificar pago con MercadoPago
   */
  private async verifyMercadoPagoPayment(
    paymentId: string
  ): Promise<{ verified: boolean; transactionId?: string }> {
    try {
      const response = await axios.get(
        `${MERCADOPAGO_API_URL}/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
          }
        }
      );

      return {
        verified: response.data.status === 'approved',
        transactionId: response.data.id.toString()
      };
    } catch (error) {
      console.error('Error al verificar pago con MercadoPago:', error);
      return { verified: false };
    }
  }

  /**
   * Reembolsar pago con MercadoPago
   */
  private async refundMercadoPagoPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await axios.post(
        `${MERCADOPAGO_API_URL}/v1/payments/${paymentId}/refunds`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`
          }
        }
      );

      return response.data.status === 'approved';
    } catch (error) {
      console.error('Error al reembolsar pago con MercadoPago:', error);
      return false;
    }
  }
}

export default new PaymentService();