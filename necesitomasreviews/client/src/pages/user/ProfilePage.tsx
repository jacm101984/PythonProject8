// src/pages/user/ProfilePage.tsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Estados para el formulario
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState('Mi Empresa');
  const [phone, setPhone] = useState('+1 555-123-4567');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Función para manejar el envío del formulario de perfil
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el perfil
    setSuccessMessage('Perfil actualizado correctamente');
    setIsEditing(false);

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Función para manejar el envío del formulario de contraseña
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para cambiar la contraseña
    setSuccessMessage('Contraseña actualizada correctamente');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {/* Información del Perfil */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Información Personal</h2>
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nombre</p>
                    <p className="mt-1 text-gray-900">{name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-gray-900">{email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Empresa</p>
                    <p className="mt-1 text-gray-900">{company}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Teléfono</p>
                    <p className="mt-1 text-gray-900">{phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Cambio de Contraseña */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Cambiar Contraseña</h2>
          </div>

          <div className="p-6">
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;