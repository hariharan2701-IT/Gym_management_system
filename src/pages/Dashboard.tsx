import React from 'react';
import { Users, Package, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import { useMembers } from '../contexts/MembersContext';
import { usePackages } from '../contexts/PackagesContext';
import StatsCard from '../components/StatsCard';
import MemberCard from '../components/MemberCard';

const Dashboard: React.FC = () => {
  const { members, getExpiringMembers } = useMembers();
  const { packages } = usePackages();
  
  const expiringMembers = getExpiringMembers();
  const activeMembers = members.filter(m => m.status === 'active');
  const expiredMembers = members.filter(m => m.status === 'expired');
  
  // Calculate total revenue (simplified)
  const totalRevenue = activeMembers.reduce((total, member) => {
    const memberPackage = packages.find(p => p.id === member.packageId);
    return total + (memberPackage?.price || 0);
  }, 0);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="btn-primary btn-sm">
          Generate Report
        </button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Members" 
          value={members.length} 
          change="12%" 
          isPositive={true}
          icon={<Users size={20} />}
        />
        <StatsCard 
          title="Active Memberships" 
          value={activeMembers.length} 
          change="8%" 
          isPositive={true}
          icon={<Package size={20} />}
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={`$${totalRevenue.toFixed(2)}`} 
          change="5%" 
          isPositive={true}
          icon={<TrendingUp size={20} />}
        />
        <StatsCard 
          title="Pending Payments" 
          value={members.filter(m => m.paymentStatus === 'pending').length} 
          change="3%" 
          isPositive={false}
          icon={<CreditCard size={20} />}
        />
      </div>
      
      {/* Alerts Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Alerts & Notifications</h2>
          <span className="badge-warning">
            {expiringMembers.length} Alerts
          </span>
        </div>
        
        {expiringMembers.length > 0 ? (
          <div className="space-y-3">
            {expiringMembers.map(member => (
              <div key={member.id} className="flex items-start p-3 bg-warning-50 dark:bg-warning-900/20 rounded-md">
                <AlertCircle size={18} className="text-warning-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {member.name}'s membership expiring soon
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Contact member to renew their membership
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>No alerts at this time</p>
          </div>
        )}
      </div>
      
      {/* Recent Members Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Members</h2>
          <button className="btn-outline btn-sm">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.slice(0, 3).map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;