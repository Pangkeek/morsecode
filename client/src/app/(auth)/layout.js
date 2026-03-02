import React from 'react'
import { Space_Mono } from 'next/font/google';

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

function Authlayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <h1 className={`${spmono.className} font-bold text-foreground text-3xl sm:text-4xl md:text-[48px] mb-[30px]`}>morse<span className='text-primary'>code</span></h1>
        {children}
    </div>
  )
}

export default Authlayout
