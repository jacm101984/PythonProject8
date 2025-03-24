// src/pages/NotFoundPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layouts/MainLayout';

const NotFoundPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <h1 className="text-9xl font-bold text-blue-600">404</h1>
            <h2 className="text-3xl font-semibold text-gray-900 mt-2">Página no encontrada</h2>
            <p className="mt-4 text-gray-600">
              Lo sentimos, la página que estás buscando no existe o ha sido movida.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al inicio
            </Link>

            <div className="text-sm text-gray-500 mt-4">
              ¿Necesitas ayuda? <a href="mailto:support@necesitomasreviews.com" className="text-blue-600 hover:underline">Contacta con soporte</a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;