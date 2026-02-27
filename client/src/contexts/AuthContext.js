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
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      // Using production URL
      const API_URL = "https://morsecode-production.up.railway.app/api";

      const response = await fetch(`${API_URL}/play-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gameData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit game result');
      }

      const result = await response.json();

      // Refresh user info to get updated stats (totalPlay, avgWpm, etc.)
      await fetchUserInfo();

      return result;
    } catch (error) {
      console.error('Error submitting game result:', error);
      throw error;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;

      const API_URL = "https://morsecode-production.up.railway.app/api";
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Also update storage
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    submitGameResult,
    refreshUser: fetchUserInfo
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
