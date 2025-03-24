import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';
import { MainLayout } from "../../components/layouts/MainLayout";
import { authService } from '../../services/api';

// usar authService.login() directamente

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Por favor ingresa tu dirección de correo electrónico');
      return;
    }

    try {
      setIsSubmitting(true);

      // For development, simulate API call
      // In production, uncomment the following:
      // await endpoints.auth.forgotPassword(email);

      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      toast.success('Instrucciones de recuperación enviadas a tu correo');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Error al procesar la solicitud. Inténtalo nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
          <Link to="/login" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <FaArrowLeft className="mr-2" />
            Volver al inicio de sesión
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¿Olvidaste tu contraseña?</h1>
            <p className="text-gray-600">
              Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
                <p className="font-medium">Revisa tu correo electrónico</p>
                <p className="mt-2 text-sm">
                  Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
                  Sigue las instrucciones para restablecer tu contraseña.
                </p>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                ¿No recibiste el correo? Revisa tu carpeta de spam o solicita un nuevo enlace.
              </p>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200"
              >
                Solicitar nuevo enlace
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ForgotPasswordPage;