import { createContext, useContext } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock authentication for demo purposes
export const mockAuth: AuthContextType = {
  user: null,
  isLoading: false,
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@serena.com' && password === 'admin123') {
      mockAuth.user = {
        id: '1',
        name: 'Admin',
        email: 'admin@serena.com',
        role: 'admin'
      };
    } else if (email === 'user@serena.com' && password === 'user123') {
      mockAuth.user = {
        id: '2',
        name: 'User',
        email: 'user@serena.com',
        role: 'user'
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => {
    mockAuth.user = null;
  },
  get isAuthenticated() {
    return !!this.user;
  },
  get isAdmin() {
    return this.user?.role === 'admin';
  }
};