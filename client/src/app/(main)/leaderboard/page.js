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
    <div className="">
      <div className="flex justify-center items-center py-14">
        <div
          className={`${spmono.className} font-bold w-[705px] h-[65px] bg-[#1E2332] rounded-xl flex items-center justify-between`}
        >
          <button
            onClick={() => setMode("decode")}
            className={`pl-10 pr-4 py-4 transition-colors duration-300 ${
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
      <div className="flex">
        <div className="w-[300px] h-[520px] bg-[#1E2332] rounded-xl">
          <div className="p-10 flex flex-col items-center">
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
          className={`${spmono.className} w-[810px] ml-10 text-[16px] font-bold text-[#9CA3AF]`}
        >
          {/* header */}
          <div className="grid grid-cols-[80px_1fr_100px_100px_160px] px-4 mb-2">
            <div>rank</div>
            <div>name</div>
            <div>wps</div>
            <div>acc</div>
            <div className="">date</div>
          </div>

          {/* rows */}
          <div className="flex flex-col">
            {[1, 2, 3, 4].map((i, index, array) => (
              <div
                key={i}
                className={`grid grid-cols-[80px_1fr_100px_100px_160px]
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
  );
}
