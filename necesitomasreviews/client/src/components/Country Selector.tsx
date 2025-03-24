// src/components/CountrySelector.tsx
import React, { useState, useEffect } from 'react';
// Importamos los íconos de banderas desde react-icons
import {
  FiChevronDown,
} from 'react-icons/fi';

// Importamos iconos específicos de banderas
import {
  FaCl, // Chile
  FaMx, // Mexico
  FaUs, // United States
  FaEs, // Spain
  FaCo, // Colombia
  FaAr, // Argentina
  FaPe, // Peru
  FaGlobe, // Para "Otros países"
} from 'react-icons/fa';

interface CountryOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const CountrySelector = () => {
  const [selectedCountry, setSelectedCountry] = useState('cl');
  const [isOpen, setIsOpen] = useState(false);

  const countries: CountryOption[] = [
    { value: 'cl', label: 'Chile', icon: <FaCl /> },
    { value: 'mx', label: 'México', icon: <FaMx /> },
    { value: 'us', label: 'Estados Unidos', icon: <FaUs /> },
    { value: 'es', label: 'España', icon: <FaEs /> },
    { value: 'co', label: 'Colombia', icon: <FaCo /> },
    { value: 'ar', label: 'Argentina', icon: <FaAr /> },
    { value: 'pe', label: 'Perú', icon: <FaPe /> },
    { value: 'other', label: 'Otros países', icon: <FaGlobe /> },
  ];

  const selectedOption = countries.find(country => country.value === selectedCountry);

  const handleSelect = (value: string) => {
    setSelectedCountry(value);
    setIsOpen(false);
  };

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="py-6 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <span className="mr-4 font-medium">Selecciona tu país:</span>

          <div className="relative inline-block">
            <button
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-google-blue flex items-center min-w-[200px]"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              <span className="flex items-center">
                <span className="mr-2 text-xl">
                  {selectedOption?.icon}
                </span>
                <span>{selectedOption?.label}</span>
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="w-5 h-5 text-gray-400" />
              </span>
            </button>

            {isOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
                {countries.map((country) => (
                  <div
                    key={country.value}
                    className={`px-4 py-2 cursor-pointer flex items-center hover:bg-gray-100 ${
                      selectedCountry === country.value ? 'bg-blue-50 text-google-blue' : ''
                    }`}
                    onClick={() => handleSelect(country.value)}
                  >
                    <span className="mr-2 text-xl">{country.icon}</span>
                    <span>{country.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelector;