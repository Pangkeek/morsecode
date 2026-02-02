import Image from "next/image";
import React from 'react'
import { Space_Mono } from 'next/font/google';

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

export default function Home() {
  return (
    <div>
      <div className={`${spmono.className} font-bold w-[705px] h-[65px] bg-[#1E2332] rounded-xl flex items-center justify-between mt-14`}>
        <p className='text-[#9CA3AF] pl-10'>decode</p>
        <p className='text-[#9CA3AF]'>encode</p>
        <p className='text-[#9CA3AF]'>|</p>
        <p className='text-[#9CA3AF]'>a-z</p>
        <p className='text-[#9CA3AF]'>word</p>
        <p className='text-[#9CA3AF]'>|</p>
        <p className='text-[#9CA3AF]'>10</p>
        <p className='text-[#9CA3AF]'>15</p>
        <p className='text-[#9CA3AF]'>50</p>
        <p className='text-[#9CA3AF] pr-10'>100</p>
      </div>
    </div>
  );
}
