// src/pages/RegionsPage.tsx

import React, { useState, useEffect } from 'react';

// Tipos de datos
interface Region {
  id: string;
  name: string;
  country: string;
  adminName: string | null;
  adminId: string | null;
  usersCount: number;
  promotersCount: number;
  cardsCount: number;
  active: boolean;
  createdAt: string;
}

const RegionsPage: React.FC = () => {
  // Estados para regiones y modal
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);

  // Estados para el formulario
  const [formName, setFormName] = useState('');
  const [formCountry, setFormCountry] = useState('');
  const [formAdminId, setFormAdminId] = useState('');

  // Cargar datos de ejemplo
  useEffect(() => {
    // Simular carga de datos desde API
    setTimeout(() => {
      const mockRegions = [
        {
          id: '1',
          name: 'Santiago',
          country: 'Chile',
          adminName: 'Ana Martínez',
          adminId: '4',
          usersCount: 248,
          promotersCount: 12,
          cardsCount: 532,
          active: true,
          createdAt: '2024-12-10T15:30:00'
        },
        {
          id: '2',
          name: 'Valparaíso',
          country: 'Chile',
          adminName: 'Roberto Silva',
          adminId: '8',
          usersCount: 125,
          promotersCount: 6,
          cardsCount: 287,
          active: true,
          createdAt: '2025-01-05T10:15:00'
        },
        {
          id: '3',
          name: 'Concepción',
          country: 'Chile',
          adminName: 'Patricia Lagos',
          adminId: '12',
          usersCount: 98,
          promotersCount: 4,
          cardsCount: 156,
          active: true,
          createdAt: '2025-01-10T09:20:00'
        },
        {
          id: '4',
          name: 'Antofagasta',
          country: 'Chile',
          adminName: null,
          adminId: null,
          usersCount: 45,
          promotersCount: 2,
          cardsCount: 67,
          active: false,
          createdAt: '2025-02-15T14:45:00'
        },
        {
          id: '5',
          name: 'Ciudad de México',
          country: 'México',
          adminName: 'Carlos Vega',
          adminId: '15',
          usersCount: 320,
          promotersCount: 18,
          cardsCount: 612,
          active: true,
          createdAt: '2025-01-20T11:30:00'
        }
      ];

      setRegions(mockRegions);
      setLoading(false);
    }, 800);
  }, []);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Abrir modal para editar
  const handleEdit = (region: Region) => {
    setEditingRegion(region);
    setFormName(region.name);
    setFormCountry(region.country);
    setFormAdminId(region.adminId || '');
    setShowModal(true);
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingRegion(null);
    setFormName('');
    setFormCountry('');
    setFormAdminId('');
    setShowModal(true);
  };

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRegion) {
      // Actualizar región existente
      setRegions(regions.map(region =>
        region.id === editingRegion.id
          ? {
              ...region,
              name: formName,
              country: formCountry,
              adminId: formAdminId || null,
              adminName: formAdminId ? 'Administrador Asignado' : null // En un caso real, obtendrías el nombre del admin
            }
          : region
      ));
    } else {
      // Crear nueva región
      const newRegion: Region = {
        id: `${Date.now()}`,
        name: formName,
        country: formCountry,
        adminId: formAdminId || null,
        adminName: formAdminId ? 'Administrador Asignado' : null,
        usersCount: 0,
        promotersCount: 0,
        cardsCount: 0,
        active: true,
        createdAt: new Date().toISOString()
      };
      setRegions([...regions, newRegion]);
    }

    setShowModal(false);
  };

  // Cambiar estado de activación
  const toggleStatus = (id: string) => {
    setRegions(regions.map(region =>
      region.id === id ? { ...region, active: !region.active } : region
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Regiones</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Crear Región
        </button>
      </div>

      {/* Tabla de regiones */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Región
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  País
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Administrador
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuarios
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {regions.map((region) => (
                <tr key={region.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{region.name}</div>
                    <div className="text-xs text-gray-500">Creada: {formatDate(region.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {region.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {region.adminName ? (
                      <div className="text-sm text-gray-900">{region.adminName}</div>
                    ) : (
                      <span className="text-sm text-red-500">No asignado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div>Usuarios: {region.usersCount}</div>
                      <div>Promotores: {region.promotersCount}</div>
                      <div>Tarjetas: {region.cardsCount}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {region.active ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Activa
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Inactiva
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(region)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => toggleStatus(region.id)}
                      className={region.active ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                    >
                      {region.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}

              {regions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No hay regiones configuradas. Crea una nueva región para comenzar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar región */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingRegion ? 'Editar Región' : 'Crear Nueva Región'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="regionName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Región
                </label>
                <input
                  type="text"
                  id="regionName"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="regionCountry" className="block text-sm font-medium text-gray-700 mb-1">
                  País
                </label>
                <input
                  type="text"
                  id="regionCountry"
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="adminId" className="block text-sm font-medium text-gray-700 mb-1">
                  Administrador Regional
                </label>
                <select
                  id="adminId"
                  value={formAdminId}
                  onChange={(e) => setFormAdminId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sin asignar</option>
                  <option value="4">Ana Martínez</option>
                  <option value="8">Roberto Silva</option>
                  <option value="12">Patricia Lagos</option>
                  <option value="15">Carlos Vega</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editingRegion ? 'Guardar Cambios' : 'Crear Región'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionsPage;