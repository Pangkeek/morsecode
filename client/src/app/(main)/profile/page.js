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
    <div>
      <div
        className={`flex w-[975px] bg-[#1E2132] rounded-lg mt-10 mb-10 p-6 ${spmono.className} font-bold`}
      >
        <div
          className={`${spmono.className} w-24 h-24 bg-[#252B3D] rounded-full flex items-center justify-center font-bold text-[28px] text-white outline outline-[#EF4444]`}
        >
          <p className="mb-1">
            {user?.username ? user.username.slice(0, 2).toUpperCase() : 'JP'}
          </p>
        </div>
        <div className="text-[20px] ml-10">
          <div className="grid grid-cols-3 gap-4 gap-x-40">
            <div>Username</div>
            <div>UID</div>
            <div>Role</div>
            <div className="text-[#9CA3AF]">{user?.username || 'N/A'}</div>
            <div className="text-[#9CA3AF]">{user?.id || 'N/A'}</div>
            <div className="text-[#9CA3AF]">{user?.role || 'User'}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 gap-x-40 mt-10">
            <div>Acc Created</div>
            <div>E-mail</div>
            <div>Password</div>
            <div className="text-[#9CA3AF]">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</div>
            <div className="text-[#9CA3AF]">{user?.email || 'N/A'}</div>
            <div className="text-[#9CA3AF]">••••••••</div>
          </div>
        </div>
      </div>
      <h1 className={`${spmono.className} text-[32px] space-mono font-bold`}>
        Best Scores by Mode
      </h1>
      <div
        className={`grid grid-cols-[400px_180px_180px_180px] px-4 mb-2 ${spmono.className} font-bold text-[#9CA3AF] pt-6`}
      >
        <div className="ml-10">Mode</div>
        <div>WPS</div>
        <div>ACC</div>
        <div>Date</div>
      </div>
      <div
        className={`flex flex-col ${spmono.className} font-bold text-[#9CA3AF]`}
      >
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-t-lg`}
        >
          <div className="pl-10">encode a-z 10</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white`}
        >
          <div className="pl-10">encode a-z 15</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white`}
        >
          <div className="pl-10">encode a-z 50</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">encode a-z 100</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">encode word 10</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">encode word 15</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">encode word 50</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">encode word 100</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">decode a-z 10</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">decode a-z 15</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">decode a-z 50</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">decode a-z 100</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">decode word 10</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">decode word 15</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">decode word 50</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
        <div
          className={`grid grid-cols-[400px_180px_180px_180px]
                  px-4
                  h-16
                 items-center bg-[#1E2332] text-white rounded-b-lg`}
        >
          <div className="pl-10">decode word 100</div>
          <div>N/A</div>
          <div>N/A</div>
          <div>01/01/2026</div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className={`${spmono.className} font-bold text-white text-[32px] w-70 h-20 bg-[#EF4444] rounded-xl mt-[50px] transition-all duration-300 hover:bg-white hover:text-[#EF4444] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Log out
        </button>
      </div>
    </div>
  );
}
