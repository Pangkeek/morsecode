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
<<<<<<< HEAD
            className={`${spmono.className} md:hidden font-bold w-full max-w-[705px] min-w-0 px-4 py-4 bg-card rounded-xl flex flex-wrap justify-center sm:justify-between items-center gap-3 sm:gap-4 box-border`}
=======
            className={`${spmono.className} md:hidden font-bold w-full max-w-[705px] min-w-0 px-4 py-4 rounded-xl flex flex-wrap justify-center sm:justify-between items-center gap-3 sm:gap-4 box-border transition-colors duration-300`}
            style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }}
>>>>>>> origin/main
          >
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
<<<<<<< HEAD
              className={`${spmono.className} font-bold bg-card text-foreground border border-border rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent min-w-[120px]`}
              aria-label="Mode"
            >
              <option value="decode" className="bg-card text-foreground">decode</option>
              <option value="encode" className="bg-card text-foreground">encode</option>
=======
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
>>>>>>> origin/main
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
<<<<<<< HEAD
              className={`${spmono.className} font-bold bg-card text-foreground border border-border rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent min-w-[120px]`}
              aria-label="Type"
            >
              <option value="a-z" className="bg-card text-foreground">a-z</option>
              <option value="word" className="bg-card text-foreground">word</option>
=======
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
>>>>>>> origin/main
            </select>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
<<<<<<< HEAD
              className={`${spmono.className} font-bold bg-card text-foreground border border-border rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent min-w-[100px]`}
              aria-label="Length"
            >
              <option value="10" className="bg-card text-foreground">10</option>
              <option value="15" className="bg-card text-foreground">15</option>
              <option value="50" className="bg-card text-foreground">50</option>
              <option value="100" className="bg-card text-foreground">100</option>
=======
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
>>>>>>> origin/main
            </select>
          </div>
          {/* Desktop: original button bar */}
          <div
<<<<<<< HEAD
            className={`${spmono.className} hidden md:flex font-bold w-full max-w-[705px] min-w-0 min-h-[65px] px-2 sm:px-4 bg-card rounded-xl flex-wrap items-center justify-between gap-1 sm:gap-2 box-border`}
          >
            <button
              onClick={() => setMode("decode")}
              className={`pl-4 pr-2 md:pl-10 md:pr-4 py-4 transition-colors duration-300 ${mode === "decode"
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground"
                }`}
=======
            className={`${spmono.className} hidden md:flex font-bold w-full max-w-[705px] min-w-0 min-h-[65px] px-2 sm:px-4 rounded-xl flex-wrap items-center justify-between gap-1 sm:gap-2 box-border transition-colors duration-300`}
            style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setMode("decode")}
              className={`pl-4 pr-2 md:pl-10 md:pr-4 py-4 transition-colors duration-300`}
              style={{ color: mode === "decode" ? 'var(--primary)' : 'var(--foreground)', opacity: mode === "decode" ? 1 : 0.7 }}


>>>>>>> origin/main
            >
              decode
            </button>
            <button
              onClick={() => setMode("encode")}
<<<<<<< HEAD
              className={`px-4 py-4 transition-colors duration-300 ${mode === "encode"
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground"
                }`}
            >
              encode
            </button>
            <p className="text-foreground/70">|</p>
            <button
              onClick={() => setType("a-z")}
              className={`px-4 py-4 transition-colors duration-300 ${type === "a-z"
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground"
                }`}
=======
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


>>>>>>> origin/main
            >
              a-z
            </button>
            <button
              onClick={() => setType("word")}
<<<<<<< HEAD
              className={`px-4 py-4 transition-colors duration-300 ${type === "word"
                ? "text-primary"
                : "text-foreground/70 hover:text-foreground"
                }`}
            >
              word
            </button>
            <p className="text-foreground/70">|</p>
=======
              className={`px-4 py-4 transition-colors duration-300`}
              style={{ color: type === "word" ? 'var(--primary)' : 'var(--foreground)', opacity: type === "word" ? 1 : 0.7 }}


            >
              word
            </button>
            <p style={{ color: 'var(--foreground)', opacity: 0.7 }}>|</p>
>>>>>>> origin/main
            <div className="flex">
              {["10", "15", "50", "100"].map((len) => (
                <button
                  key={len}
                  onClick={() => setLength(len)}
<<<<<<< HEAD
                  className={`px-4 py-4 transition-colors duration-300 ${length === len
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
                    } ${len === "100" ? "pr-10" : ""}`}
=======
                  className={`px-4 py-4 transition-colors duration-300 ${len === "100" ? "pr-10" : ""}`}
                  style={{ color: length === len ? 'var(--primary)' : 'var(--foreground)', opacity: length === len ? 1 : 0.7 }}


>>>>>>> origin/main
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full max-w-full min-w-0 flex flex-col lg:flex-row gap-6 lg:gap-10 lg:justify-center">
<<<<<<< HEAD
          <div className="w-full min-w-0 lg:w-[300px] lg:shrink-0 h-auto lg:h-[520px] bg-card rounded-xl">
            <div className="p-6 sm:p-10 flex flex-col items-center">
              <div
                className={`${spmono.className} w-24 h-24 bg-card rounded-full flex items-center justify-center font-bold text-[28px] text-foreground outline outline-primary`}
=======
          <div className="w-full min-w-0 lg:w-[300px] lg:shrink-0 h-auto lg:h-[520px] rounded-xl transition-colors duration-300" style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }}>
            <div className="p-6 sm:p-10 flex flex-col items-center">
              <div
                className={`${spmono.className} w-24 h-24 rounded-full flex items-center justify-center font-bold text-[28px] outline transition-colors duration-300`}
                style={{ 
                  backgroundColor: 'var(--background)', 
                  color: 'var(--foreground)',
                  outlineColor: 'var(--primary)'
                }}
>>>>>>> origin/main
              >
                <p className="mb-1">{user?.username?.slice(0, 2)?.toLowerCase() || '??'}</p>
              </div>
              <p className={`${spmono.className} font-bold text-[20px] mt-4`} style={{ color: 'var(--card-foreground)' }}>
                {user?.username || 'Guest'}
              </p>
              <p
<<<<<<< HEAD
                className={`${spmono.className} font-bold text-[24px] text-foreground/70`}
=======
                className={`${spmono.className} font-bold text-[24px]`}
                style={{ color: 'var(--foreground)', opacity: 0.7 }}
>>>>>>> origin/main
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
<<<<<<< HEAD
                className={`${spmono.className} font-bold text-[50px] text-foreground/70`}
=======
                className={`${spmono.className} font-bold text-[50px]`}
                style={{ color: 'var(--foreground)', opacity: 0.7 }}
>>>>>>> origin/main
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
<<<<<<< HEAD
                className={`${spmono.className} font-bold text-[50px] text-foreground/70`}
=======
                className={`${spmono.className} font-bold text-[50px]`}
                style={{ color: 'var(--foreground)', opacity: 0.7 }}
>>>>>>> origin/main
              >
                {myEntry ? `${Math.round(myEntry.highAccuracy)}%` : 'N/A'}
              </p>
            </div>
          </div>
          <div
<<<<<<< HEAD
            className={`${spmono.className} w-full min-w-0 lg:max-w-[810px] lg:ml-10 text-[16px] font-bold text-foreground/70 overflow-x-auto rounded-xl`}
=======
            className={`${spmono.className} w-full min-w-0 lg:max-w-[810px] lg:ml-10 text-[16px] font-bold overflow-x-auto rounded-xl transition-colors duration-300`}
            style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }}
>>>>>>> origin/main
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
<<<<<<< HEAD
                <div className="p-10 text-center text-foreground/70">Loading top players...</div>
              ) : leaders.length === 0 ? (
                <div className="p-10 text-center text-foreground/70">No ranked players yet.</div>
=======
                <div className="p-10 text-center" style={{ color: 'var(--foreground)', opacity: 0.7 }}>Loading top players...</div>
              ) : leaders.length === 0 ? (
                <div className="p-10 text-center" style={{ color: 'var(--foreground)', opacity: 0.7 }}>No ranked players yet.</div>
>>>>>>> origin/main
              ) : (
                leaders.map((player, index, array) => (
                  <div
                    key={player.id}
                    className={`grid grid-cols-[60px_1fr_80px_80px_120px] md:grid-cols-[80px_1fr_100px_100px_160px]
                    px-4
                    h-14
<<<<<<< HEAD
                   items-center ${index % 2 === 0 ? 'bg-[#2A3142]' : 'bg-card'} ${index === 0 ? 'rounded-t-xl' : index === array.length - 1 ? 'rounded-b-xl' : ''
                      }`}
=======
                   items-center transition-colors duration-300 ${index === 0 ? 'rounded-t-xl' : index === array.length - 1 ? 'rounded-b-xl' : ''}`}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? 'var(--background)' : 'var(--card)',
                      color: 'var(--card-foreground)'
                    }}
>>>>>>> origin/main
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