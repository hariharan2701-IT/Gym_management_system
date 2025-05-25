import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type Package = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  isPopular?: boolean;
};

type PackagesContextType = {
  packages: Package[];
  isLoading: boolean;
  addPackage: (pkg: Omit<Package, 'id'>) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  getPackage: (id: string) => Package | undefined;
};

// Mock data
const MOCK_PACKAGES: Package[] = [
  {
    id: '1',
    name: 'Basic Monthly',
    description: 'Access to basic gym facilities',
    price: 29.99,
    duration: 30,
    features: ['Gym access', 'Basic equipment', 'Locker use'],
  },
  {
    id: '2',
    name: 'Premium Monthly',
    description: 'Full access to all gym facilities and classes',
    price: 49.99,
    duration: 30,
    features: ['Gym access', 'All equipment', 'Group classes', 'Locker use', 'Towel service'],
    isPopular: true,
  },
  {
    id: '3',
    name: 'Annual Membership',
    description: 'One year of premium access at a discounted rate',
    price: 499.99,
    duration: 365,
    features: ['Gym access', 'All equipment', 'Group classes', 'Personal trainer (2 sessions)', 'Locker use', 'Towel service'],
  },
];

const PackagesContext = createContext<PackagesContextType | undefined>(undefined);

export const PackagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    const loadPackages = () => {
      const storedPackages = localStorage.getItem('gymPackages');
      if (storedPackages) {
        setPackages(JSON.parse(storedPackages));
      } else {
        setPackages(MOCK_PACKAGES);
        localStorage.setItem('gymPackages', JSON.stringify(MOCK_PACKAGES));
      }
      setIsLoading(false);
    };

    // Simulate API delay
    setTimeout(loadPackages, 800);
  }, []);

  // Save packages to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('gymPackages', JSON.stringify(packages));
    }
  }, [packages, isLoading]);

  // Add a new package
  const addPackage = (pkg: Omit<Package, 'id'>) => {
    const newPackage = {
      ...pkg,
      id: Date.now().toString(),
    };
    setPackages((prev) => [...prev, newPackage as Package]);
  };

  // Update a package
  const updatePackage = (id: string, updates: Partial<Package>) => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updates } : pkg))
    );
  };

  // Delete a package
  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  // Get a package by ID
  const getPackage = (id: string) => {
    return packages.find((pkg) => pkg.id === id);
  };

  return (
    <PackagesContext.Provider
      value={{
        packages,
        isLoading,
        addPackage,
        updatePackage,
        deletePackage,
        getPackage,
      }}
    >
      {children}
    </PackagesContext.Provider>
  );
};

export const usePackages = () => {
  const context = useContext(PackagesContext);
  if (context === undefined) {
    throw new Error('usePackages must be used within a PackagesProvider');
  }
  return context;
};