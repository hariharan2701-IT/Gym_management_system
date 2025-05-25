import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePackages, Package } from '../contexts/PackagesContext';
import PackageCard from '../components/PackageCard';

const Packages: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage } = usePackages();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Package | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    features: '',
    isPopular: false,
  });
  
  // Handle opening add modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '30',
      features: '',
      isPopular: false,
    });
    setIsAddModalOpen(true);
  };
  
  // Handle opening edit modal
  const handleOpenEditModal = (pkg: Package) => {
    setCurrentPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration.toString(),
      features: pkg.features.join('\n'),
      isPopular: pkg.isPopular || false,
    });
    setIsEditModalOpen(true);
  };
  
  // Handle opening delete modal
  const handleOpenDeleteModal = (pkg: Package) => {
    setCurrentPackage(pkg);
    setIsDeleteModalOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  // Handle add package form submission
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    const features = formData.features
      .split('\n')
      .map(feature => feature.trim())
      .filter(feature => feature !== '');
    
    const newPackage: Omit<Package, 'id'> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      features,
      isPopular: formData.isPopular,
    };
    
    addPackage(newPackage);
    setIsAddModalOpen(false);
  };
  
  // Handle edit package form submission
  const handleEditPackage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPackage) return;
    
    const features = formData.features
      .split('\n')
      .map(feature => feature.trim())
      .filter(feature => feature !== '');
    
    const updatedPackage: Partial<Package> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      features,
      isPopular: formData.isPopular,
    };
    
    updatePackage(currentPackage.id, updatedPackage);
    setIsEditModalOpen(false);
  };
  
  // Handle delete package
  const handleDeletePackage = () => {
    if (!currentPackage) return;
    
    deletePackage(currentPackage.id);
    setIsDeleteModalOpen(false);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Membership Packages</h1>
        <button 
          className="btn-primary btn-sm flex items-center"
          onClick={handleOpenAddModal}
        >
          <Plus size={16} className="mr-1" />
          Add Package
        </button>
      </div>
      
      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <PackageCard 
            key={pkg.id} 
            pkg={pkg} 
            onEdit={() => handleOpenEditModal(pkg)}
            onDelete={() => handleOpenDeleteModal(pkg)}
          />
        ))}
      </div>
      
      {/* Add Package Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Package</h2>
              
              <form onSubmit={handleAddPackage} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Package Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    className="input"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="input"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      className="input"
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Features (one per line)
                  </label>
                  <textarea
                    id="features"
                    name="features"
                    rows={5}
                    className="input"
                    value={formData.features}
                    onChange={handleInputChange}
                    placeholder="Gym access&#10;Basic equipment&#10;Locker use"
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPopular"
                    name="isPopular"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isPopular" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Mark as popular (recommended)
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary btn-sm"
                  >
                    Add Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Package Modal */}
      {isEditModalOpen && currentPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Package</h2>
              
              <form onSubmit={handleEditPackage} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Package Name
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    className="input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="edit-description"
                    name="description"
                    className="input"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="edit-price"
                      name="price"
                      className="input"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      id="edit-duration"
                      name="duration"
                      className="input"
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Features (one per line)
                  </label>
                  <textarea
                    id="edit-features"
                    name="features"
                    rows={5}
                    className="input"
                    value={formData.features}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-isPopular"
                    name="isPopular"
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="edit-isPopular" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Mark as popular (recommended)
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary btn-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete the "{currentPackage.name}" package? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  className="btn-outline btn-sm"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-sm bg-error-600 text-white hover:bg-error-700"
                  onClick={handleDeletePackage}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;