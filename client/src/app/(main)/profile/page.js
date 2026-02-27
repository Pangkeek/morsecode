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
  const { user, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [bestScores, setBestScores] = useState([]);
  const [loadingBestScores, setLoadingBestScores] = useState(true);
  const [globalWeaknesses, setGlobalWeaknesses] = useState([]);
  const [loadingGlobalWeaknesses, setLoadingGlobalWeaknesses] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

    const fetchBestScores = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        const API_URL = "https://morsecode-production.up.railway.app/api";
        const res = await fetch(`${API_URL}/user-mode-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setBestScores(data);
        }
      } catch (err) {
        console.error("Failed to fetch best scores:", err);
      } finally {
        setLoadingBestScores(false);
      }
    };

    const fetchGlobalWeaknesses = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        const API_URL = "https://morsecode-production.up.railway.app/api";
        const res = await fetch(`${API_URL}/play-sessions/weakness/global`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setGlobalWeaknesses(data);
        }
      } catch (err) {
        console.error("Failed to fetch global weaknesses:", err);
      } finally {
        setLoadingGlobalWeaknesses(false);
      }
    };

    fetchHistory();
    fetchBestScores();
    fetchGlobalWeaknesses();
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
          <div className="bg-[#1E2332] p-6 sm:p-10 rounded-xl mt-6 sm:mt-10 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="flex flex-col gap-1">
                <div className="text-white font-bold opacity-50 uppercase text-xs tracking-wider">Username</div>
                <div className="text-[#9CA3AF] text-lg truncate" title={user?.username || 'N/A'}>{user?.username || 'N/A'}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-white font-bold opacity-50 uppercase text-xs tracking-wider">UID</div>
                <div className="text-[#9CA3AF] text-lg truncate" title={user?.id || 'N/A'}>{user?.id || 'N/A'}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-white font-bold opacity-50 uppercase text-xs tracking-wider">Role</div>
                <div className="text-[#9CA3AF] text-lg">{user?.role || 'User'}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-white font-bold opacity-50 uppercase text-xs tracking-wider">Account Created</div>
                <div className="text-[#9CA3AF] text-lg">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-white font-bold opacity-50 uppercase text-xs tracking-wider">E-mail</div>
                <div className="text-[#9CA3AF] text-lg truncate" title={user?.email || 'N/A'}>{user?.email || 'N/A'}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-white font-bold opacity-50 uppercase text-xs tracking-wider">Password</div>
                <div className="text-[#9CA3AF] text-lg">••••••••</div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Weaknesses Section */}
        <h1 className={`${spmono.className} text-xl sm:text-2xl md:text-[32px] space-mono font-bold mt-6 sm:mt-8`}>
          ตาวิเศษ (Global Weakness)
        </h1>
        <p className="text-[#9CA3AF] mb-4">The characters you have missed the most across all your play sessions.</p>

        <div className="flex flex-wrap gap-4 mb-10">
          {loadingGlobalWeaknesses ? (
            <div className="w-full bg-[#1E2332] p-6 rounded-lg text-center text-white">Loading weakness analysis...</div>
          ) : globalWeaknesses.length === 0 ? (
            <div className="w-full bg-[#1E2332] p-6 rounded-lg text-center text-white flex flex-col items-center">
              <span className="text-3xl mb-2">🎉</span>
              <p>You have no recorded mistakes! Perfect accuracy!</p>
            </div>
          ) : (
            globalWeaknesses.map((weakness, index) => (
              <div key={weakness.character} className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-lg border-b-4 ${index === 0 ? 'bg-[#ef444420] border-[#ef4444]' : 'bg-[#1E2332] border-[#2A3247]'} flex-1 min-w-[120px]`}>
                <div className={`text-4xl font-bold mb-2 ${index === 0 ? 'text-[#ef4444]' : 'text-white'}`}>
                  {weakness.character.toUpperCase()}
                </div>
                <div className="text-sm text-gray-400 capitalize bg-[#252B3D] px-3 py-1 rounded-full">
                  {weakness.errorCount} mistakes
                </div>
                {index === 0 && (
                  <div className="mt-2 text-xs font-bold text-[#ef4444] tracking-wider uppercase">
                    Highest Error Rate
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <h1 className={`${spmono.className} text-xl sm:text-2xl md:text-[32px] space-mono font-bold mt-6 sm:mt-8`}>
          Play History
        </h1>
        <p className="text-[#9CA3AF] mb-4">Click on any session to view detailed analysis and your weak points.</p>
        <div className="w-full min-w-0 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px] px-4 mb-2 min-w-[380px] sm:min-w-[500px] md:min-w-[600px] ${spmono.className} font-bold text-[#9CA3AF] pt-4 sm:pt-2 text-sm sm:text-base`}
          >
            <div className="ml-0 sm:ml-10">Mode</div>
            <div>WPM</div>
            <div>ACC</div>
            <div>Date</div>
          </div>
          <div
            className={`flex flex-col min-w-[380px] sm:min-w-[500px] md:min-w-[600px] ${spmono.className} font-bold text-[#9CA3AF] text-sm sm:text-base`}
          >
            {loadingHistory ? (
              <div className="py-8 text-center bg-[#1E2332] rounded-lg text-white">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="py-8 text-center bg-[#1E2332] rounded-lg text-white">No play sessions found. Go play some games!</div>
            ) : (
              history.map((session, index) => (
                <div
                  key={session.id}
                  onClick={() => handleRowClick(session.id)}
                  className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px]
                        px-4
                        h-12 sm:h-16
                       items-center bg-[#1E2332] text-white cursor-pointer hover:bg-[#2A3247] transition-colors
                       ${index === 0 ? 'rounded-t-lg' : ''} 
                       ${index === history.length - 1 ? 'rounded-b-lg' : ''}
                       border-b border-[#2A3247]`}
                >
                  <div className="pl-0 sm:pl-10 truncate capitalize">
                    {session.mode?.name} {session.symbol?.name} {session.difficulty?.amtWord}
                  </div>
                  <div>{session.wpm}</div>
                  <div>{session.accuracy}%</div>
                  <div>{new Date(session.createdAt).toLocaleDateString()}</div>
                </div>
              ))
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
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
                  <div className="bg-[#2A3247] px-4 py-2 rounded-lg truncate hide-on-mobile">
                    <div className="text-sm text-gray-400">Time</div>
                    <div className="text-xl font-bold text-white">{selectedSession.timeTaken}s</div>
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
                  <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 bg-[#252B3D] p-4 rounded-xl items-center text-sm sm:text-base w-full overflow-x-auto min-w-[500px]">
                    <div className="font-bold text-gray-400">#</div>
                    <div className="font-bold text-gray-400">Question</div>
                    <div className="font-bold text-gray-400">Your Answer</div>
                    <div className="font-bold text-gray-400">Correct</div>
                    <div className="font-bold text-gray-400">Time</div>

                    {selectedSession.details.map((detail, idx) => (
                      <React.Fragment key={idx}>
                        <div className="text-gray-500">{detail.orderIndex}</div>
                        <div className="text-white bg-[#1E2332] px-2 py-1 rounded inline-block w-fit">{detail.question}</div>
                        <div className={`${detail.isCorrect ? 'text-green-400' : 'text-red-400'} font-bold`}>{detail.userAnswer || '-'}</div>
                        <div className="text-gray-400">{detail.correctAnswer}</div>
                        <div className="text-gray-500 text-right">{detail.responseTime}ms</div>
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
            className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px] px-4 mb-2 min-w-[380px] sm:min-w-[500px] md:min-w-[600px] ${spmono.className} font-bold text-[#9CA3AF] pt-4 sm:pt-6 text-sm sm:text-base`}
          >
            <div className="ml-0 sm:ml-10">Mode</div>
            <div>WPS</div>
            <div>ACC</div>
            <div>Date</div>
          </div>
          <div
            className={`flex flex-col min-w-[380px] sm:min-w-[500px] md:min-w-[600px] ${spmono.className} font-bold text-[#9CA3AF] text-sm sm:text-base`}
          >
            {loadingBestScores ? (
              <div className="py-8 text-center bg-[#1E2332] rounded-lg text-white">Loading best scores...</div>
            ) : bestScores.length === 0 ? (
              <div className="py-8 text-center bg-[#1E2332] rounded-lg text-white">No best scores found yet.</div>
            ) : (
              bestScores.map((score, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px]
                        px-4
                        h-12 sm:h-16
                       items-center bg-[#1E2332] text-white hover:bg-[#2A3247] transition-colors
                       ${index === 0 ? 'rounded-t-lg' : ''} 
                       ${index === bestScores.length - 1 ? 'rounded-b-lg' : ''}
                       border-b border-[#2A3247]`}
                >
                  <div className="pl-0 sm:pl-10 truncate capitalize">
                    {score.mode?.name} {score.symbol?.name} {score.difficulty?.amtWord || score.difficulty?.name}
                  </div>
                  <div>{score.highWpm > 0 ? score.highWpm : 'N/A'}</div>
                  <div>{score.highAccuracy > 0 ? `${score.highAccuracy}%` : 'N/A'}</div>
                  <div>{score.updatedAt ? new Date(score.updatedAt).toLocaleDateString() : 'N/A'}</div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className={`${spmono.className} font-bold text-white text-[32px] w-full sm:w-[280px] h-20 bg-[#EF4444] rounded-xl mt-[50px] transition-all duration-300 hover:bg-white hover:text-[#EF4444] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed max-w-[280px] sm:max-w-none`}
          >
            Log out
          </button>
        </div>
      </div>
    </div >
  );
}
