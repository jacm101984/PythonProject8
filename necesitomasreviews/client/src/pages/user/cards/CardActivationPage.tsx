// src/pages/CardActivationPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cardService } from '../../../services/cardService';

const CardActivationPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const [googlePlaceId, setGooglePlaceId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'confirmation' | 'success'>('details');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googlePlaceId || !businessName) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      // Validar el Place ID con la API de Google
      const isValidPlaceId = await cardService.validateGooglePlaceId(googlePlaceId);

      if (!isValidPlaceId) {
        toast.error('El ID de Place de Google no es válido');
        setIsLoading(false);
        return;
      }

      // Avanzar al paso de confirmación
      setStep('confirmation');
    } catch (error) {
      console.error('Error validando Place ID:', error);
      toast.error('Ocurrió un error al validar el ID de Google');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmActivation = async () => {
    setIsLoading(true);
    try {
      await cardService.activateCard(cardId!, {
        googlePlaceId,
        businessName
      });
      setStep('success');
      toast.success('¡Tarjeta activada con éxito!');
    } catch (error) {
      console.error('Error activando tarjeta:', error);
      toast.error('No se pudo activar la tarjeta. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizado condicional según el paso actual
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      {step === 'details' && (
        <>
          <h1 className="text-2xl font-bold mb-6">Activar Tarjeta NFC</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Restaurante El Fogón"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID de Google Place
                </label>
                <input
                  type="text"
                  value={googlePlaceId}
                  onChange={(e) => setGooglePlaceId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ChIJ..."
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Puedes encontrar este ID en tu perfil de Google My Business
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                >
                  {isLoading ? 'Validando...' : 'Continuar'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {step === 'confirmation' && (
        <>
          <h1 className="text-2xl font-bold mb-6">Confirmar Activación</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <p className="text-gray-700">
                Estás a punto de activar esta tarjeta NFC para:
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-semibold">{businessName}</p>
                <p className="text-sm text-gray-600 mt-1">Place ID: {googlePlaceId}</p>
              </div>
              <p className="text-gray-700">
                Una vez activada, la tarjeta dirigirá a los usuarios a dejar reseñas para este negocio en Google.
              </p>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Atrás
                </button>
                <button
                  onClick={confirmActivation}
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                >
                  {isLoading ? 'Activando...' : 'Confirmar Activación'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {step === 'success' && (
        <>
          <div className="text-center">
            <div className="bg-green-100 inline-block p-4 rounded-full mb-4">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">¡Tarjeta Activada!</h1>
            <p className="text-gray-600 mb-6">
              Tu tarjeta NFC ha sido activada exitosamente y está lista para usar.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/dashboard/cards')}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Ver Mis Tarjetas
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Ir al Dashboard
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CardActivationPage;