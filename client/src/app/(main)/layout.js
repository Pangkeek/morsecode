"use client";

import React from 'react'
import { usePathname } from 'next/navigation';
import { Space_Mono } from 'next/font/google';

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

function Mainlayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#141720] px-4">
        <nav className='w-full flex justify-between px-22 py-10'>
            <div className='w-[520px] flex justify-between items-center'>
                <a href='/' className={`${spmono.className} font-bold text-white text-[20px]`}>morse<span className='text-[#EF4444]'>code</span></a>
                <a href='/practice' className={`${spmono.className} font-bold transition-colors duration-300 hover:text-white ${pathname === '/practice' ? 'text-white' : 'text-[#9CA3AF]'}`}>practice</a>
                <a href='/leaderboard' className={`${spmono.className} font-bold transition-colors duration-300 hover:text-white ${pathname === '/leaderboard' ? 'text-white' : 'text-[#9CA3AF]'}`}>leaderboard</a>
                <a href='/about' className={`${spmono.className} font-bold transition-colors duration-300 hover:text-white ${pathname === '/about' ? 'text-white' : 'text-[#9CA3AF]'}`}>about</a>
            </div>
            <a href='/profile' className={`${spmono.className} w-12 h-12 bg-[#252B3D] rounded-full flex items-center justify-center font-bold text-[14px] text-white outline outline-[#EF4444]`}>
              <p className='mb-1'>jp</p>
            </a>
        </nav>
        <div className='w-full px-7'>
            <div className='bg-white w-full h-[1px]'></div>
        </div>
        {children}
    </div>
  )
}

export default Mainlayout
