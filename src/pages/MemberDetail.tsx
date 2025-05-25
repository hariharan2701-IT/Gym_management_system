import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Calendar, CreditCard, Clock, Edit, Trash2, 
  CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import { useMembers } from '../contexts/MembersContext';
import { usePackages } from '../contexts/PackagesContext';
import { format, parseISO, differenceInDays } from 'date-fns';

const MemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMember, updateMember, deleteMember } = useMembers();
  const { getPackage } = usePackages();
  
  const member = getMember(id || '');
  const memberPackage = member ? getPackage(member.packageId) : null;
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Member Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The member you're looking for doesn't exist or has been removed.</p>
        <button 
          className="btn-primary btn-sm"
          onClick={() => navigate('/members')}
        >
          Back to Members
        </button>
      </div>
    );
  }
  
  const expiryDate = parseISO(member.expiryDate);
  const joinDate = parseISO(member.joinDate);
  const daysRemaining = differenceInDays(expiryDate, new Date());
  
  // Status badge classes
  const getStatusBadgeClass = () => {
    switch (member.status) {
      case 'active':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
      case 'expired':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400';
      case 'pending':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  // Payment status badge classes
  const getPaymentStatusBadgeClass = () => {
    switch (member.paymentStatus) {
      case 'paid':
        return 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400';
      case 'pending':
        return 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400';
      case 'overdue':
        return 'bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getStatusIcon = () => {
    switch (member.status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      case 'expired':
        return <XCircle className="h-5 w-5 text-error-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-warning-500" />;
      default:
        return null;
    }
  };
  
  const handleDelete = () => {
    deleteMember(member.id);
    navigate('/members');
  };
  
  const handleRenew = () => {
    if (!memberPackage) return;
    
    // Add package duration to current expiry
    const newExpiryDate = new Date(expiryDate);
    newExpiryDate.setDate(newExpiryDate.getDate() + memberPackage.duration);
    
    updateMember(member.id, {
      expiryDate: newExpiryDate.toISOString(),
      status: 'active',
      paymentStatus: 'paid',
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center space-x-2">
        <button 
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => navigate('/members')}
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Member Details</h1>
      </div>
      
      {/* Member Details Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center">
            {member.photo ? (
              <img 
                src={member.photo} 
                alt={member.name} 
                className="h-16 w-16 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-4">
                {member.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <div className="flex items-center mt-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass()}`}>
                  <span className="mr-1">{getStatusIcon()}</span>
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              className="btn-outline btn-sm flex items-center"
              onClick={() => navigate(`/members/${member.id}/edit`)}
            >
              <Edit size={16} className="mr-1" />
              Edit
            </button>
            <button
              className="btn-sm bg-error-100 text-error-700 hover:bg-error-200 dark:bg-error-900/20 dark:text-error-400 dark:hover:bg-error-900/30 flex items-center"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={16} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{member.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                <p className="font-medium">{member.phone}</p>
              </div>
            </div>
          </div>
          
          {/* Membership Information */}
          <div>
            <h3 className="text-lg font-medium mb-3">Membership Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Package</p>
                <p className="font-medium">{memberPackage?.name || 'Unknown Package'}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Join Date</p>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-400 mr-1.5" />
                    <p className="font-medium">{format(joinDate, 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</p>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-400 mr-1.5" />
                    <p className="font-medium">{format(expiryDate, 'MMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusBadgeClass()}`}>
                    <CreditCard size={14} className="mr-1" />
                    {member.paymentStatus.charAt(0).toUpperCase() + member.paymentStatus.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Days Remaining</p>
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-400 mr-1.5" />
                    <p className={`font-medium ${daysRemaining < 0 ? 'text-error-600 dark:text-error-400' : daysRemaining < 7 ? 'text-warning-600 dark:text-warning-400' : ''}`}>
                      {daysRemaining < 0 ? 'Expired' : `${daysRemaining} days`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        {member.notes && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-medium mb-2">Notes</h3>
            <p className="text-gray-700 dark:text-gray-300">{member.notes}</p>
          </div>
        )}
        
        {/* Actions */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-lg font-medium mb-3">Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              className="btn-primary btn-sm"
              onClick={handleRenew}
            >
              Renew Membership
            </button>
            <button className="btn-outline btn-sm">
              Record Payment
            </button>
            <button className="btn-outline btn-sm">
              Send Email
            </button>
            <button className="btn-outline btn-sm">
              Print ID Card
            </button>
          </div>
        </div>
      </div>
      
      {/* Payment History */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Payment History</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Package</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{format(joinDate, 'MMM d, yyyy')}</td>
                <td>${memberPackage?.price.toFixed(2) || '0.00'}</td>
                <td>{memberPackage?.name || 'Unknown Package'}</td>
                <td>
                  <span className="badge-success">Paid</span>
                </td>
              </tr>
              {/* Demo payment history entries */}
              {member.id === '1' && (
                <>
                  <tr>
                    <td>{format(new Date(2023, 0, 15), 'MMM d, yyyy')}</td>
                    <td>$29.99</td>
                    <td>Basic Monthly</td>
                    <td>
                      <span className="badge-success">Paid</span>
                    </td>
                  </tr>
                  <tr>
                    <td>{format(new Date(2022, 11, 15), 'MMM d, yyyy')}</td>
                    <td>$29.99</td>
                    <td>Basic Monthly</td>
                    <td>
                      <span className="badge-success">Paid</span>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Attendance Log */}
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Attendance Log</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {/* Demo attendance entries */}
              {member.id === '1' ? (
                <>
                  <tr>
                    <td>{format(new Date(2023, 3, 10), 'MMM d, yyyy')}</td>
                    <td>10:15 AM</td>
                    <td>11:45 AM</td>
                    <td>1h 30m</td>
                  </tr>
                  <tr>
                    <td>{format(new Date(2023, 3, 8), 'MMM d, yyyy')}</td>
                    <td>6:30 PM</td>
                    <td>8:15 PM</td>
                    <td>1h 45m</td>
                  </tr>
                  <tr>
                    <td>{format(new Date(2023, 3, 5), 'MMM d, yyyy')}</td>
                    <td>9:00 AM</td>
                    <td>10:30 AM</td>
                    <td>1h 30m</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete {member.name}? This action cannot be undone.
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
                  onClick={handleDelete}
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

export default MemberDetail;