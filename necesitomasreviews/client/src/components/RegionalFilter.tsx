// src/components/RegionalFilter.tsx
import React, { useState, useEffect } from 'react';
import { adminService } from "src/services/adminService";m '../services/adminService';

interface Region {
  id: string;
  name: string;
  countryCode: string;
}

interface RegionalFilterProps {
  onRegionChange: (regionId: string | null) => void;
  allowAll?: boolean;
  defaultRegion?: string | null;
}

const RegionalFilter: React.FC<RegionalFilterProps> = ({ onRegionChange, allowAll = true, defaultRegion = null }) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(defaultRegion);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const data = await adminService.getRegions();
        setRegions(data);

        // Si no hay región seleccionada y hay regiones, seleccionar la primera
        if (!selectedRegion && data.length > 0 && !allowAll) {
          setSelectedRegion(data[0].id);
          onRegionChange(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching regions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? null : e.target.value;
    setSelectedRegion(value);
    onRegionChange(value);
  };

  return (
    <div>
      <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 mb-1">
        Filtrar por Región
      </label>
      <select
        id="region-filter"
        value={selectedRegion || 'all'}
        onChange={handleRegionChange}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        disabled={isLoading}
      >
        {allowAll && (
          <option value="all">Todas las regiones</option>
        )}
        {regions.map((region) => (
          <option key={region.id} value={region.id}>
            {region.name} ({region.countryCode})
          </option>
        ))}
      </select>
    </div>
  );
};

export default RegionalFilter;