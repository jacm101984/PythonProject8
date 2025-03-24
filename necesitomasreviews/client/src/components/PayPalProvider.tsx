import React, { ReactNode } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PayPalProviderProps {
  children: ReactNode;
}

const PayPalProvider: React.FC<PayPalProviderProps> = ({ children }) => {
  // Opciones iniciales para el SDK de PayPal
  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture"
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
};

export default PayPalProvider;