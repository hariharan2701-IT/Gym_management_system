import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon,
}) => {
  return (
    <div className="card hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center">
        <div className="rounded-full p-3 mr-4 bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
        </div>
      </div>
      
      {change && (
        <div className="mt-3 flex items-center">
          <span
            className={`text-xs font-medium ${
              isPositive ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'
            }`}
          >
            {isPositive ? '↑' : '↓'} {change}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;