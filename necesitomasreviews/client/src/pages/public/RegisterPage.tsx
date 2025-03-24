import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';
// Quitar esta importación
// import { MainLayout } from "../components/layouts/MainLayout";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    toast.error('Por favor completa todos los campos');
    return;
  }

  if (password !== confirmPassword) {
    toast.error('Las contraseñas no coinciden');
    return;
  }

  if (!agreeTerms) {
    toast.error('Debes aceptar los términos y condiciones');
    return;
  }

  try {
    setIsLoading(true);
    // Enviar todos los datos como un objeto
    await register({
      name,
      email,
      password
    });
    toast.success('Registro exitoso. Por favor verifica tu correo electrónico.');
    navigate('/login');
  } catch (error) {
    toast.error('Error al registrarse. Inténtalo de nuevo.');
    console.error('Register error:', error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    // Quitar este wrapper de MainLayout
    // <MainLayout>
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] py-8">
        <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
          {/* Resto del contenido sin cambios */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Crear cuenta</h1>
            <p className="text-gray-600 mt-2">Regístrate para comenzar a usar nuestras tarjetas NFC</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Resto del formulario sin cambios */}
            {/* ... */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tu nombre"
                required
              />
            </div>

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
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

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Acepto los{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Términos y Condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    Política de Privacidad
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O regístrate con</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaGoogle className="h-5 w-5 text-red-500 mr-2" />
                Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    // </MainLayout>  Eliminar este cierre
  );
};

export default RegisterPage;