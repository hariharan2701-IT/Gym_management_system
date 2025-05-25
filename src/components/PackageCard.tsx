import React from 'react';
import { Check, MoreVertical } from 'lucide-react';
import { Package } from '../contexts/PackagesContext';

interface PackageCardProps {
  pkg: Package;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({ pkg, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <div className={`card ${pkg.isPopular ? 'border-2 border-primary-400 dark:border-primary-600' : ''} relative`}>
      {pkg.isPopular && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
            Popular
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pkg.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{pkg.description}</p>
        </div>
        <div className="relative">
          <button 
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MoreVertical size={16} />
          </button>
          
          {isMenuOpen && (
            <div 
              className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700"
            >
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => {
                  if (onEdit) onEdit();
                  setIsMenuOpen(false);
                }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-gray-100 dark:text-error-400 dark:hover:bg-gray-700"
                onClick={() => {
                  if (onDelete) onDelete();
                  setIsMenuOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">${pkg.price.toFixed(2)}</span>
        <span className="text-gray-500 dark:text-gray-400 ml-1">
          {pkg.duration >= 365 ? 'per year' : pkg.duration >= 30 ? 'per month' : 'per week'}
        </span>
      </div>
      
      <div className="space-y-3">
        {pkg.features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-primary-500">
              <Check size={20} />
            </div>
            <p className="ml-3 text-sm text-gray-700 dark:text-gray-300">{feature}</p>
          </div>
        ))}
      </div>
      
      <button className="btn-primary btn-md w-full mt-6">
        Select Plan
      </button>
    </div>
  );
};

export default PackageCard;