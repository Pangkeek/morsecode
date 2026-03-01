"use client";

import React, { useState, useEffect } from "react";
import { Space_Mono } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

const spmono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Settings() {
  const { user, saveSettings, settings: userSettings } = useAuth();
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
    <div className="min-h-screen bg-[#141720] text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${spmono.className} text-4xl font-bold mb-2`}>
            Settings
          </h1>
          <p className="text-gray-400">
            Customize your Morse code experience
          </p>
        </div>

        {/* Settings Content */}
        <div className="bg-[#1E2332] rounded-lg p-6">
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
                  <p className="text-sm text-gray-400">Choose color theme</p>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="bg-[#2A3247] text-white border border-[#3d4556] rounded-lg px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              {/* Sound Volume */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sound Volume</h3>
                  <p className="text-sm text-gray-400">Adjust audio volume ({settings.soundVolume}%)</p>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.soundVolume}
                  onChange={(e) => setSettings({ ...settings, soundVolume: parseInt(e.target.value) })}
                  className="w-32"
                />
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end items-center gap-4">
          {saveMessage && (
            <p className={`text-sm ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
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
            className="bg-[#EF4444] hover:bg-[#DC2626] disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}