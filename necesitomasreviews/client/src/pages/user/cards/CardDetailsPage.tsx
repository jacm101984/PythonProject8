// src/pages/CardDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { cardService } from '../../../services/cardService';
import QRCode from 'react-qr-code';; // Necesitas instalar esta dependencia

interface CardDetails {
  id: string;
  uid: string;
  status: 'active' | 'inactive';
  businessName: string;
  googlePlaceId: string;
  activationDate: string | null;
  reviewUrl: string;
  totalScans: number;
  totalReviews: number;
}

const CardDetailsPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<CardDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const data = await cardService.getCardDetails(cardId!);
        setCard(data);
      } catch (error) {
        console.error('Error fetching card details:', error);
        setError('No se pudo cargar los detalles de la tarjeta');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardDetails();
  }, [cardId]);

  const copyToClipboard = () => {
    if (card) {
      navigator.clipboard.writeText(card.reviewUrl);
      setIsCopied(true);
      toast.success('Enlace copiado al portapapeles');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
        <p className="text-gray-600">{error || 'No se encontraron datos de la tarjeta'}</p>
        <Link to="/dashboard/cards" className="inline-block mt-4 text-blue-600 hover:underline">
          Volver a mis tarjetas
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/dashboard/cards" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver a mis tarjetas
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{card.businessName}</h1>
              <p className="text-gray-500 mt-1">ID: {card.id}</p>
              <div className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {card.status === 'active' ? 'Activa' : 'Inactiva'}
              </div>
            </div>

            {card.status === 'inactive' && (
              <Link
                to={`/dashboard/cards/${cardId}/activate`}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Activar Tarjeta
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-lg font-semibold mb-4">Detalles de la Tarjeta</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">UID de la Tarjeta</p>
                  <p className="font-medium">{card.uid}</p>
                </div>
                {card.activationDate && (
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Activación</p>
                    <p className="font-medium">
                      {new Date(card.activationDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Google Place ID</p>
                  <p className="font-medium">{card.googlePlaceId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enlace para Reseñas</p>
                  <div className="flex items-center mt-1">
                    <input
                      type="text"
                      value={card.reviewUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="ml-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition-colors"
                    >
                      {isCopied ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCode value={card.reviewUrl} size={200} />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Escanea este código para ver la página de reviews
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Estadísticas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-blue-600">{card.totalScans}</p>
                <p className="text-gray-600">Escaneos Totales</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-3xl font-bold text-green-600">{card.totalReviews}</p>
                <p className="text-gray-600">Reseñas Generadas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsPage;