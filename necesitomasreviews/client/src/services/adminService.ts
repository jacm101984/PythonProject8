// src/services/adminService.ts

import axios from 'axios';
import { API_URL } from '../config';

export const adminService = {
  // Obtener reportes regionales
  getRegionalReports: async (regionId: string) => {
    const response = await axios.get(`${API_URL}/admin/reports/regional/${regionId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Obtener lista de regiones
  getRegions: async () => {
    const response = await axios.get(`${API_URL}/admin/regions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Más funciones según las necesidades de la aplicación...
};