import Image from "next/image";
import React from 'react'
import { Space_Mono } from 'next/font/google';


const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

export default function Home() {
  return (
    <div className='flex flex-col items-center'>
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
      <div className='flex'>
        <p className={`${spmono.className} text-white text-[48px] font-bold`}>A</p>
        <p className={`${spmono.className} text-white text-[48px] font-bold ml-8`}>E</p>
        <p className={`${spmono.className} text-white text-[48px] font-bold ml-8`}>I</p>
        <p className={`${spmono.className} text-white text-[48px] font-bold ml-8`}>O</p>
        <p className={`${spmono.className} text-white text-[48px] font-bold ml-8`}>U</p>
        <p className={`${spmono.className} text-white text-[48px] font-bold ml-8`}>A</p>
        <p className={`${spmono.className} text-[#5a5e61] text-[48px] font-bold ml-8`}>E</p>
        <p className={`${spmono.className} text-[#5a5e61] text-[48px] font-bold ml-8`}>I</p>
        <p className={`${spmono.className} text-[#5a5e61] text-[48px] font-bold ml-8`}>O</p>
        <p className={`${spmono.className} text-[#5a5e61] text-[48px] font-bold ml-8`}>U</p>
      </div>
      <Image src="/reset-svgrepo-com 1.svg" width={14} height={14} alt="" className="mt-10"/>
      <p className={`${spmono.className} text-white text-[48px] font-bold ml-8`}>.--.-</p>
      <div>
        <div className="bg-[#717171] text-[11px]">
            <p className={`${spmono.className} font-bold text-[#141720] mx-1`}>spacebar - to input</p>
        </div>
        <div className="bg-[#717171] text-[11px]">
          <p className={`${spmono.className} font-bold text-[#141720] mx-1 mt-3`}>enter - to reset</p>
        </div>
      </div>
    </div>
  );
}
