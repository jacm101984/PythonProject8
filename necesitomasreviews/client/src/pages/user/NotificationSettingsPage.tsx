// src/pages/NotificationSettingsPage.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaBell, FaSave } from 'react-icons/fa';
import { notificationService } from '../../services/notificationService';

interface NotificationSettings {
  emailNotifications: boolean;
  userRegistrations: boolean;
  newOrders: boolean;
  cardActivations: boolean;
  systemAlerts: boolean;
  promoterCommissions: boolean;
  reviewNotifications: boolean;
}

const NotificationSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    userRegistrations: true,
    newOrders: true,
    cardActivations: true,
    systemAlerts: true,
    promoterCommissions: true,
    reviewNotifications: true
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await notificationService.getNotificationSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      toast.error('Error al cargar la configuración de notificaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await notificationService.updateNotificationSettings(settings);
      toast.success('Configuración guardada correctamente');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configuración de Notificaciones</h1>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
              Guardando...
            </>
          ) : (
            <>
              <FaSave className="mr-2" /> Guardar Cambios
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <FaBell className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold">Preferencias Generales</h2>
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="emailNotifications" className="font-medium text-gray-700">
                  Recibir notificaciones por email
                </label>
      <p className="text-gray-500">
                  Recibe un correo electrónico cuando ocurran eventos importantes.
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <h3 className="text-lg font-medium text-gray-800">Tipos de Notificaciones</h3>
            <p className="text-sm text-gray-500 mb-4">
              Selecciona qué tipos de notificaciones deseas recibir.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="userRegistrations"
                    name="userRegistrations"
                    type="checkbox"
                    checked={settings.userRegistrations}
                    onChange={() => handleToggle('userRegistrations')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="userRegistrations" className="font-medium text-gray-700">
                    Registros de usuarios
                  </label>
                  <p className="text-gray-500">
                    Notificaciones cuando nuevos usuarios se registren en la plataforma.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newOrders"
                    name="newOrders"
                    type="checkbox"
                    checked={settings.newOrders}
                    onChange={() => handleToggle('newOrders')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newOrders" className="font-medium text-gray-700">
                    Nuevas órdenes
                  </label>
                  <p className="text-gray-500">
                    Notificaciones cuando se realicen nuevas compras de tarjetas.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="cardActivations"
                    name="cardActivations"
                    type="checkbox"
                    checked={settings.cardActivations}
                    onChange={() => handleToggle('cardActivations')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="cardActivations" className="font-medium text-gray-700">
                    Activaciones de tarjetas
                  </label>
                  <p className="text-gray-500">
                    Notificaciones cuando se activen tarjetas NFC.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="reviewNotifications"
                    name="reviewNotifications"
                    type="checkbox"
                    checked={settings.reviewNotifications}
                    onChange={() => handleToggle('reviewNotifications')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="reviewNotifications" className="font-medium text-gray-700">
                    Nuevas reseñas
                  </label>
                  <p className="text-gray-500">
                    Notificaciones cuando se generen nuevas reseñas a través de tus tarjetas.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="promoterCommissions"
                    name="promoterCommissions"
                    type="checkbox"
                    checked={settings.promoterCommissions}
                    onChange={() => handleToggle('promoterCommissions')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="promoterCommissions" className="font-medium text-gray-700">
                    Comisiones de promotor
                  </label>
                  <p className="text-gray-500">
                    Notificaciones sobre comisiones generadas (solo para promotores).
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="systemAlerts"
                    name="systemAlerts"
                    type="checkbox"
                    checked={settings.systemAlerts}
                    onChange={() => handleToggle('systemAlerts')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="systemAlerts" className="font-medium text-gray-700">
                    Alertas del sistema
                  </label>
                  <p className="text-gray-500">
                    Notificaciones sobre cambios importantes en el sistema y eventos de seguridad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 text-right">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;