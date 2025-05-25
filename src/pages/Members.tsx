import React, { useState } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { useMembers, Member } from '../contexts/MembersContext';
import { usePackages } from '../contexts/PackagesContext';
import MemberCard from '../components/MemberCard';
import { addDays } from 'date-fns';

const Members: React.FC = () => {
  const { members, addMember, updateMember, deleteMember } = useMembers();
  const { packages } = usePackages();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  
  // Form state for adding/editing member
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    packageId: '',
    notes: '',
  });
  
  // Filter and search members
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Handle opening add modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      packageId: packages.length > 0 ? packages[0].id : '',
      notes: '',
    });
    setIsAddModalOpen(true);
  };
  
  // Handle opening edit modal
  const handleOpenEditModal = (member: Member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      packageId: member.packageId,
      notes: member.notes || '',
    });
    setIsEditModalOpen(true);
  };
  
  // Handle opening delete modal
  const handleOpenDeleteModal = (member: Member) => {
    setCurrentMember(member);
    setIsDeleteModalOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle add member form submission
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get selected package duration for expiry calculation
    const selectedPackage = packages.find(p => p.id === formData.packageId);
    const packageDuration = selectedPackage?.duration || 30; // Default to 30 days
    
    const newMember: Omit<Member, 'id'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      packageId: formData.packageId,
      joinDate: new Date().toISOString().split('T')[0],
      expiryDate: addDays(new Date(), packageDuration).toISOString(),
      status: 'active',
      paymentStatus: 'paid',
      notes: formData.notes,
    };
    
    addMember(newMember);
    setIsAddModalOpen(false);
  };
  
  // Handle edit member form submission
  const handleEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMember) return;
    
    const updatedMember: Partial<Member> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      packageId: formData.packageId,
      notes: formData.notes,
    };
    
    updateMember(currentMember.id, updatedMember);
    setIsEditModalOpen(false);
  };
  
  // Handle delete member
  const handleDeleteMember = () => {
    if (!currentMember) return;
    
    deleteMember(currentMember.id);
    setIsDeleteModalOpen(false);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Members</h1>
        <button 
          className="btn-primary btn-sm flex items-center"
          onClick={handleOpenAddModal}
        >
          <Plus size={16} className="mr-1" />
          Add Member
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search members..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchTerm('')}
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="select pl-10 w-40"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Members Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(member => (
            <MemberCard 
              key={member.id} 
              member={member} 
              onEdit={() => handleOpenEditModal(member)}
              onDelete={() => handleOpenDeleteModal(member)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No members found</p>
          {searchTerm || statusFilter !== 'all' ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try adjusting your search or filters
            </p>
          ) : (
            <button 
              className="btn-primary btn-sm mt-4"
              onClick={handleOpenAddModal}
            >
              Add your first member
            </button>
          )}
        </div>
      )}
      
      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Member</h2>
              
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="packageId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Membership Package
                  </label>
                  <select
                    id="packageId"
                    name="packageId"
                    className="select"
                    value={formData.packageId}
                    onChange={handleInputChange}
                    required
                  >
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="input"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
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
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Member Modal */}
      {isEditModalOpen && currentMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Edit Member</h2>
              
              <form onSubmit={handleEditMember} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
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
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    className="input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="edit-phone"
                    name="phone"
                    className="input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-packageId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Membership Package
                  </label>
                  <select
                    id="edit-packageId"
                    name="packageId"
                    className="select"
                    value={formData.packageId}
                    onChange={handleInputChange}
                    required
                  >
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    id="edit-notes"
                    name="notes"
                    rows={3}
                    className="input"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
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
      {isDeleteModalOpen && currentMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete {currentMember.name}? This action cannot be undone.
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
                  onClick={handleDeleteMember}
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

export default Members;