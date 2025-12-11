import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types/library';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User & { password: string }> = {
  'admin@library.com': {
    id: '1',
    email: 'admin@library.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123',
    createdAt: new Date(),
  },
  'librarian@library.com': {
    id: '2',
    email: 'librarian@library.com',
    name: 'Jane Librarian',
    role: 'librarian',
    password: 'librarian123',
    createdAt: new Date(),
  },
  'student@library.com': {
    id: '3',
    email: 'student@library.com',
    name: 'John Student',
    role: 'student',
    password: 'student123',
    createdAt: new Date(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('library_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers[email.toLowerCase()];
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('library_user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid email or password');
    }
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockUsers[email.toLowerCase()]) {
      setIsLoading(false);
      throw new Error('User already exists');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email: email.toLowerCase(),
      name,
      role,
      createdAt: new Date(),
    };
    
    mockUsers[email.toLowerCase()] = { ...newUser, password };
    setUser(newUser);
    localStorage.setItem('library_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('library_user');
  };

  const resetPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!mockUsers[email.toLowerCase()]) {
      throw new Error('User not found');
    }
    // In real app, send reset email
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
