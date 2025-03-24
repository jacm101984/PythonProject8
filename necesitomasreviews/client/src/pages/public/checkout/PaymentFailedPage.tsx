// src/pages/PaymentFailedPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../components/layouts/MainLayout';

const PaymentFailedPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pago no completado</h2>
          <p className="text-gray-600 mb-6">
            Lo sentimos, hubo un problema al procesar tu pago. No te preocupes, no se ha realizado ningún cargo a tu cuenta.
          </p>
          <div className="space-y-3">
            <Link to="/checkout" className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200">
              Intentar nuevamente
            </Link>
            <Link to="/" className="block w-full py-2 px-4 bg-transparent hover:bg-gray-100 text-gray-700 font-medium rounded-md transition duration-200">
              Volver al inicio
            </Link>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p>¿Necesitas ayuda? <a href="mailto:support@necesitomasreviews.com" className="text-blue-600 hover:text-blue-800">Contacta con soporte</a></p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentFailedPage;