"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const { user } = useAuth();
    const [theme, setTheme] = useState('dark'); // 'dark', 'theme-cyberpunk', 'theme-light'
    const [settings, setSettings] = useState(null);

    const API_URL = "https://morsecode-production.up.railway.app/api";

    // Fetch settings when user logs in
    useEffect(() => {
        const fetchSettings = async () => {
            if (!user) {
                // Reset to default if logged out
                setTheme('dark');
                applyThemeToHtml('dark');
                return;
            }

            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${API_URL}/settings`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSettings(data);
                    if (data.theme) {
                        setTheme(data.theme);
                        applyThemeToHtml(data.theme);
                    }
                }
            } catch (error) {
                console.error('Error fetching theme settings:', error);
            }
        };

        fetchSettings();
    }, [user]);

    const applyThemeToHtml = (selectedTheme) => {
        // Remove old theme classes
        document.documentElement.classList.remove('dark', 'theme-cyberpunk', 'theme-light');

        // Add new theme class
        if (selectedTheme === 'dark') {
            // For default Next.js Tailwind dark mode
            document.documentElement.classList.add('dark');
        } else if (selectedTheme) {
            document.documentElement.classList.add(selectedTheme);
        }
    };

    const updateTheme = async (newTheme) => {
        // Optimistic UI update
        setTheme(newTheme);
        applyThemeToHtml(newTheme);

        if (!user) return; // Only save to backend if logged in

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ theme: newTheme })
            });

            if (response.ok) {
                const updatedSettings = await response.json();
                setSettings(updatedSettings);
            } else {
                console.error('Failed to update theme to backend');
            }
        } catch (error) {
            console.error('Error updating theme:', error);
        }
    };

    const value = {
        theme,
        settings,
        updateTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}