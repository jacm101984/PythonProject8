import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { Package } from '../types';
import { Link } from 'react-router-dom';

interface PackageCardProps {
  packageItem: Package;
  isSelected?: boolean;
  onSelect?: (packageId: string) => void;
  isCheckoutPage?: boolean;
}

const PackageCard: React.FC<PackageCardProps> = ({
  packageItem,
  isSelected = false,
  onSelect,
  isCheckoutPage = false,
}) => {
  const handleSelect = () => {
    if (onSelect) {
      onSelect(packageItem.id);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    });
  };

  return (
    <div
      className={`bg-white border rounded-xl shadow-sm transition duration-300 ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-blue-300 hover:shadow'
      } ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={onSelect ? handleSelect : undefined}
    >
      {packageItem.isPopular && (
        <div className="bg-blue-500 text-white text-center py-1 rounded-t-xl font-medium text-sm">
          Más Popular
        </div>
      )}

      <div className="p-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{packageItem.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{packageItem.description}</p>

          <div className="mb-6">
            {packageItem.discountPrice ? (
              <div className="flex flex-col items-center">
                <span className="text-gray-500 line-through text-lg">
                  {formatPrice(packageItem.price)}
                </span>
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(packageItem.discountPrice)}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(packageItem.price)}
              </span>
            )}
          </div>

          <div className="mb-6">
            <div className="text-lg font-semibold text-gray-800 mb-2">
              {packageItem.cardCount} {packageItem.cardCount === 1 ? 'Tarjeta NFC' : 'Tarjetas NFC'}
            </div>
          </div>

          <ul className="space-y-3 text-left mb-6">
            {packageItem.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <FaCheck className="h-4 w-4 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {!isCheckoutPage && (
            <Link
              to={`/checkout?package=${packageItem.id}`}
              className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200"
            >
              Seleccionar Plan
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageCard;