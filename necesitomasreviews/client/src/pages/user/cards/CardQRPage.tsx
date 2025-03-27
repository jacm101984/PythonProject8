// src/pages/user/cards/CardQRPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Necesitarás instalar react-qr-code: npm install react-qr-code
import QRCode from 'react-qr-code';
import { getCardById, getCardQRUrl } from '../../../services/cardService';
import { toast } from 'react-hot-toast';

const CardQRPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    const fetchCard = async () => {
      try {
        setLoading(true);
        if (id) {
          const cardData = await getCardById(id);
          setCard(cardData);
          setQrUrl(getCardQRUrl(cardData.uid));
        }
      } catch (error) {
        console.error('Error al cargar la tarjeta:', error);
        toast.error('No se pudo cargar la información de la tarjeta');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [id]);

  const handleDownload = () => {
    // Con react-qr-code, necesitamos convertir el SVG a imagen
    const svg = document.getElementById('qr-code-canvas');
    if (svg) {
      // Crear un canvas temporal
      const canvas = document.createElement('canvas');
      canvas.width = 250;
      canvas.height = 250;

      // Convertir SVG a imagen
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      img.onload = () => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          const url = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = url;
          link.download = `QR-${card?.name || 'card'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('qr-print-area');
    const windowContent = '<!DOCTYPE html><html><head><title>Imprimir QR</title></head><body>' +
      printContent?.innerHTML + '</body></html>';

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write(windowContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-gray-900">Tarjeta no encontrada</h3>
        <p className="mt-1 text-sm text-gray-500">No se pudo encontrar la tarjeta solicitada.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Código QR para "{card.name}"</h1>

        <div id="qr-print-area" className="flex flex-col items-center mb-8">
          <div className="mb-4 p-4 bg-white rounded-lg shadow">
            <QRCode
              id="qr-code-canvas"
              value={qrUrl}
              size={250}
              level="H"
              style={{ width: '250px', height: '250px', maxWidth: '100%' }}
            />
          </div>

          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-1">Escanea este código para acceder a:</p>
            <p className="font-medium text-blue-600 break-all">{qrUrl}</p>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Descargar QR
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Imprimir QR
          </button>
        </div>

        <div className="mt-8 border-t pt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Instrucciones</h2>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Descarga o imprime este código QR.</li>
            <li>Colócalo en un lugar visible de tu negocio.</li>
            <li>Cuando un cliente lo escanee, será dirigido a dejar una reseña.</li>
            <li>Recuerda que puedes imprimir múltiples copias para diferentes ubicaciones.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CardQRPage;