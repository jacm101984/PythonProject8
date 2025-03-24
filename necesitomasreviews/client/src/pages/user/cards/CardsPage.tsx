import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getUserCards, updateCard } from '../../../services/cardService';
import { FaPlus, FaQrcode, FaChartBar, FaEdit } from 'react-icons/fa';

interface NfcCard {
  id: string;
  name: string;
  isActive: boolean;
  googleLink: string;
  totalScans: number;
  totalReviews: number;
  lastScan: string | null;
  createdAt: string;
}

const CardsPage: React.FC = () => {
  const [cards, setCards] = useState<NfcCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<NfcCard | null>(null);
  const [googleLink, setGoogleLink] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const data = await getUserCards();
      setCards(data);
    } catch (error) {
      console.error('Error al cargar tarjetas:', error);
      toast.error('No se pudieron cargar las tarjetas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigureCard = (card: NfcCard) => {
    setEditingCard(card);
    setGoogleLink(card.googleLink);
  };

  const handleSaveConfiguration = async () => {
    if (!editingCard) return;

    try {
      await updateCard(editingCard.id, { googleLink, isActive: !!googleLink });
      toast.success('Tarjeta configurada correctamente');

      // Actualizar estado local
      setCards(cards.map(card =>
        card.id === editingCard.id
          ? { ...card, googleLink, isActive: !!googleLink }
          : card
      ));
      setEditingCard(null);
    } catch (error) {
      console.error('Error al configurar la tarjeta:', error);
      toast.error('Error al configurar la tarjeta');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Tarjetas</h1>
        <div className="flex space-x-3">
          <Link
            to="/dashboard/cards/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" /> Nueva Tarjeta
          </Link>
          <Link
            to="/checkout"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Comprar más
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-5xl mb-4">📇</div>
          <h2 className="text-2xl font-semibold mb-2">No tienes tarjetas aún</h2>
          <p className="text-gray-600 mb-6">Compra tu primera tarjeta NFC para comenzar a recibir reseñas</p>
          <Link
            to="/checkout"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Comprar tarjetas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cards.map(card => (
            <div key={card.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold">{card.name}</h2>
                      <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                        card.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {card.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>

                    {card.googleLink && (
                      <p className="text-gray-600 mt-1">
                        <a
                          href={card.googleLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Ver enlace de Google
                        </a>
                      </p>
                    )}

                    <div className="mt-4 text-sm text-gray-500">
                      <div className="flex items-center mb-1">
                        <span className="w-32">Total de escaneos:</span>
                        <span className="font-medium">{card.totalScans}</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="w-32">Total de reseñas:</span>
                        <span className="font-medium">{card.totalReviews}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32">Último escaneo:</span>
                        <span className="font-medium">{formatDate(card.lastScan)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {card.isActive && (
                      <>
                        <Link
                          to={`/dashboard/cards/${card.id}/stats`}
                          className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                        >
                          <FaChartBar className="mr-2" /> Estadísticas
                        </Link>
                        <Link
                          to={`/dashboard/cards/${card.id}/qr`}
                          className="flex items-center px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition"
                        >
                          <FaQrcode className="mr-2" /> Ver QR
                        </Link>
                      </>
                    )}
                    <Link
                      to={`/dashboard/cards/${card.id}/edit`}
                      className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition"
                    >
                      <FaEdit className="mr-2" /> Editar
                    </Link>
                  </div>
                </div>
              </div>

              {card.isActive && (
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Creada el {new Date(card.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => handleConfigureCard(card)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Configurar enlace
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal para configurar tarjeta */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Configurar tarjeta</h2>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre de la tarjeta
                </label>
                <input
                  type="text"
                  value={editingCard.name}
                  disabled
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Enlace de Google para reseñas
                </label>
                <input
                  type="url"
                  value={googleLink}
                  onChange={(e) => setGoogleLink(e.target.value)}
                  placeholder="https://g.page/r/..."
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ingresa el enlace completo de tu negocio en Google para recibir reseñas
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingCard(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveConfiguration}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsPage;