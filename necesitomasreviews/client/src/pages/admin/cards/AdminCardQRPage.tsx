// src/pages/AdminCardQRPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaCreditCard, FaDownload, FaPrint, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

interface NFCCard {
  id: string;
  uid: string;
  name: string;
  businessName: string;
  googleReviewLink: string;
  qrCodeUrl: string; // URL del código QR
}

const AdminCardQRPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const qrRef = useRef<HTMLDivElement>(null);

  // Base path para las rutas dependiendo del rol
  const basePath = isSuperAdmin ? '/admin' : '/regional-admin';

  const [card, setCard] = useState<NFCCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        // En producción, esto sería una llamada real a la API
        // const response = await api.get(`/admin/cards/${cardId}/qr`);
        // setCard(response.data.data);

        // Por ahora, usamos datos de ejemplo
        setCard({
          id: cardId || '1',
          uid: 'NFC001',
          name: 'Tarjeta Principal',
          businessName: 'Café del Centro',
          googleReviewLink: 'https://g.page/r/example1',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://g.page/r/example1'
        });

        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos de la tarjeta:', error);
        setError('No se pudo cargar la información de la tarjeta');
        setLoading(false);
      }
    };

    fetchCard();
  }, [cardId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!card) return;

    // En una implementación real, aquí podrías usar una biblioteca como html2canvas
    // para convertir el div en una imagen descargable

    toast.success('Código QR descargado');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4">
          <h3 className="text-lg font-medium">Error</h3>
          <p>{error || 'No se pudo encontrar la tarjeta'}</p>
          <button
            className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
            onClick={() => navigate(`${basePath}/cards`)}
          >
            Volver a la lista de tarjetas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`${basePath}/cards`)}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Código QR de Tarjeta</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            <FaPrint className="mr-2" /> Imprimir
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FaDownload className="mr-2" /> Descargar
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{card.name}</h2>
          <p className="text-gray-600 mb-6">{card.businessName}</p>

          <div
            ref={qrRef}
            className="max-w-xs mx-auto p-4 border-2 border-dashed border-gray-300 rounded-lg"
          >
            <div className="flex justify-center items-center mb-4">
              <FaCreditCard className="text-blue-500 h-8 w-8" />
            </div>

            <img
              src={card.qrCodeUrl}
              alt={`Código QR para ${card.name}`}
              className="mx-auto mb-4"
              style={{ width: '200px', height: '200px' }}
            />

            <p className="text-sm text-gray-500 mb-2">Escanea para dejar tu reseña</p>
            <p className="text-xs text-gray-400">ID: {card.uid}</p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600">
              Enlace de reseña: <a href={card.googleReviewLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{card.googleReviewLink}</a>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Instrucciones</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Imprima o descargue este código QR para colocarlo en un lugar visible.</li>
          <li>Los clientes pueden escanear este código para dejar una reseña de Google.</li>
          <li>Puede personalizar o reemplazar la tarjeta NFC en cualquier momento.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminCardQRPage;