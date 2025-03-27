// src/components/RegionalFilter.tsx
import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

interface Region {
  id: string;
  name: string;
  code?: string;
}

interface RegionalFilterProps {
  onChange: (regionId: string) => void;
  className?: string;
  label?: string;
  placeholder?: string;
  includeAllOption?: boolean;
}

const RegionalFilter: React.FC<RegionalFilterProps> = ({
  onChange,
  className = '',
  label = 'Región',
  placeholder = 'Selecciona una región',
  includeAllOption = true
}) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  useEffect(() => {
    const fetchRegions = async () => {
      setLoading(true);
      try {
        const data = await adminService.getRegions();
        setRegions(data);
      } catch (error) {
        console.error('Error al cargar regiones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    setSelectedRegion(regionId);
    onChange(regionId);
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id="region-filter"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={selectedRegion}
          onChange={handleChange}
          disabled={loading}
        >
          {includeAllOption && (
            <option value="">Todas las regiones</option>
          )}
          {loading ? (
            <option value="" disabled>Cargando regiones...</option>
          ) : (
            regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name} {region.code ? `(${region.code})` : ''}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
};

export default RegionalFilter;