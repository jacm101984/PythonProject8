import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const PremiumRequired: React.FC = () => {
  const location = useLocation();
  const fromPath = location.state?.from?.pathname || '/dashboard';

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto my-12">
      <div className="mb-6 text-center">
        <svg
          className="w-24 h-24 text-yellow-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-12l-3 9-3-9h6z"
          />
        </svg>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Función Premium</h1>
        <p className="text-lg text-gray-600">
          Esta característica está disponible exclusivamente para suscriptores premium.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg w-full mb-6">
        <h2 className="text-xl font-semibold mb-4">Beneficios de la suscripción Premium:</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Estadísticas avanzadas y análisis detallado de tus tarjetas NFC</span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Reportes personalizados exportables a PDF y Excel</span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Alertas automáticas y notificaciones personalizables</span>
          </li>
          <li className="flex items-start">
            <svg
              className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Prioridad en soporte técnico</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <Link
          to="/dashboard/subscription-plans"
          className="flex-1 bg-blue-600 text-white text-center py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Ver Planes Premium
        </Link>
        <Link
          to={fromPath}
          className="flex-1 bg-gray-200 text-gray-800 text-center py-3 px-6 rounded-md font-medium hover:bg-gray-300 transition-colors"
        >
          Volver
        </Link>
      </div>
    </div>
  );
};

export default PremiumRequired;