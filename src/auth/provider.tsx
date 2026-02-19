'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Define the shape of the user object and the session
interface User {
  displayName?: string | null;
  email?: string | null;
}

interface Session {
  token: string;
  user: User;
}

// Define the Auth Context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (session: Session) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((session: Session) => {
    setUser(session.user);
    setToken(session.token);
    localStorage.setItem('authToken', session.token);
    localStorage.setItem('authUser', JSON.stringify(session.user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    router.push('/');
  }, [router]);

  const value = { user, token, login, logout, isLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
