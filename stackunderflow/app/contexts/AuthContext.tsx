'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  register: (username: string, email: string, password: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage (for persistence until refresh)
    // Using setTimeout to defer the localStorage check until after hydration
    const timer = setTimeout(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = (username: string, password: string) => {
    // For simplicity, we're not validating passwords
    // In a real app, you would validate credentials
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email: `${username}@example.com` // Generate a sample email
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const register = (username: string, email: string, password: string) => {
    // For simplicity, we're not validating passwords
    // In a real app, you would validate credentials
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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

export default AuthContext;