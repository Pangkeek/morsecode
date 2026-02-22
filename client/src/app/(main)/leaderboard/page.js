"use client";

import { useState } from "react";
import { Space_Mono } from "next/font/google";

const spmono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Leaderboard() {
  const [selectedMode, setSelectedMode] = useState('character');
  const [mode, setMode] = useState('decode');
  const [type, setType] = useState('a-z');
  const [length, setLength] = useState('10');

  return (
    <div className="w-full max-w-full min-w-0 overflow-x-hidden px-4 box-border flex flex-col items-center">
      <div className="w-full max-w-[1200px] min-w-0">
      <div className="w-full max-w-full min-w-0 flex justify-center items-center py-8 sm:py-14">
        {/* Mobile/tablet: 3 dropdowns */}
        <div
          className={`${spmono.className} md:hidden font-bold w-full max-w-[705px] min-w-0 px-4 py-4 bg-[#1E2332] rounded-xl flex flex-wrap justify-center sm:justify-between items-center gap-3 sm:gap-4 box-border`}
        >
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className={`${spmono.className} font-bold bg-[#2A3247] text-white border border-[#3d4556] rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent min-w-[120px]`}
            aria-label="Mode"
          >
            <option value="decode" className="bg-[#2A3247] text-white">decode</option>
            <option value="encode" className="bg-[#2A3247] text-white">encode</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`${spmono.className} font-bold bg-[#2A3247] text-white border border-[#3d4556] rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent min-w-[120px]`}
            aria-label="Type"
          >
            <option value="a-z" className="bg-[#2A3247] text-white">a-z</option>
            <option value="word" className="bg-[#2A3247] text-white">word</option>
          </select>
          <select
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className={`${spmono.className} font-bold bg-[#2A3247] text-white border border-[#3d4556] rounded-lg px-4 py-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent min-w-[100px]`}
            aria-label="Length"
          >
            <option value="10" className="bg-[#2A3247] text-white">10</option>
            <option value="15" className="bg-[#2A3247] text-white">15</option>
            <option value="50" className="bg-[#2A3247] text-white">50</option>
            <option value="100" className="bg-[#2A3247] text-white">100</option>
          </select>
        </div>
        {/* Desktop: original button bar */}
        <div
          className={`${spmono.className} hidden md:flex font-bold w-full max-w-[705px] min-w-0 min-h-[65px] px-2 sm:px-4 bg-[#1E2332] rounded-xl flex-wrap items-center justify-between gap-1 sm:gap-2 box-border`}
        >
          <button
            onClick={() => setMode("decode")}
            className={`pl-4 pr-2 md:pl-10 md:pr-4 py-4 transition-colors duration-300 ${
              mode === "decode"
                ? "text-[#EF4444]"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            decode
          </button>
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-4 transition-colors duration-300 ${
              mode === "encode"
                ? "text-[#EF4444]"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            encode
          </button>
          <p className="text-[#9CA3AF]">|</p>
          <button
            onClick={() => setType("a-z")}
            className={`px-4 py-4 transition-colors duration-300 ${
              type === "a-z"
                ? "text-[#EF4444]"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            a-z
          </button>
          <button
            onClick={() => setType("word")}
            className={`px-4 py-4 transition-colors duration-300 ${
              type === "word"
                ? "text-[#EF4444]"
                : "text-[#9CA3AF] hover:text-white"
            }`}
          >
            word
          </button>
          <p className="text-[#9CA3AF]">|</p>
          <div className="flex">
            {["10", "15", "50", "100"].map((len) => (
              <button
                key={len}
                onClick={() => setLength(len)}
                className={`px-4 py-4 transition-colors duration-300 ${
                  length === len
                    ? "text-[#EF4444]"
                    : "text-[#9CA3AF] hover:text-white"
                } ${len === "100" ? "pr-10" : ""}`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full max-w-full min-w-0 flex flex-col lg:flex-row gap-6 lg:gap-10 lg:justify-center">
        <div className="w-full min-w-0 lg:w-[300px] lg:shrink-0 h-auto lg:h-[520px] bg-[#1E2332] rounded-xl">
          <div className="p-6 sm:p-10 flex flex-col items-center">
            <div
              className={`${spmono.className} w-24 h-24 bg-[#252B3D] rounded-full flex items-center justify-center font-bold text-[28px] text-white outline outline-[#EF4444]`}
            >
              <p className="mb-1">jp</p>
            </div>
            <p className={`${spmono.className} font-bold text-[20px] mt-4`}>
              Pangki
            </p>
            <p
              className={`${spmono.className} font-bold text-[24px] text-[#9CA3AF]`}
            >
              Rank : N/A{" "}
            </p>
            <p
              className={`${spmono.className} font-bold text-[32px] place-self-start mt-4`}
            >
              WPS
            </p>
            <p
              className={`${spmono.className} font-bold text-[50px] text-[#9CA3AF]`}
            >
              N/A
            </p>
            <p
              className={`${spmono.className} font-bold text-[32px] place-self-start`}
            >
              Acc
            </p>
            <p
              className={`${spmono.className} font-bold text-[50px] text-[#9CA3AF]`}
            >
              N/A
            </p>
          </div>
        </div>
        <div
          className={`${spmono.className} w-full min-w-0 lg:max-w-[810px] lg:ml-10 text-[16px] font-bold text-[#9CA3AF] overflow-x-auto rounded-xl`}
        >
          {/* header - scroll on narrow viewports */}
          <div className="grid grid-cols-[60px_1fr_80px_80px_120px] md:grid-cols-[80px_1fr_100px_100px_160px] px-4 mb-2 min-w-[420px]">
            <div>rank</div>
            <div>name</div>
            <div>wps</div>
            <div>acc</div>
            <div className="">date</div>
          </div>

          {/* rows */}
          <div className="flex flex-col min-w-[420px]">
            {[1, 2, 3, 4].map((i, index, array) => (
              <div
                key={i}
                className={`grid grid-cols-[60px_1fr_80px_80px_120px] md:grid-cols-[80px_1fr_100px_100px_160px]
                  px-4
                  h-14
                 items-center ${i % 2 === 0 ? 'bg-[#2A3142]' : 'bg-[#1E2332]'} ${
                  index === 0 ? 'rounded-t-xl' : index === array.length - 1 ? 'rounded-b-xl' : ''
                }`}
              >
                <div className="pl-2">{i === 1 ? "👑" : i}</div>
                <div>user{i}</div>
                <div>N/A</div>
                <div>N/A</div>
                <div>01/01/2026</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
