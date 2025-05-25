import React, { createContext, useContext, useState, useEffect } from 'react';
import { addDays, isAfter, isBefore, parseISO } from 'date-fns';

// Types
export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  packageId: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'overdue';
  notes?: string;
  photo?: string;
};

type MembersContextType = {
  members: Member[];
  isLoading: boolean;
  addMember: (member: Omit<Member, 'id'>) => void;
  updateMember: (id: string, member: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  getMember: (id: string) => Member | undefined;
  getExpiringMembers: () => Member[];
};

// Mock data
const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    joinDate: '2023-01-15',
    packageId: '1',
    expiryDate: addDays(new Date(), 5).toISOString(),
    status: 'active',
    paymentStatus: 'paid',
    photo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    joinDate: '2023-02-20',
    packageId: '2',
    expiryDate: addDays(new Date(), -10).toISOString(),
    status: 'expired',
    paymentStatus: 'overdue',
    photo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '(555) 321-7890',
    joinDate: '2023-03-10',
    packageId: '3',
    expiryDate: addDays(new Date(), 45).toISOString(),
    status: 'active',
    paymentStatus: 'paid',
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '(555) 456-7890',
    joinDate: '2023-04-05',
    packageId: '1',
    expiryDate: addDays(new Date(), 20).toISOString(),
    status: 'active',
    paymentStatus: 'paid',
    photo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    email: 'robert@example.com',
    phone: '(555) 789-0123',
    joinDate: '2023-05-12',
    packageId: '2',
    expiryDate: addDays(new Date(), 2).toISOString(),
    status: 'active',
    paymentStatus: 'paid',
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export const MembersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with mock data
  useEffect(() => {
    const loadMembers = () => {
      const storedMembers = localStorage.getItem('gymMembers');
      if (storedMembers) {
        setMembers(JSON.parse(storedMembers));
      } else {
        setMembers(MOCK_MEMBERS);
        localStorage.setItem('gymMembers', JSON.stringify(MOCK_MEMBERS));
      }
      setIsLoading(false);
    };

    // Simulate API delay
    setTimeout(loadMembers, 800);
  }, []);

  // Save members to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('gymMembers', JSON.stringify(members));
    }
  }, [members, isLoading]);

  // Add a new member
  const addMember = (member: Omit<Member, 'id'>) => {
    const newMember = {
      ...member,
      id: Date.now().toString(),
    };
    setMembers((prev) => [...prev, newMember as Member]);
  };

  // Update a member
  const updateMember = (id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((member) => (member.id === id ? { ...member, ...updates } : member))
    );
  };

  // Delete a member
  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  // Get a member by ID
  const getMember = (id: string) => {
    return members.find((member) => member.id === id);
  };

  // Get members expiring soon (within next 7 days)
  const getExpiringMembers = () => {
    const sevenDaysFromNow = addDays(new Date(), 7);
    return members.filter((member) => {
      const expiryDate = parseISO(member.expiryDate);
      return member.status === 'active' && 
             isAfter(expiryDate, new Date()) && 
             isBefore(expiryDate, sevenDaysFromNow);
    });
  };

  return (
    <MembersContext.Provider
      value={{
        members,
        isLoading,
        addMember,
        updateMember,
        deleteMember,
        getMember,
        getExpiringMembers,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => {
  const context = useContext(MembersContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MembersProvider');
  }
  return context;
};