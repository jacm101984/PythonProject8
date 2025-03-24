import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-hot-toast';

interface PayPalButtonWrapperProps {
  amount: number;
  onSuccess: (orderId: string) => void;
  onError: () => void;
}

const PayPalButtonWrapper: React.FC<PayPalButtonWrapperProps> = ({
  amount,
  onSuccess,
  onError
}) => {
  const [{ isPending }] = usePayPalScriptReducer();

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Cargando PayPal...</span>
      </div>
    );
  }

  return (
    <PayPalButtons
      style={{ layout: "vertical", label: "pay" }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: amount.toFixed(2),
                currency_code: "USD"
              },
              description: "Compra de tarjetas NFC en necesitomasreviews.com"
            },
          ],
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then(function (details) {
          toast.success(`Pago completado por ${details.payer.name?.given_name || 'Usuario'}`);
          onSuccess(data.orderID);
        });
      }}
      onError={(err) => {
        console.error('Error en el pago con PayPal:', err);
        toast.error('Hubo un error al procesar tu pago con PayPal');
        onError();
      }}
    />
  );
};

export default PayPalButtonWrapper;