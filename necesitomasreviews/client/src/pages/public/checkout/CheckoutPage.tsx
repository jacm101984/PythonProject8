import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { api, checkoutService } from '../../../services/api';
import { Toaster, toast } from 'react-hot-toast';
import PayPalButtonWrapper from '../../../components/PayPalButtonWrapper';

// Tipos
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  cardCount: number;
  features: string[];
}

interface ShippingInfo {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

// Paso del proceso de checkout
type CheckoutStep = 'plan-selection' | 'shipping-info' | 'payment-method' | 'review';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Estado para el proceso de checkout
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('plan-selection');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: user?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Datos de planes
  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Básico',
      description: 'Ideal para pequeños negocios',
      price: 29,
      cardCount: 1,
      features: ['1 tarjeta NFC', 'Dashboard básico', 'Soporte por email'],
    },
    {
      id: 'standard',
      name: 'Estándar',
      description: 'Perfecto para negocios en crecimiento',
      price: 59,
      cardCount: 3,
      features: ['3 tarjetas NFC', 'Dashboard completo', 'Soporte prioritario'],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Para negocios establecidos',
      price: 79,
      cardCount: 5,
      features: ['5 tarjetas NFC', 'Dashboard avanzado', 'Soporte 24/7'],
    },
    {
      id: 'enterprise',
      name: 'Empresarial',
      description: 'Solución para grandes empresas',
      price: 119,
      cardCount: 10,
      features: ['10 tarjetas NFC', 'Dashboard personalizado', 'Soporte VIP', 'Configuración personalizada'],
    },
  ];

  // Métodos de pago disponibles
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '/icons/paypal.svg',
    },
    {
      id: 'webpay',
      name: 'WebPay Plus',
      icon: '/icons/webpay.svg',
    },
    {
      id: 'mercadopago',
      name: 'MercadoPago',
      icon: '/icons/mercadopago.svg',
    },
  ];

  // Verificar código promocional
  const verifyPromoCode = async () => {
    if (!promoCode) return;

    setIsLoading(true);
    try {
      const response = await api.post('/checkout/verify-promo', { promoCode });
      const discountPercentage = response.data.discountPercentage;
      setDiscount(discountPercentage);
      toast.success(`Código aplicado: ${discountPercentage}% de descuento`);
    } catch (error) {
      toast.error('Código promocional inválido');
      setPromoCode('');
      setDiscount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular precio final
  const calculateFinalPrice = (): number => {
    if (!selectedPlan) return 0;

    const price = selectedPlan.price;
    return price - (price * discount / 100);
  };

  // Manejadores de eventos
  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentStep('shipping-info');
  };

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value,
    });
  };

  const handleShippingInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment-method');
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
    if (methodId !== 'paypal') {
      setCurrentStep('review');
    }
  };

  // Manejar pago exitoso con PayPal
  const handlePayPalSuccess = async (paypalOrderId: string) => {
    if (!selectedPlan) return;

    setIsLoading(true);
    try {
      // Crear la orden en el backend
      const orderData = {
        planId: selectedPlan.id,
        shippingInfo,
        paymentMethod: 'paypal',
        promoCode: promoCode || undefined,
        paypalOrderId: paypalOrderId // Pasar el ID de orden de PayPal
      };

      const response = await checkoutService.createOrder(orderData);
      const { orderId } = response.data;

      // Redirigir a la página de éxito directamente
      navigate(`/checkout/success/${orderId}`);
      toast.success('¡Pago completado con éxito!');
    } catch (error) {
      toast.error('Error al procesar la orden. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedPlan || !selectedPaymentMethod) return;

    setIsLoading(true);
    try {
      // Crear la orden en el backend
      const orderData = {
        planId: selectedPlan.id,
        shippingInfo,
        paymentMethod: selectedPaymentMethod,
        promoCode: promoCode || undefined,
      };

      const response = await checkoutService.createOrder(orderData);
      const { orderId, paymentUrl } = response.data;

      // Redirigir a la página de pago externa o procesar el pago según el método
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        // Si no hay URL, redirigir a la página de éxito directamente (poco común)
        navigate(`/checkout/success/${orderId}`);
      }
    } catch (error) {
      toast.error('Error al procesar la orden. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'plan-selection':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Selecciona tu plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPlan?.id === plan.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <p className="text-3xl font-bold mb-4">${plan.price} USD</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 text-green-500 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(plan);
                    }}
                  >
                    Seleccionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'shipping-info':
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Información de envío</h2>
            <form onSubmit={handleShippingInfoSubmit} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre completo</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingInfoChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingInfoChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingInfoChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">Estado/Provincia</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingInfo.state}
                    onChange={handleShippingInfoChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Código Postal</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingInfoChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">País</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleShippingInfoChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Número de teléfono</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={shippingInfo.phoneNumber}
                  onChange={handleShippingInfoChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep('plan-selection')}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                >
                  Atrás
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        );

      case 'payment-method':
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Método de pago</h2>

            <div className="space-y-4 mb-8">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all flex items-center ${
                    selectedPaymentMethod === method.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                >
                  <img src={method.icon} alt={method.name} className="w-12 h-12 mr-4" />
                  <span className="text-lg font-medium">{method.name}</span>
                </div>
              ))}

              {selectedPaymentMethod === 'paypal' && (
                <div className="mt-6 border p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Pagar con PayPal</h3>
                  <PayPalButtonWrapper
                    amount={calculateFinalPrice()}
                    onSuccess={(paypalOrderId) => {
                      // Al completar el pago con PayPal, procesamos la orden
                      handlePayPalSuccess(paypalOrderId);
                    }}
                    onError={() => {
                      toast.error('Error al procesar el pago con PayPal. Por favor, intenta de nuevo.');
                    }}
                  />
                </div>
              )}
            </div>

            <div className="mt-6 border-t pt-6">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Código promocional"
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={verifyPromoCode}
                  disabled={isLoading || !promoCode}
                  className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition-colors disabled:bg-gray-400"
                >
                  {isLoading ? 'Verificando...' : 'Aplicar'}
                </button>
              </div>
              {discount > 0 && (
                <p className="mt-2 text-green-600">Descuento aplicado: {discount}%</p>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep('shipping-info')}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
              >
                Atrás
              </button>

              {selectedPaymentMethod && selectedPaymentMethod !== 'paypal' && (
                <button
                  type="button"
                  onClick={() => setCurrentStep('review')}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  Continuar
                </button>
              )}
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Revisión de orden</h2>

            {selectedPlan && (
              <div className="border rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-2">Plan seleccionado</h3>
                <div className="flex justify-between items-center mb-2">
                  <span>{selectedPlan.name}</span>
                  <span>${selectedPlan.price} USD</span>
                </div>
                <p className="text-gray-600">{selectedPlan.cardCount} tarjetas NFC</p>
              </div>
            )}

            <div className="border rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Información de envío</h3>
              <p><strong>Nombre:</strong> {shippingInfo.fullName}</p>
              <p><strong>Dirección:</strong> {shippingInfo.address}</p>
              <p><strong>Ciudad:</strong> {shippingInfo.city}</p>
              <p><strong>Estado/Provincia:</strong> {shippingInfo.state}</p>
              <p><strong>Código Postal:</strong> {shippingInfo.zipCode}</p>
              <p><strong>País:</strong> {shippingInfo.country}</p>
              <p><strong>Teléfono:</strong> {shippingInfo.phoneNumber}</p>
            </div>

            <div className="border rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Método de pago</h3>
              <p>{paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}</p>
            </div>

            <div className="border rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Resumen de precios</h3>
              {selectedPlan && (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span>Subtotal</span>
                    <span>${selectedPlan.price} USD</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center mb-2 text-green-600">
                      <span>Descuento ({discount}%)</span>
                      <span>-${(selectedPlan.price * discount / 100).toFixed(2)} USD</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>${calculateFinalPrice().toFixed(2)} USD</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setCurrentStep('payment-method')}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
              >
                Atrás
              </button>

              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={isLoading}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                {isLoading ? 'Procesando...' : 'Finalizar compra'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />

      {/* Indicador de pasos */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          <div className={`flex flex-col items-center ${currentStep === 'plan-selection' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'plan-selection' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-sm mt-1">Plan</span>
          </div>

          <div className="w-12 h-1 bg-gray-200">
            <div className={`h-full ${currentStep !== 'plan-selection' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>

          <div className={`flex flex-col items-center ${currentStep === 'shipping-info' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'shipping-info' ? 'bg-blue-600 text-white' : (currentStep === 'plan-selection' ? 'bg-gray-200' : 'bg-blue-600 text-white')}`}>
              2
            </div>
            <span className="text-sm mt-1">Envío</span>
          </div>

          <div className="w-12 h-1 bg-gray-200">
            <div className={`h-full ${currentStep === 'payment-method' || currentStep === 'review' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>

          <div className={`flex flex-col items-center ${currentStep === 'payment-method' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment-method' ? 'bg-blue-600 text-white' : (currentStep === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200')}`}>
              3
            </div>
            <span className="text-sm mt-1">Pago</span>
          </div>

          <div className="w-12 h-1 bg-gray-200">
            <div className={`h-full ${currentStep === 'review' ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          </div>

          <div className={`flex flex-col items-center ${currentStep === 'review' ? 'text-blue-600' : 'text-gray-500'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'review' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              4
            </div>
            <span className="text-sm mt-1">Revisión</span>
          </div>
        </div>
      </div>

      {/* Contenido del paso actual */}
      {renderCurrentStep()}
    </div>
  );
};

export default CheckoutPage;