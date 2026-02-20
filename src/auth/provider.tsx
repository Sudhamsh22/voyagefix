'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = "http://localhost:5000"; // Use Express backend

interface User {
  id?: number;
  displayName?: string; 
  email?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
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
      const storedToken = localStorage.getItem('voyageflix_token');
      const storedUser = localStorage.getItem('voyageflix_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to access localStorage. Auth state will not be persisted.", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuthSuccess = useCallback((data: any) => {
    const { token, user: backendUser } = data;
    const userToStore = {
      id: backendUser.id,
      displayName: backendUser.name,
      email: backendUser.email
    };

    setUser(userToStore);
    setToken(token);

    try {
        localStorage.setItem('voyageflix_token', token);
        localStorage.setItem('voyageflix_user', JSON.stringify(userToStore));
    } catch (error) {
        console.error("Failed to write to localStorage.", error);
    }

    router.push('/my-trips');
    router.refresh();
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    handleAuthSuccess(data);
  }, [handleAuthSuccess]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
    }
    
    handleAuthSuccess(data);
  }, [handleAuthSuccess]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
        localStorage.removeItem('voyageflix_token');
        localStorage.removeItem('voyageflix_user');
    } catch (error) {
        console.error("Failed to remove from localStorage.", error);
    }
    router.push('/login');
    router.refresh();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
