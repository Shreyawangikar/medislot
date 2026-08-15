'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, SignupData } from '../types/auth';
import { AuthClientService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  signup: (signupData: SignupData) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore persistent session on load
    const storedToken = localStorage.getItem('medislot_token');
    const storedUser = localStorage.getItem('medislot_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('medislot_token');
        localStorage.removeItem('medislot_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    const response = await AuthClientService.login(credentials);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('medislot_token', response.token);
    localStorage.setItem('medislot_user', JSON.stringify(response.user));
    return response.user;
  };

  const signup = async (signupData: SignupData): Promise<User> => {
    const response = await AuthClientService.registerPatient(signupData);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('medislot_token', response.token);
    localStorage.setItem('medislot_user', JSON.stringify(response.user));
    return response.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medislot_token');
    localStorage.removeItem('medislot_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
