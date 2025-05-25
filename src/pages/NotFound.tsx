import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <button
          className="btn-primary btn-md mt-8 inline-flex items-center"
          onClick={() => navigate('/')}
        >
          <Home size={18} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;