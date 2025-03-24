// src/pages/CardFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getCardById, createCard, updateCard } from '../../../services/cardService';

const CardFormPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const isEditMode = cardId !== 'new';

  const [formData, setFormData] = useState({
    name: '',
    googleLink: '',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchCard();
    }
  }, [cardId, isEditMode]);

  const fetchCard = async () => {
    try {
      setIsLoading(true);
      const card = await getCardById(cardId!);
      setFormData({
        name: card.name,
        googleLink: card.googleLink,
        isActive: card.isActive
      });
    } catch (error) {
      console.error('Error al cargar la tarjeta:', error);
      toast.error('No se pudo cargar la información de la tarjeta');
      navigate('/dashboard/cards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      if (isEditMode) {
        await updateCard(cardId!, formData);
        toast.success('Tarjeta actualizada correctamente');
      } else {
        await createCard(formData);
        toast.success('Tarjeta creada correctamente');
      }

      navigate('/dashboard/cards');
    } catch (error) {
      console.error('Error al guardar la tarjeta:', error);
      toast.error('Error al guardar la tarjeta');
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la tarjeta
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Tarjeta para mi negocio"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="googleLink" className="block text-sm font-medium text-gray-700 mb-1">
              Enlace de Google para reseñas
            </label>
            <input
              id="googleLink"
              name="googleLink"
              type="url"
              value={formData.googleLink}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://g.page/r/..."
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Ingresa el enlace de Google para que los clientes puedan dejar reseñas de tu negocio.
            </p>
          </div>

          {isEditMode && (
            <div className="mb-4 flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm font-medium text-gray-700">
                Tarjeta activa
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/cards')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70"
            >
              {isSaving ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardFormPage;