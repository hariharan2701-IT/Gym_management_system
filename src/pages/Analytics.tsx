import React, { useState } from 'react';
import { BarChart3, PieChart, LineChart, TrendingUp, TrendingDown, Users, Package, CreditCard } from 'lucide-react';
import { useMembers } from '../contexts/MembersContext';
import { usePackages } from '../contexts/PackagesContext';
import StatsCard from '../components/StatsCard';

const Analytics: React.FC = () => {
  const { members } = useMembers();
  const { packages } = usePackages();
  
  const [timeRange, setTimeRange] = useState('month');
  
  // Count members by status
  const activeMembers = members.filter(m => m.status === 'active').length;
  const expiredMembers = members.filter(m => m.status === 'expired').length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  
  // Count members by package
  const membersByPackage = packages.map(pkg => {
    const count = members.filter(m => m.packageId === pkg.id).length;
    return { name: pkg.name, count };
  });
  
  // Generate mock revenue data
  const revenueData = [
    { month: 'Jan', revenue: 2400 },
    { month: 'Feb', revenue: 3600 },
    { month: 'Mar', revenue: 2900 },
    { month: 'Apr', revenue: 3200 },
    { month: 'May', revenue: 4000 },
    { month: 'Jun', revenue: 3800 },
  ];
  
  // Generate mock attendance data
  const attendanceData = [
    { day: 'Mon', count: 45 },
    { day: 'Tue', count: 52 },
    { day: 'Wed', count: 49 },
    { day: 'Thu', count: 60 },
    { day: 'Fri', count: 55 },
    { day: 'Sat', count: 40 },
    { day: 'Sun', count: 30 },
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex space-x-2">
          <select
            className="select w-auto"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <button className="btn-outline btn-sm">
            Export
          </button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value="$12,450" 
          change="8.2%" 
          isPositive={true}
          icon={<TrendingUp size={20} />}
        />
        <StatsCard 
          title="New Members" 
          value="24" 
          change="12%" 
          isPositive={true}
          icon={<Users size={20} />}
        />
        <StatsCard 
          title="Retention Rate" 
          value="86%" 
          change="3.5%" 
          isPositive={true}
          icon={<Package size={20} />}
        />
        <StatsCard 
          title="Avg. Revenue Per Member" 
          value="$52.30" 
          change="2.1%" 
          isPositive={false}
          icon={<CreditCard size={20} />}
        />
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart3 size={20} className="text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold">Revenue Trend</h2>
            </div>
          </div>
          
          {/* Simplified chart visualization */}
          <div className="h-64 flex items-end space-x-2">
            {revenueData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-primary-500 rounded-t-sm hover:bg-primary-600 transition-all"
                  style={{ 
                    height: `${(item.revenue / 4000) * 100}%`,
                    maxHeight: '90%'
                  }}
                ></div>
                <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Member Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <PieChart size={20} className="text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold">Member Status Distribution</h2>
            </div>
          </div>
          
          <div className="flex">
            {/* Simplified pie chart visualization */}
            <div className="h-64 w-64 mx-auto relative">
              <div className="absolute inset-0 rounded-full border-8 border-primary-500" style={{ clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * (activeMembers / members.length)}% 0, 100% 50%, 100% ${50 + 50 * (activeMembers / members.length)}%)` }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-error-500" style={{ clipPath: `polygon(50% 50%, 100% ${50 + 50 * (activeMembers / members.length)}%, 100% 100%, ${50 - 50 * (expiredMembers / members.length)}% 100%)` }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-warning-500" style={{ clipPath: `polygon(50% 50%, ${50 - 50 * (expiredMembers / members.length)}% 100%, 0 100%, 0 ${50 - 50 * (pendingMembers / members.length)}%)` }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{members.length}</span>
              </div>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-primary-500 rounded-full mr-2"></div>
                <span className="text-sm">Active ({activeMembers})</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-error-500 rounded-full mr-2"></div>
                <span className="text-sm">Expired ({expiredMembers})</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-warning-500 rounded-full mr-2"></div>
                <span className="text-sm">Pending ({pendingMembers})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <LineChart size={20} className="text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold">Weekly Attendance</h2>
            </div>
          </div>
          
          {/* Simplified line chart visualization */}
          <div className="h-64 flex flex-col">
            <div className="flex-1 flex items-end relative">
              <div className="absolute inset-y-0 left-0 border-l border-gray-200 dark:border-gray-700"></div>
              <div className="absolute inset-x-0 bottom-0 border-b border-gray-200 dark:border-gray-700"></div>
              
              {attendanceData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-2 h-2 rounded-full bg-primary-600 z-10 mb-1"></div>
                  <div 
                    className="w-1 bg-primary-500 rounded-t-sm"
                    style={{ height: `${(item.count / 60) * 100}%` }}
                  ></div>
                </div>
              ))}
              
              {/* Connect dots with lines */}
              <svg className="absolute inset-0 h-full w-full" style={{ top: '7px' }}>
                <polyline
                  points={attendanceData.map((item, index) => `${(index * 100) / (attendanceData.length - 1)}% ${100 - (item.count / 60) * 100}%`).join(' ')}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
              </svg>
            </div>
            
            <div className="flex justify-between mt-2">
              {attendanceData.map((item, index) => (
                <div key={index} className="text-xs text-center text-gray-600 dark:text-gray-400 px-1">
                  {item.day}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Popular Packages */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Package size={20} className="text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold">Popular Packages</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            {membersByPackage.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{item.count} members</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${(item.count / members.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Key Insights */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400 flex items-center justify-center mr-3">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Membership Growth</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                New member sign-ups increased by 12% compared to last month, primarily in premium packages.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-warning-100 text-warning-600 dark:bg-warning-900/30 dark:text-warning-400 flex items-center justify-center mr-3">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Retention Challenge</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                15% of members with expiring packages haven't renewed. Consider targeted renewal incentives.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 flex items-center justify-center mr-3">
              <Package size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Package Performance</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Premium Monthly is the most popular package, accounting for 45% of active memberships.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-error-100 text-error-600 dark:bg-error-900/30 dark:text-error-400 flex items-center justify-center mr-3">
              <TrendingDown size={20} />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Weekend Attendance</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Weekend attendance is lower than weekdays. Consider adding special weekend classes to boost engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;