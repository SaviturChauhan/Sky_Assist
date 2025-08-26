import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  type: 'passenger' | 'crew';
  name: string;
  seat?: string;
  role?: string;
  code?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for authentication
const mockPassengers = [
  { id: 'p1', seat: '1A', lastName: 'Doe', firstName: 'John' },
  { id: 'p2', seat: '2A', lastName: 'Johnson', firstName: 'Sarah' },
  { id: 'p3', seat: '3B', lastName: 'Smith', firstName: 'Michael' },
  { id: 'p4', seat: '4C', lastName: 'Williams', firstName: 'Emma' },
];

const mockCrew = [
  { id: 'c1', code: 'ET001', password: 'password', name: 'Emily Turner', role: 'Lead Flight Attendant' },
  { id: 'c2', code: 'JR002', password: 'password', name: 'James Rodriguez', role: 'Cabin Crew' },
  { id: 'c3', code: 'MK003', password: 'password', name: 'Maria Kim', role: 'Senior Flight Attendant' },
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { mockPassengers, mockCrew };