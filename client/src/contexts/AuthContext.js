"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount (check localStorage first, then sessionStorage)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (token, userData, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('token', token);
    storage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const submitGameResult = async (gameData) => {
    try {
      // Placeholder - backend endpoint not ready yet
      console.log('PLACEHOLDER: Game data that would be sent to backend:', gameData);
      
      // TODO: Replace with actual API call when backend is ready
      // const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      // const response = await fetch('https://morsecode-production.up.railway.app/api/results', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(gameData)
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit game result');
      // }
      
      // return await response.json();
      
      // Placeholder response
      return { success: true, message: 'Placeholder - data logged to console' };
    } catch (error) {
      console.error('Error submitting game result:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    submitGameResult
  };

  return (
    <AuthContext.Provider value={value}>
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
