import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { authService } from '../../services/api';

// usar authService.login() directamente

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  // Validar que el token existe
  useEffect(() => {
    if (!token) {
      setError('Token de restablecimiento inválido');
      toast.error('El enlace de restablecimiento de contraseña es inválido');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Token de restablecimiento inválido');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      // Enviamos la solicitud al backend
      await endpoints.auth.resetPassword(token, password);

      setIsSuccess(true);
      toast.success('Contraseña restablecida con éxito');

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      setError('No se pudo restablecer la contraseña. El enlace puede haber expirado o ser inválido.');
      toast.error('Error al restablecer la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Contraseña restablecida!</h1>
          <p className="text-gray-600 mb-6">
            Tu contraseña ha sido restablecida con éxito.
          </p>
          <p className="text-gray-600">
            Serás redirigido a la página de inicio de sesión en unos segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaLock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Restablecer contraseña</h1>
          <p className="text-gray-600 mt-2">
            Ingresa tu nueva contraseña a continuación
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Al menos 8 caracteres"
              minLength={8}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirma tu contraseña"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Procesando...' : 'Restablecer contraseña'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Recordaste tu contraseña?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;