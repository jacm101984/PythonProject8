import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getCardById } from '../../../services/cardService';
import { FaArrowLeft, FaDownload, FaShareAlt } from 'react-icons/fa';

interface CardDetails {
  id: string;
  name: string;
  isActive: boolean;
  googleLink: string;
  totalScans: number;
  totalReviews: number;
  lastScan: string | null;
  createdAt: string;
}

const CardQRPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [card, setCard] = useState<CardDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [qrSize, setQrSize] = useState<number>(250);

  useEffect(() => {
    fetchCard();
  }, [cardId]);

  const fetchCard = async () => {
    try {
      setIsLoading(true);
      const data = await getCardById(cardId!);
      setCard(data);
    } catch (error) {
      console.error('Error al cargar la tarjeta:', error);
      toast.error('No se pudo cargar la información de la tarjeta');
    } finally {
      setIsLoading(false);
    }
  };

  // Versión simplificada sin usar biblioteca QR
  const getQRImageUrl = () => {
    if (!card) return '';
    // Usar un servicio en línea para generar QR temporalmente
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(`https://necesitomasreviews.com/redirect/${card.id}`)}`;
  };

  const downloadQRCode = () => {
    if (!card) return;

    // Abrir la imagen en una nueva pestaña para descargar
    const qrImageUrl = getQRImageUrl();
    window.open(qrImageUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No se encontró información de la tarjeta</p>
        <Link to="/dashboard/cards" className="text-blue-600 hover:underline mt-4 inline-block">
          Volver a mis tarjetas
        </Link>
      </div>
    );
  }

  // URL a la que redirigirá el QR cuando sea escaneado
  const qrValue = `https://necesitomasreviews.com/redirect/${card.id}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          to="/dashboard/cards"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Volver a mis tarjetas
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Código QR: {card.name}</h1>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <img
              src={getQRImageUrl()}
              alt={`QR Code para ${card.name}`}
              width={qrSize}
              height={qrSize}
              className="border rounded-sm"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="qr-size" className="block text-sm font-medium text-gray-700 mb-1">
            Tamaño del QR
          </label>
          <input
            id="qr-size"
            type="range"
            min="100"
            max="400"
            step="10"
            value={qrSize}
            onChange={(e) => setQrSize(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Pequeño</span>
            <span>Grande</span>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={downloadQRCode}
            className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaDownload className="mr-2" /> Descargar QR
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Instrucciones</h3>
          <p className="text-sm text-blue-700 mb-2">
            Este código QR redirige a tus clientes directamente a la página de reseñas de Google.
          </p>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Imprime este QR y colócalo en un lugar visible</li>
            <li>Los clientes pueden escanearlo con la cámara de su smartphone</li>
            <li>Serán redirigidos automáticamente para dejar una reseña</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CardQRPage;