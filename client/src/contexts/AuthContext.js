"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in on mount (check localStorage first, then sessionStorage)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
      getSettings(); // Load user settings
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

  const refreshUser = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch('https://morsecode-production.up.railway.app/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // Update storage with fresh data
        const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(userData));
        
        console.log('✅ User data refreshed:', userData);
      }
    } catch (error) {
      console.error('❌ Failed to refresh user data:', error);
    }
  };

  const submitGameResult = async (gameData) => {
    try {
      console.log('🚀 Submitting game data to:', 'https://morsecode-production.up.railway.app/api/play-sessions');
      console.log('📦 Game data:', gameData);
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      const response = await fetch('https://morsecode-production.up.railway.app/api/play-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(gameData)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        console.error('❌ Response error:', errorData);
        throw new Error(errorData.error || 'Failed to submit game result');
      }

      const result = await response.json();
      console.log('✅ Success response:', result);
      return result;
    } catch (error) {
      console.error('❌ Error submitting game result:', error);
      throw error;
    }
  };

  const getSettings = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const response = await fetch('https://morsecode-production.up.railway.app/api/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const settingsData = await response.json();
        setSettings(settingsData);
        return settingsData;
      }
    } catch (error) {
      console.error('❌ Error fetching settings:', error);
    }
    return settings;
  };

  const saveSettings = async (settingsData) => {
    try {
      console.log('🚀 Saving settings to:', 'https://morsecode-production.up.railway.app/api/settings');
      console.log('⚙️ Settings data:', settingsData);
      
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      const response = await fetch('https://morsecode-production.up.railway.app/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settingsData)
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        console.error('❌ Response error:', errorData);
        throw new Error(errorData.error || 'Failed to save settings');
      }

      const result = await response.json();
      console.log('✅ Settings saved successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error saving settings:', error);
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
      } else if (response.status === 401 || response.status === 403) {
        // Token is invalid for the current server
        logout();
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const value = {
    user,
    settings,
    login,
    logout,
    loading,
    submitGameResult,
    saveSettings,
    getSettings,
    refreshUser
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
