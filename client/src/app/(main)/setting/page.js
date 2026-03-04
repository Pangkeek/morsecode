"use client";

import React, { useState, useEffect } from "react";
import { Space_Mono } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";

const spmono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Settings() {
  const { user, saveSettings, settings: userSettings } = useAuth();
  const { theme, updateTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (userSettings) {
      setSettings(userSettings);
      setIsLoading(false);
    }
  }, [userSettings]);

  return (
    <div className="min-h-screen px-4 py-8" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${spmono.className} text-4xl font-bold mb-2`}>
            Settings
          </h1>
          <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Customize your Morse code experience
          </p>
        </div>

        {/* Settings Content */}
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }}>
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-[#2A3247] rounded" />
                  <div className="h-3 w-28 bg-[#2A3247] rounded" />
                </div>
                <div className="h-9 w-28 bg-[#2A3247] rounded-lg" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-[#2A3247] rounded" />
                  <div className="h-3 w-36 bg-[#2A3247] rounded" />
                </div>
                <div className="h-4 w-32 bg-[#2A3247] rounded-full" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Theme */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Choose color theme</p>
                </div>
                <select
                  value={theme}
                  onChange={(e) => updateTheme(e.target.value)}
                  className="rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 transition-colors"
                  style={{ 
                    backgroundColor: 'var(--card)', 
                    color: 'var(--card-foreground)', 
                    border: '1px solid var(--border)',
                    '--tw-ring-color': 'var(--primary)'
                  }}
                >
                  <option value="dark">Dark</option>
                  <option value="theme-light">Light</option>
                  <option value="theme-cyberpunk">Cyberpunk</option>
                </select>
              </div>

              {/* Sound Volume */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sound Volume</h3>
                  <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Adjust audio volume ({settings.soundVolume}%)</p>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.soundVolume}
                  onChange={(e) => setSettings({ ...settings, soundVolume: parseInt(e.target.value) })}
                  className="w-32"
                  style={{ accentColor: 'var(--primary)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end items-center gap-4">
          {saveMessage && (
            <p className="text-sm" style={{ 
              color: saveMessage.includes('Error') ? '#ef4444' : '#22c55e'
            }}>
              {saveMessage}
            </p>
          )}
          <button
            onClick={async () => {
              setIsSaving(true);
              setSaveMessage("");

              try {
                await saveSettings(settings);
                setSaveMessage("Settings saved successfully!");
                setTimeout(() => setSaveMessage(""), 3000);
              } catch (error) {
                setSaveMessage(`Error: ${error.message}`);
                setTimeout(() => setSaveMessage(""), 5000);
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving || isLoading}
            className="px-6 py-2 rounded transition-colors disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'var(--primary-foreground)'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}