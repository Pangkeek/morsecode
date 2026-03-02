"use client";

import { useState, useEffect } from "react";
import { Space_Mono } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const spmono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Leaderboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [selectedMode, setSelectedMode] = useState('character');
  const [mode, setMode] = useState('decode');
  const [type, setType] = useState('a-z');
  const [length, setLength] = useState('10');

  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const myEntry = user ? leaders.find((p) => p.id === user.id) : null;
  const myRank = myEntry ? leaders.indexOf(myEntry) + 1 : null;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const API_URL = "https://morsecode-production.up.railway.app/api";
        const res = await fetch(`${API_URL}/leaderboard/by-mode?mode=${mode}&symbol=${type}&amtWord=${length}`);

        if (res.ok) {
          const data = await res.json();
          setLeaders(data);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [mode, type, length]);

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden px-4 box-border flex flex-col items-center">
      <div className="w-full max-w-[1200px] min-w-0">
        <div className="w-full max-w-full min-w-0 flex justify-center items-center py-8 sm:py-14">
          {/* Mobile/tablet: 3 dropdowns */}
          <div
            className={`${spmono.className} md:hidden font-bold w-full max-w-[705px] min-w-0 px-4 py-4 rounded-xl flex flex-wrap justify-center sm:justify-between items-center gap-3 sm:gap-4 box-border transition-colors duration-300`}
            style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }}
          >
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className={`${spmono.className} font-bold rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 transition-colors min-w-[120px]`}
              style={{ 
                backgroundColor: 'var(--background)', 
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                '--tw-ring-color': 'var(--primary)'
              }}
              aria-label="Mode"
            >
              <option value="decode">decode</option>
              <option value="encode">encode</option>
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${spmono.className} font-bold rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 transition-colors min-w-[120px]`}
              style={{ 
                backgroundColor: 'var(--background)', 
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                '--tw-ring-color': 'var(--primary)'
              }}
              aria-label="Type"
            >
              <option value="a-z">a-z</option>
              <option value="word">word</option>
            </select>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className={`${spmono.className} font-bold rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 transition-colors min-w-[100px]`}
              style={{ 
                backgroundColor: 'var(--background)', 
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                '--tw-ring-color': 'var(--primary)'
              }}
              aria-label="Length"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          {/* Desktop: original button bar */}
          <div
            className={`${spmono.className} hidden md:flex font-bold w-full max-w-[705px] min-w-0 min-h-[65px] px-2 sm:px-4 rounded-xl flex-wrap items-center justify-between gap-1 sm:gap-2 box-border transition-colors duration-300`}
            style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setMode("decode")}
              className={`pl-4 pr-2 md:pl-10 md:pr-4 py-4 transition-colors duration-300`}
              style={{ color: mode === "decode" ? 'var(--primary)' : 'var(--foreground)', opacity: mode === "decode" ? 1 : 0.7 }}


            >
              decode
            </button>
            <button
              onClick={() => setMode("encode")}
              className={`px-4 py-4 transition-colors duration-300`}
              style={{ color: mode === "encode" ? 'var(--primary)' : 'var(--foreground)', opacity: mode === "encode" ? 1 : 0.7 }}


            >
              encode
            </button>
            <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>|</p>
            <button
              onClick={() => setType("a-z")}
              className={`px-4 py-4 transition-colors duration-300`}
              style={{ color: type === "a-z" ? 'var(--primary)' : 'var(--foreground)', opacity: type === "a-z" ? 1 : 0.7 }}


            >
              a-z
            </button>
            <button
              onClick={() => setType("word")}
              className={`px-4 py-4 transition-colors duration-300`}
              style={{ color: type === "word" ? 'var(--primary)' : 'var(--foreground)', opacity: type === "word" ? 1 : 0.7 }}


            >
              word
            </button>
            <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>|</p>
            <div className="flex">
              {["10", "15", "50", "100"].map((len) => (
                <button
                  key={len}
                  onClick={() => setLength(len)}
                  className={`px-4 py-4 transition-colors duration-300 ${len === "100" ? "pr-10" : ""}`}
                  style={{ color: length === len ? 'var(--primary)' : 'var(--foreground)', opacity: length === len ? 1 : 0.7 }}


                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full max-w-full min-w-0 flex flex-col lg:flex-row gap-6 lg:gap-10 lg:justify-center">
          <div className="w-full min-w-0 lg:w-[300px] lg:shrink-0 h-auto lg:h-[520px] rounded-xl transition-colors duration-300" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }}>
            <div className="p-6 sm:p-10 flex flex-col items-center">
              <div
                className={`${spmono.className} w-24 h-24 rounded-full flex items-center justify-center font-bold text-[28px] outline transition-colors duration-300`}
                style={{ 
                  backgroundColor: 'var(--background)', 
                  color: 'var(--foreground)',
                  outlineColor: 'var(--primary)'
                }}
              >
                <p className="mb-1">{user?.username?.slice(0, 2)?.toLowerCase() || '??'}</p>
              </div>
              <p className={`${spmono.className} font-bold text-[20px] mt-4`} style={{ color: 'var(--card-foreground)' }}>
                {user?.username || 'Guest'}
              </p>
              <p
                className={`${spmono.className} font-bold text-[24px]`}
                style={{ color: 'var(--foreground)', opacity: 0.7 }}
              >
                Rank : {myRank ?? 'N/A'}
              </p>
              <p
                className={`${spmono.className} font-bold text-[32px] place-self-start mt-4`}
                style={{ color: 'var(--card-foreground)' }}
              >
                WPS
              </p>
              <p
                className={`${spmono.className} font-bold text-[50px]`}
                style={{ color: 'var(--foreground)', opacity: 0.7 }}
              >
                {myEntry ? Math.round(myEntry.highWpm) : 'N/A'}
              </p>
              <p
                className={`${spmono.className} font-bold text-[32px] place-self-start`}
                style={{ color: 'var(--card-foreground)' }}
              >
                Acc
              </p>
              <p
                className={`${spmono.className} font-bold text-[50px]`}
                style={{ color: 'var(--foreground)', opacity: 0.7 }}
              >
                {myEntry ? `${Math.round(myEntry.highAccuracy)}%` : 'N/A'}
              </p>
            </div>
          </div>
          <div
            className={`${spmono.className} w-full min-w-0 lg:max-w-[810px] lg:ml-10 text-[16px] font-bold overflow-x-auto rounded-xl transition-colors duration-300`}
            style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }}
          >
            {/* header - scroll on narrow viewports */}
            <div className="grid grid-cols-[60px_1fr_80px_80px_120px] md:grid-cols-[80px_1fr_100px_100px_160px] px-4 mb-2 min-w-[420px]" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
              <div>rank</div>
              <div>name</div>
              <div>wps</div>
              <div>acc</div>
              <div className="">date</div>
            </div>

            {/* rows */}
            <div className="flex flex-col min-w-[420px]">
              {loading ? (
                <div className="p-10 text-center" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Loading top players...</div>
              ) : leaders.length === 0 ? (
                <div className="p-10 text-center" style={{ color: 'var(--foreground)', opacity: 0.7 }}>No ranked players yet.</div>
              ) : (
                leaders.map((player, index, array) => (
                  <div
                    key={player.id}
                    className={`grid grid-cols-[60px_1fr_80px_80px_120px] md:grid-cols-[80px_1fr_100px_100px_160px]
                    px-4
                    h-14
                   items-center transition-colors duration-300 ${index === 0 ? 'rounded-t-xl' : index === array.length - 1 ? 'rounded-b-xl' : ''}`}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? 'var(--background)' : 'var(--card)',
                      color: 'var(--card-foreground)'
                    }}
                  >
                    <div className="pl-2">{index === 0 ? "👑" : index + 1}</div>
                    <div className="truncate pr-2">{player.username}</div>
                    <div style={{ color: index === 0 ? '#fbbf24' : 'var(--card-foreground)' }}>{Math.round(player.highWpm ?? 0)}</div>
                    <div style={{ color: index === 0 ? '#fbbf24' : 'var(--card-foreground)' }}>{Math.round(player.highAccuracy ?? 0)}%</div>
                    <div>{player.updatedAt ? new Date(player.updatedAt).toLocaleDateString() : '-'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}