// src/pages/AdminPromotersPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { adminService } from '../../../services/adminService';
import RegionalFilter from '../../../components/RegionalFilter';

interface Promoter {
  id: string;
  name: string;
  email: string;
  regionId: string;
  regionName: string;
  totalCodes: number;
  totalConversions: number;
  totalCommissions: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const AdminPromotersPage: React.FC = () => {
  const navigate = useNavigate();
  const [promoters, setPromoters] = useState<Promoter[]>([]);
  const [filteredPromoters, setFilteredPromoters] = useState<Promoter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  useEffect(() => {
    fetchPromoters();
  }, []);

  useEffect(() => {
    // Aplicar filtros cuando cambien los promotores, el término de búsqueda o la región
    let result = [...promoters];

    // Filtrar por región
    if (selectedRegion) {
      result = result.filter(promoter => promoter.regionId === selectedRegion);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        promoter =>
          promoter.name.toLowerCase().includes(term) ||
          promoter.email.toLowerCase().includes(term)
      );
    }

    setFilteredPromoters(result);
  }, [promoters, searchTerm, selectedRegion]);

  const fetchPromoters = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getPromoters();
      setPromoters(data);
      setFilteredPromoters(data);
    } catch (error) {
      console.error('Error fetching promoters:', error);
      toast.error('Error al cargar la lista de promotores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePromoter = () => {
    navigate('/admin/promoters/create');
  };

  const handleEditPromoter = (id: string) => {
    navigate(`/admin/promoters/${id}/edit`);
  };

  const handleDeletePromoter = async (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al promotor "${name}"?`)) {
      try {
        await adminService.deletePromoter(id);
        toast.success('Promotor eliminado con éxito');
        setPromoters(promoters.filter(promoter => promoter.id !== id));
      } catch (error) {
        console.error('Error deleting promoter:', error);
        toast.error('Error al eliminar el promotor');
      }
    }
  };

  const handleRegionChange = (regionId: string | null) => {
    setSelectedRegion(regionId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Promotores</h1>
        <button
          onClick={handleCreatePromoter}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" /> Nuevo Promotor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="md:w-64">
            <RegionalFilter onRegionChange={handleRegionChange} allowAll={true} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPromoters.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron promotores</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedRegion
                ? 'Intenta con otros filtros de búsqueda'
                : 'Comienza creando un nuevo promotor para tu región'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Región
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Códigos
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversiones
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comisiones
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromoters.map((promoter) => (
                  <tr key={promoter.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{promoter.name}</div>
                      <div className="text-sm text-gray-500">ID: {promoter.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promoter.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promoter.regionName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promoter.totalCodes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {promoter.totalConversions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${promoter.totalCommissions.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promoter.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {promoter.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditPromoter(promoter.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit className="inline" /> Editar
                      </button>
                      <button
                        onClick={() => handleDeletePromoter(promoter.id, promoter.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash className="inline" /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPromotersPage;