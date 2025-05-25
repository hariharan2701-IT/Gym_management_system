import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, MoreVertical } from 'lucide-react';
import { formatDistanceToNow, parseISO, isPast } from 'date-fns';
import { Member } from '../contexts/MembersContext';
import { usePackages } from '../contexts/PackagesContext';

interface MemberCardProps {
  member: Member;
  onEdit?: () => void;
  onDelete?: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { getPackage } = usePackages();
  const memberPackage = getPackage(member.packageId);
  
  const expiryDate = parseISO(member.expiryDate);
  const isExpired = isPast(expiryDate);
  
  // Status badge classes
  const getStatusBadgeClass = () => {
    switch (member.status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'expired':
        return 'bg-error-100 text-error-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Payment status badge classes
  const getPaymentStatusBadgeClass = () => {
    switch (member.paymentStatus) {
      case 'paid':
        return 'bg-success-100 text-success-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'overdue':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    navigate(`/members/${member.id}`);
  };

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  return (
    <div 
      className="card-hover group cursor-pointer transition-all duration-300 hover:translate-y-[-4px]"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {member.photo ? (
            <img 
              src={member.photo} 
              alt={member.name} 
              className="h-12 w-12 rounded-full object-cover mr-4"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mr-4">
              {member.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
          </div>
        </div>
        <div className="relative">
          <button 
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            <MoreVertical size={16} />
          </button>
          
          {isMenuOpen && (
            <div 
              className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700"
            >
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit();
                  setIsMenuOpen(false);
                }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-gray-100 dark:text-error-400 dark:hover:bg-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
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
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Membership</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {memberPackage?.name || 'Unknown Package'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass()}`}>
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="flex items-center">
            <Calendar size={16} className="text-gray-400 mr-1.5" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {isExpired 
                ? `Expired ${formatDistanceToNow(expiryDate, { addSuffix: true })}` 
                : `Expires ${formatDistanceToNow(expiryDate, { addSuffix: true })}`
              }
            </span>
          </div>
          <div className="flex items-center">
            <CreditCard size={16} className="text-gray-400 mr-1.5" />
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusBadgeClass()}`}>
              {member.paymentStatus.charAt(0).toUpperCase() + member.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;