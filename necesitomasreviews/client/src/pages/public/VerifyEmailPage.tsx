import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { FaCheckCircle, FaExclamationTriangle, FaSpinner, FaEnvelope } from 'react-icons/fa';

const EmailVerificationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Verificar el token cuando se carga la página
    if (token) {
      verifyEmail(token);
    } else {
      setVerificationStatus('error');
      setErrorMessage('Token de verificación no proporcionado');
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await api.post('/auth/verify-email', { token: verificationToken });
      const data = response.data.data || response.data;

      setVerificationStatus('success');

      // Guardar el email para posible reenvío
      if (data.email) {
        setEmail(data.email);
      }

      // Redirigir al dashboard después de un breve retraso (3 segundos)
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error: any) {
      console.error('Error al verificar email:', error);
      setVerificationStatus('error');
      setErrorMessage(error.response?.data?.message || 'Error al verificar el correo electrónico');

      // Si el error contiene la dirección de correo (para reenvío)
      if (error.response?.data?.email) {
        setEmail(error.response.data.email);
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setErrorMessage('No se puede reenviar el correo de verificación sin una dirección de correo');
      return;
    }

    try {
      setIsResending(true);
      await api.post('/auth/resend-verification', { email });
      setResendSuccess(true);
    } catch (error: any) {
      console.error('Error al reenviar verificación:', error);
      setErrorMessage(error.response?.data?.message || 'Error al reenviar el correo de verificación');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center">
            <FaSpinner className="animate-spin text-blue-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verificando tu correo electrónico</h2>
            <p className="text-gray-600">Por favor, espera mientras verificamos tu cuenta...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Verificación exitosa!</h2>
            <p className="text-gray-600 mb-4">Tu cuenta ha sido verificada correctamente.</p>
            <p className="text-gray-600 mb-6">Serás redirigido automáticamente al dashboard en unos segundos...</p>
            <Link
              to="/dashboard"
              className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Ir al Dashboard
            </Link>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error de verificación</h2>
            <p className="text-red-600 mb-4">{errorMessage}</p>

            {email && !resendSuccess && (
              <div className="mt-4">
                <p className="text-gray-600 mb-4">¿No has recibido el correo o el enlace ha expirado?</p>
                <button
                  onClick={handleResendVerification}
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Reenviando...
                    </>
                  ) : (
                    <>
                      <FaEnvelope className="inline mr-2" />
                      Reenviar correo de verificación
                    </>
                  )}
                </button>
              </div>
            )}

            {resendSuccess && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <p className="text-green-700">
                  ¡Correo de verificación reenviado con éxito! Por favor, revisa tu bandeja de entrada.
                </p>
              </div>
            )}

            <div className="mt-6">
              <Link
                to="/login"
                className="text-blue-600 hover:underline"
              >
                Volver a iniciar sesión
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerificationPage;