import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
type UserRole = 'admin' | 'staff' | 'member';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  memberId?: string; // For member users, links to their member profile
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<void>;
  logout: () => void;
};

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@fittrack.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'member',
    memberId: '1', // Links to the member with ID 1
  },
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('gymUsers');
    return storedUsers ? JSON.parse(storedUsers) : MOCK_USERS;
  });

  // Check for saved user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('gymUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Save users whenever they change
  useEffect(() => {
    localStorage.setItem('gymUsers', JSON.stringify(users));
  }, [users]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email === email);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('gymUser', JSON.stringify(foundUser));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
        setIsLoading(false);
      }, 800);
    });
  };

  const signup = async (email: string, password: string, name: string, role: UserRole = 'member') => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        if (users.some(u => u.email === email)) {
          reject(new Error('Email already exists'));
          setIsLoading(false);
          return;
        }

        // Create new user
        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role,
        };

        // Add member ID if it's a member
        if (role === 'member') {
          newUser.memberId = newUser.id;
        }

        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
        localStorage.setItem('gymUser', JSON.stringify(newUser));
        resolve();
        setIsLoading(false);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gymUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};