// src/pages/PromoterPage.tsx
import React from 'react';

const PromoterPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Códigos de Descuento</h1>
      <p className="text-gray-600 mb-4">
        Como promotor, puedes crear y gestionar códigos de descuento para compartir con tus contactos.
      </p>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Crea tu primer código de descuento</h2>
        <p className="mb-4">
          Los códigos de descuento te permiten ofrecer un 10% de descuento a tus contactos y ganar una comisión del 5% por cada compra realizada.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Crear código de descuento
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Mis códigos de descuento</h2>
        <div className="text-center py-10 text-gray-500">
          No has creado ningún código de descuento todavía.
        </div>
      </div>
    </div>
  );
};

export default PromoterPage;