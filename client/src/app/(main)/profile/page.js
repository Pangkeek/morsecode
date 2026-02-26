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

  const handleLogout = () => {
    logout();
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 gap-x-4 md:gap-x-20 lg:gap-x-40">
            <div>Username</div>
            <div>UID</div>
            <div>Role</div>
            <div className="text-[#9CA3AF] truncate" title={user?.username || 'N/A'}>{user?.username || 'N/A'}</div>
            <div className="text-[#9CA3AF] truncate" title={user?.id || 'N/A'}>{user?.id || 'N/A'}</div>
            <div className="text-[#9CA3AF]">{user?.role || 'User'}</div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 gap-x-4 md:gap-x-20 lg:gap-x-40 mt-6 sm:mt-10">
            <div>Acc Created</div>
            <div>E-mail</div>
            <div>Password</div>
            <div className="text-[#9CA3AF]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
            <div className="text-[#9CA3AF] truncate" title={user?.email || 'N/A'}>{user?.email || 'N/A'}</div>
            <div className="text-[#9CA3AF]">••••••••</div>
          </div>
        </div>
      </div>
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
        <div
          className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-12 sm:h-16
                 items-center bg-[#1E2332] text-white rounded-t-lg`}
        >
          <div className="pl-0 sm:pl-10 truncate">encode a-z 10</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-12 sm:h-16
                 items-center bg-[#1E2332] text-white`}
        >
          <div className="pl-0 sm:pl-10 truncate">encode a-z 15</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[minmax(140px,1fr)_80px_80px_100px] sm:grid-cols-[minmax(200px,1fr)_100px_100px_120px] md:grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-12 sm:h-16
                 items-center bg-[#1E2332] text-white`}
        >
          <div className="pl-0 sm:pl-10 truncate">encode a-z 50</div>
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
          <div className="pl-0 sm:pl-10 truncate">encode a-z 100</div>
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
          <div className="pl-0 sm:pl-10 truncate">encode word 10</div>
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
          <div className="pl-0 sm:pl-10 truncate">encode word 15</div>
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
          <div className="pl-0 sm:pl-10 truncate">encode word 50</div>
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
          <div className="pl-0 sm:pl-10 truncate">encode word 100</div>
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
          <div className="pl-0 sm:pl-10 truncate">decode a-z 10</div>
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
          <div className="pl-0 sm:pl-10 truncate">decode a-z 15</div>
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
          <div className="pl-0 sm:pl-10 truncate">decode a-z 50</div>
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
          <div className="pl-0 sm:pl-10 truncate">decode a-z 100</div>
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
          <div className="pl-0 sm:pl-10 truncate">decode word 10</div>
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
          <div className="pl-0 sm:pl-10 truncate">decode word 15</div>
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
          <div className="pl-0 sm:pl-10 truncate">decode word 50</div>
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
          <div className="pl-0 sm:pl-10 truncate">decode word 100</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
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
    </div>
  );
}
