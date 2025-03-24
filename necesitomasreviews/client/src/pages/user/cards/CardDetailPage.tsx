// src/pages/CardDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Definición de tipos
interface CardData {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'pending';
  qrCode: string;
  googleLink: string;
  scans: number;
  reviews: number;
  activationDate: string;
  lastScan: string | null;
  scanHistory: ScanHistoryItem[];
}

interface ScanHistoryItem {
  id: string;
  date: string;
  resultedInReview: boolean;
  userAgent: string;
  location?: string;
}

const CardDetailPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<CardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');

  // Simular carga de datos
  useEffect(() => {
    // Aquí se haría una llamada a la API para obtener los detalles de la tarjeta
    setTimeout(() => {
      setCard({
        id: cardId || 'nfc-001',
        name: 'Tarjeta Recepción',
        status: 'active',
        qrCode: 'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=https://reviews.example.com/' + cardId,
        googleLink: 'https://g.page/r/review-link',
        scans: 78,
        reviews: 52,
        activationDate: '2025-01-15',
        lastScan: '2025-03-22T14:35:42',
        scanHistory: [
          { id: 'scan-001', date: '2025-03-22T14:35:42', resultedInReview: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', location: 'Santiago, Chile' },
          { id: 'scan-002', date: '2025-03-21T11:22:15', resultedInReview: false, userAgent: 'Mozilla/5.0 (Android 12; Mobile)', location: 'Santiago, Chile' },
          { id: 'scan-003', date: '2025-03-20T09:15:30', resultedInReview: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)', location: 'Santiago, Chile' },
          { id: 'scan-004', date: '2025-03-19T16:42:10', resultedInReview: true, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', location: 'Santiago, Chile' },
          { id: 'scan-005', date: '2025-03-18T13:05:22', resultedInReview: false, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', location: 'Santiago, Chile' }
        ]
      });
      setLoading(false);
    }, 800);
  }, [cardId]);

  // Función para renderizar el estado
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Activa
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Inactiva
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        );
      default:
        return null;
    }
  };

  // Función para formatear fechas
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Tarjeta no encontrada</h2>
        <p className="text-gray-600 mb-6">No pudimos encontrar la tarjeta que estás buscando.</p>
        <Link to="/cards" className="text-blue-600 hover:text-blue-800">
          Volver a mis tarjetas
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/cards" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a mis tarjetas
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-800 mr-3">{card.name}</h1>
            {renderStatusBadge(card.status)}
          </div>
          <div>
            {card.status === 'active' ? (
              <button className="px-4 py-2 text-red-600 hover:text-red-800 focus:outline-none">
                Desactivar
              </button>
            ) : (
              <button className="px-4 py-2 text-green-600 hover:text-green-800 focus:outline-none">
                Activar
              </button>
            )}
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ml-2">
              Editar
            </button>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'overview' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Resumen
            </button>
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'history' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Historial
            </button>
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'settings' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Configuración
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Información de la Tarjeta</h3>
                    <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">ID</dt>
                        <dd className="mt-1 text-sm text-gray-900">{card.id}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Estado</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {renderStatusBadge(card.status)}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Fecha de Activación</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(card.activationDate)}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Último Escaneo</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {formatDate(card.lastScan)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Estadísticas</h3>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <dt className="text-sm font-medium text-gray-500">Escaneos</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">{card.scans}</dd>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <dt className="text-sm font-medium text-gray-500">Reseñas</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">{card.reviews}</dd>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <dt className="text-sm font-medium text-gray-500">Tasa Conversión</dt>
                        <dd className="mt-1 text-2xl font-semibold text-gray-900">
                          {card.scans > 0 ? `${Math.round((card.reviews / card.scans) * 100)}%` : '0%'}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Código QR</h3>
                    <div className="mt-4 flex flex-col items-center">
                      <img
                        src={card.qrCode}
                        alt="QR Code"
                        className="w-48 h-48 border border-gray-200 rounded-md"
                      />
                      <div className="mt-4 flex space-x-2">
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Descargar
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Imprimir
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Enlace de Reseña</h3>
                    <div className="mt-4">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={card.googleLink}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button className="ml-2 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          Copiar
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Este es el enlace directo a la página de reseñas de Google que utiliza tu tarjeta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History tab */}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Historial de Escaneos</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dispositivo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ubicación
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resultado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {card.scanHistory.map((scan) => (
                      <tr key={scan.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(scan.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {scan.userAgent.includes('iPhone') ? 'iPhone' :
                            scan.userAgent.includes('Android') ? 'Android' :
                            scan.userAgent.includes('Windows') ? 'Windows' :
                            scan.userAgent.includes('Mac') ? 'Mac' : 'Desconocido'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {scan.location || 'Desconocida'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {scan.resultedInReview ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Reseña completada
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Sin reseña
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings tab */}
          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración de la Tarjeta</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                    Nombre de la tarjeta
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    defaultValue={card.name}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="googleReviewLink" className="block text-sm font-medium text-gray-700">
                    Enlace de reseña de Google
                  </label>
                  <input
                    type="text"
                    id="googleReviewLink"
                    name="googleReviewLink"
                    defaultValue={card.googleLink}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Estado de la tarjeta</h4>
                  <div className="mt-1 flex items-center">
                    <input
                      id="status-active"
                      name="status"
                      type="radio"
                      defaultChecked={card.status === 'active'}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="status-active" className="ml-2 block text-sm text-gray-700">
                      Activa
                    </label>
                  </div>
                  <div className="mt-1 flex items-center">
                    <input
                      id="status-inactive"
                      name="status"
                      type="radio"
                      defaultChecked={card.status === 'inactive'}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="status-inactive" className="ml-2 block text-sm text-gray-700">
                      Inactiva
                    </label>
                  </div>
                </div>

                <div className="pt-5 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetailPage;