import React from 'react'
import { Space_Mono } from 'next/font/google';

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

function Authlayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#141720] px-4">
        <h1 className={`${spmono.className} font-bold text-white text-3xl sm:text-4xl md:text-[48px] mb-[30px]`}>morse<span className='text-[#EF4444]'>code</span></h1>
        {children}
    </div>
  )
}

export default Authlayout
