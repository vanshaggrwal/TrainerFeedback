import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usersApi, User, resetDemoData, storage, STORAGE_KEYS, College } from '@/lib/storage';

/* eslint-disable react-refresh/only-export-components */

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only reset and initialize demo data if no colleges exist (first time setup)
    const existingColleges = storage.get<College[]>(STORAGE_KEYS.COLLEGES);
    if (!existingColleges || existingColleges.length === 0) {
      resetDemoData();
    }

    // Check for existing session
    const currentUser = usersApi.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authenticatedUser = await usersApi.authenticate(email, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    } catch {
      return { success: false, error: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    usersApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
