"use client";

import React, { useState, useEffect } from "react";
import { Space_Mono } from "next/font/google";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

const spmono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Auto-refresh user data when entering profile page
  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, []); // Only run once when profile page loads

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          setLoadingHistory(false);
          return;
        }

        const API_URL = "https://morsecode-production.up.railway.app/api";
        const res = await fetch(`${API_URL}/play-sessions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleRowClick = async (sessionId) => {
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const API_URL = "https://morsecode-production.up.railway.app/api";
      const res = await fetch(`${API_URL}/play-sessions/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const sessionData = await res.json();
        setSelectedSession(sessionData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const getWeakness = (details) => {
    if (!details || details.length === 0) return "No data";
    const errors = details.filter(d => !d.isCorrect);
    if (errors.length === 0) return "No mistakes! Perfect score! 🎉";

    const charCount = {};
    errors.forEach(e => {
      const char = e.correctAnswer || e.question;
      charCount[char] = (charCount[char] || 0) + 1;
    });

    const worstChar = Object.keys(charCount).reduce((a, b) => charCount[a] > charCount[b] ? a : b);
    return `ตาวิเศษเห็นนะว่ารอบนี้คุณพิมพ์ตัว "${worstChar}" ผิดบ่อยสุด! (${charCount[worstChar]} ครั้ง) 😅`;
  };

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden px-4 box-border">
      <div className="w-full max-w-[975px] mx-auto min-w-0">
        <div
          className={`flex flex-col sm:flex-row w-full max-w-full bg-[#1E2132] rounded-lg mt-6 sm:mt-10 mb-6 sm:mb-10 p-4 sm:p-6 ${spmono.className} font-bold`}
        >
          <div
            className={`${spmono.className} w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-[#252B3D] rounded-full flex items-center justify-center font-bold text-[22px] sm:text-[28px] text-white outline outline-[#EF4444]`}
          >
            <p className="mb-1">
              {user?.username ? user.username.slice(0, 2).toUpperCase() : '?'}
            </p>
          </div>
          <div className="text-base sm:text-[20px] mt-4 sm:mt-0 sm:ml-10 min-w-0 w-full">
            <div className="space-y-4 sm:space-y-6">
              {/* Mobile View */}
              <div className="grid grid-cols-2 gap-2 sm:hidden md:hidden">
                <div className="text-white font-semibold">Username</div>
                <div className="text-[#9CA3AF] truncate" title={user?.username || 'N/A'}>{user?.username || 'N/A'}</div>
                <div className="text-white font-semibold">UID</div>
                <div className="text-[#9CA3AF] truncate" title={user?.id || 'N/A'}>{user?.id || 'N/A'}</div>
                <div className="text-white font-semibold">Rank</div>
                <div className="text-[#9CA3AF]">{user?.rank || '0'}</div>
              </div>
              
              {/* Tablet View */}
              <div className="hidden sm:grid md:hidden grid-cols-2 gap-3">
                <div className="text-white font-semibold">Username</div>
                <div className="text-[#9CA3AF] truncate" title={user?.username || 'N/A'}>{user?.username || 'N/A'}</div>
                <div className="text-white font-semibold">UID</div>
                <div className="text-[#9CA3AF] truncate" title={user?.id || 'N/A'}>{user?.id || 'N/A'}</div>
                <div className="text-white font-semibold">Rank</div>
                <div className="text-[#9CA3AF]">{user?.rank || '0'}</div>
              </div>
              
              {/* Desktop View */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 gap-x-4 md:gap-x-20 lg:gap-x-40">
                <div>Username</div>
                <div>UID</div>
                <div>Rank</div>
                <div className="text-[#9CA3AF] truncate" title={user?.username || 'N/A'}>{user?.username || 'N/A'}</div>
                <div className="text-[#9CA3AF] truncate" title={user?.id || 'N/A'}>{user?.id || 'N/A'}</div>
                <div className="text-[#9CA3AF]">{user?.rank || '0'}</div>
              </div>

              {/* Account Created - Mobile */}
              <div className="grid grid-cols-2 gap-2 sm:hidden md:hidden">
                <div className="text-white font-semibold">Acc Created</div>
                <div className="text-[#9CA3AF]">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })
                    : new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })
                  }
                </div>
                <div className="text-white font-semibold">E-mail</div>
                <div className="text-[#9CA3AF] truncate" title={user?.email || 'N/A'}>{user?.email || 'N/A'}</div>
                <div className="text-white font-semibold">Password</div>
                <div className="text-[#9CA3AF]">••••••</div>
                <div className="text-white font-semibold">Avg WPM</div>
                <div className="text-[#9CA3AF]">{user?.avgWpm?.toFixed(1) || '0.0'}</div>
                <div className="text-white font-semibold">Avg ACC</div>
                <div className="text-[#9CA3AF]">{user?.avgAccuracy?.toFixed(1) || '0.0'}%</div>
                <div className="text-white font-semibold">Total Play</div>
                <div className="text-[#9CA3AF]">{user?.totalPlay || '0'}</div>
              </div>
              
              {/* Account Created - Tablet */}
              <div className="hidden sm:grid md:hidden grid-cols-2 gap-3">
                <div className="text-white font-semibold">Acc Created</div>
                <div className="text-[#9CA3AF]">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })
                    : new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })
                  }
                </div>
                <div className="text-white font-semibold">E-mail</div>
                <div className="text-[#9CA3AF] truncate" title={user?.email || 'N/A'}>{user?.email || 'N/A'}</div>
                <div className="text-white font-semibold">Password</div>
                <div className="text-[#9CA3AF]">••••••</div>
                <div className="text-white font-semibold">Avg WPM</div>
                <div className="text-[#9CA3AF]">{user?.avgWpm?.toFixed(1) || '0.0'}</div>
                <div className="text-white font-semibold">Avg ACC</div>
                <div className="text-[#9CA3AF]">{user?.avgAccuracy?.toFixed(1) || '0.0'}%</div>
                <div className="text-white font-semibold">Total Play</div>
                <div className="text-[#9CA3AF]">{user?.totalPlay || '0'}</div>
              </div>
              
              {/* Account Created - Desktop */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 gap-x-4 md:gap-x-20 lg:gap-x-40 mt-6 sm:mt-10">
                <div>Acc Created</div>
                <div>E-mail</div>
                <div>Password</div>
                <div className="text-[#9CA3AF]">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })
                    : new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: '2-digit', 
                        day: '2-digit' 
                      })
                  }
                </div>
                <div className="text-[#9CA3AF] truncate" title={user?.email || 'N/A'}>{user?.email || 'N/A'}</div>
                <div className="text-[#9CA3AF]">••••••</div>
              </div>
              
              {/* Stats - Desktop */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 gap-x-4 md:gap-x-20 lg:gap-x-40 mt-6">
                <div>Avg WPM</div>
                <div>Avg ACC</div>
                <div>Total Play</div>
                <div className="text-[#9CA3AF]">{user?.avgWpm?.toFixed(1) || '0.0'}</div>
                <div className="text-[#9CA3AF]">{user?.avgAccuracy?.toFixed(1) || '0.0'}%</div>
                <div className="text-[#9CA3AF]">{user?.totalPlay || '0'}</div>
              </div>
            </div>
          </div>
        </div>

        <h1 className={`${spmono.className} text-xl sm:text-2xl md:text-[32px] space-mono font-bold mt-6 sm:mt-8`}>
          Play History
        </h1>
        <p className="text-[#9CA3AF] mb-4">Click on any session to view detailed analysis and your weak points.</p>
        
        <div className="w-full min-w-0 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className={`grid grid-cols-[minmax(100px,1fr)_60px_60px_80px] sm:grid-cols-[minmax(150px,1fr)_80px_80px_100px] md:grid-cols-[minmax(200px,1fr)_100px_100px_120px] lg:grid-cols-[400px_180px_180px_180px] px-4 mb-2 min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] ${spmono.className} font-bold text-[#9CA3AF] pt-4 sm:pt-2 text-xs sm:text-sm md:text-base`}
          >
            <div className="ml-0 sm:ml-5 md:ml-10">Mode</div>
            <div>WPM</div>
            <div>ACC</div>
            <div className="hidden sm:block">Date</div>
            <div className="sm:hidden">D</div>
          </div>
          
          <div className={`flex flex-col min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] ${spmono.className} font-bold text-[#9CA3AF] text-xs sm:text-sm md:text-base max-h-[400px] overflow-y-auto border border-[#2A3247] rounded-lg`}>
            {loadingHistory ? (
              <div className="py-8 text-center bg-[#1E2332] rounded-lg text-white">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="py-8 text-center bg-[#1E2332] rounded-lg text-white">No play sessions found. Go play some games!</div>
            ) : (
              <div className="space-y-0">
                {history.map((session, index) => (
                  <div
                    key={session.id}
                    onClick={() => handleRowClick(session.id)}
                    className={`grid grid-cols-[minmax(100px,1fr)_60px_60px_80px] sm:grid-cols-[minmax(150px,1fr)_80px_80px_100px] md:grid-cols-[minmax(200px,1fr)_100px_100px_120px] lg:grid-cols-[400px_180px_180px_180px]
                      px-4
                      h-10 sm:h-12 md:h-14 lg:h-16
                     items-center bg-[#1E2332] text-white cursor-pointer hover:bg-[#2A3247] transition-colors
                     ${index === 0 ? 'rounded-t-lg' : ''} 
                     ${index === history.length - 1 ? 'rounded-b-lg' : ''}
                     ${index < history.length - 1 ? 'border-b border-[#2A3247]' : ''}`}
                  >
                    <div className="pl-0 sm:pl-5 md:pl-10 truncate capitalize text-xs sm:text-sm md:text-base">
                      <span className="sm:hidden">{session.mode?.name?.slice(0,3)} {session.symbol?.name?.slice(0,3)} {session.difficulty?.amtWord}</span>
                      <span className="hidden sm:block md:hidden">{session.mode?.name?.slice(0,6)} {session.symbol?.name?.slice(0,6)} {session.difficulty?.amtWord}</span>
                      <span className="hidden md:inline">{session.mode?.name} {session.symbol?.name} {session.difficulty?.amtWord}</span>
                    </div>
                    <div className="text-xs sm:text-sm md:text-base">{session.wpm}</div>
                    <div className="text-xs sm:text-sm md:text-base">{session.accuracy}%</div>
                    <div className="text-xs sm:text-sm md:text-base">{new Date(session.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Session Details Modal */}
        {selectedSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 overflow-y-auto">
            <div className="bg-[#1E2332] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col my-auto border border-gray-700 shadow-2xl relative">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className={`${spmono.className} text-2xl font-bold text-white capitalize`}>
                      {selectedSession.mode?.name} {selectedSession.symbol?.name} {selectedSession.difficulty?.amtWord}
                    </h2>
                    <p className="text-gray-400 mt-1">
                      {new Date(selectedSession.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="flex gap-6 mt-4">
                  <div className="bg-[#2A3247] px-4 py-2 rounded-lg">
                    <div className="text-sm text-gray-400">WPM</div>
                    <div className="text-xl font-bold text-white">{selectedSession.wpm}</div>
                  </div>
                  <div className="bg-[#2A3247] px-4 py-2 rounded-lg">
                    <div className="text-sm text-gray-400">Accuracy</div>
                    <div className="text-xl font-bold text-white">{selectedSession.accuracy}%</div>
                  </div>
                  <div className="bg-[#2A3247] px-2 sm:px-4 py-2 rounded-lg">
                    <div className="text-xs sm:text-sm text-gray-400">Time</div>
                    <div className="text-lg sm:text-xl font-bold text-white">{selectedSession.timeTaken}s</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-[#252B3D]">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  🔍 Weakness Analysis
                </h3>
                <p className="text-lg bg-[#ef444420] text-[#EF4444] p-4 rounded-lg border border-[#ef444440]">
                  {getWeakness(selectedSession.details)}
                </p>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <h3 className="text-lg font-bold text-white mb-4">Input Timeline</h3>
                {selectedSession.details && selectedSession.details.length > 0 ? (
                  <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-2 sm:gap-4 bg-[#252B3D] p-2 sm:p-4 rounded-xl items-center text-xs sm:text-sm w-full overflow-x-auto min-w-[400px] sm:min-w-[500px]">
                    <div className="font-bold text-gray-400">#</div>
                    <div className="font-bold text-gray-400">Question</div>
                    <div className="font-bold text-gray-400">Answer</div>
                    <div className="font-bold text-gray-400 hidden sm:block">Correct</div>
                    <div className="font-bold text-gray-400 sm:hidden">✓</div>
                    <div className="font-bold text-gray-400 hidden sm:block">Time</div>
                    <div className="font-bold text-gray-400 sm:hidden">T</div>
                    
                    {selectedSession.details.map((detail, idx) => (
                      <React.Fragment key={idx}>
                        <div className="text-gray-500">{detail.orderIndex}</div>
                        <div className="text-white bg-[#1E2332] px-1 sm:px-2 py-1 rounded inline-block w-fit text-xs sm:text-sm">{detail.question}</div>
                        <div className={`${detail.isCorrect ? 'text-green-400' : 'text-red-400'} font-bold text-xs sm:text-sm`}>{detail.userAnswer || '-'}</div>
                        <div className="text-gray-400 hidden sm:block text-xs sm:text-sm">{detail.correctAnswer}</div>
                        <div className="text-gray-400 sm:hidden text-xs">{detail.isCorrect ? '✓' : '✗'}</div>
                        <div className="text-gray-500 text-right text-xs sm:text-sm">{detail.responseTime}ms</div>
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No detailed timeline available for this session.</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <h1 className={`${spmono.className} text-xl sm:text-2xl md:text-[32px] space-mono font-bold mt-6 sm:mt-8`}>
          Best Scores by Mode
        </h1>
        <div className="w-full min-w-0 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className={`grid grid-cols-[minmax(100px,1fr)_60px_60px_80px] sm:grid-cols-[minmax(150px,1fr)_80px_80px_100px] md:grid-cols-[minmax(200px,1fr)_100px_100px_120px] lg:grid-cols-[400px_180px_180px_180px] px-4 mb-2 min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] ${spmono.className} font-bold text-[#9CA3AF] pt-4 sm:pt-6 text-xs sm:text-sm md:text-base`}
          >
            <div className="ml-0 sm:ml-5 md:ml-10">Mode</div>
            <div>WPS</div>
            <div>ACC</div>
            <div className="hidden sm:block">Date</div>
            <div className="sm:hidden">D</div>
          </div>
          
          <div className={`flex flex-col min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] ${spmono.className} font-bold text-[#9CA3AF] text-xs sm:text-sm md:text-base`}>
            <div
              className={`grid grid-cols-[minmax(100px,1fr)_60px_60px_80px] sm:grid-cols-[minmax(150px,1fr)_80px_80px_100px] md:grid-cols-[minmax(200px,1fr)_100px_100px_120px] lg:grid-cols-[400px_180px_180px_180px]
                px-4
                h-10 sm:h-12 md:h-14 lg:h-16
               items-center bg-[#1E2332] text-white rounded-t-lg`}
            >
              <div className="pl-0 sm:pl-5 md:pl-10 truncate text-xs sm:text-sm md:text-base">
                <span className="sm:hidden">enc a-z 10</span>
                <span className="hidden sm:block md:hidden">Encode a-z</span>
                <span className="hidden md:inline">Encode a-z 10</span>
              </div>
              <div className="text-xs sm:text-sm md:text-base">N/A</div>
              <div className="text-xs sm:text-sm md:text-base">N/A</div>
              <div className="text-xs sm:text-sm md:text-base">01/01/2026</div>
            </div>
            
            <div
              className={`grid grid-cols-[minmax(100px,1fr)_60px_60px_80px] sm:grid-cols-[minmax(150px,1fr)_80px_80px_100px] md:grid-cols-[minmax(200px,1fr)_100px_100px_120px] lg:grid-cols-[400px_180px_180px_180px]
                px-4
                h-10 sm:h-12 md:h-14 lg:h-16
               items-center bg-[#1E2332] text-white`}
            >
              <div className="pl-0 sm:pl-5 md:pl-10 truncate text-xs sm:text-sm md:text-base">
                <span className="sm:hidden">enc a-z 15</span>
                <span className="hidden sm:block md:hidden">Encode a-z</span>
                <span className="hidden md:inline">Encode a-z 15</span>
              </div>
              <div className="text-xs sm:text-sm md:text-base">N/A</div>
              <div className="text-xs sm:text-sm md:text-base">N/A</div>
              <div className="text-xs sm:text-sm md:text-base">01/01/2026</div>
            </div>
            
            <div
              className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px]
                px-4
                h-12 sm:h-16
               items-center bg-[#1E2332] text-white rounded-b-lg`}
            >
              <div className="pl-0 sm:pl-10 truncate">Encode a-z 50</div>
              <div>N/A</div>
              <div>N/A</div>
              <div>01/01/2026</div>
            </div>
            
            <div
              className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px]
                px-4
                h-12 sm:h-16
               items-center bg-[#1E2332] text-white rounded-b-lg`}
            >
              <div className="pl-0 sm:pl-10 truncate">Encode word 10</div>
              <div>N/A</div>
              <div>N/A</div>
              <div>01/01/2026</div>
            </div>
            
            <div
              className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px]
                px-4
                h-12 sm:h-16
               items-center bg-[#1E2332] text-white rounded-b-lg`}
            >
              <div className="pl-0 sm:pl-10 truncate">Encode word 15</div>
              <div>N/A</div>
              <div>N/A</div>
              <div>01/01/2026</div>
            </div>
            
            <div
              className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px]
                px-4
                h-12 sm:h-16
               items-center bg-[#1E2332] text-white rounded-b-lg`}
            >
              <div className="pl-0 sm:pl-10 truncate">Encode word 100</div>
              <div>N/A</div>
              <div>N/A</div>
              <div>01/01/2026</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className={`${spmono.className} font-bold text-white text-[32px] w-full sm:w-[280px] h-20 bg-[#EF4444] rounded-xl mt-[50px] transition-all duration-300 hover:bg-white hover:text-[#EF4444] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed max-w-[280px] sm:max-w-none`}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
