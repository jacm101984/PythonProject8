// src/pages/OrdersPage.tsx
import React from 'react';

const OrdersPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mis Pedidos</h1>
      <p className="text-gray-600">
        Aquí puedes ver el historial de tus pedidos.
      </p>
      <div className="mt-8 text-center text-gray-500">
        No tienes ningún pedido en este momento.
      </div>
    </div>
  );
};

export default OrdersPage;

