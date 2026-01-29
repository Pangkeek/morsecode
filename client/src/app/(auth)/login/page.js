import React from "react";
import { Space_Mono } from 'next/font/google';

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

function LoginPage() {
  return (
    <div className="w-full max-w-[705px]">
        <div
        className="
        max-w-[705px]
        min-h-[650px]
        bg-[#1E2332]
        rounded-xl
        flex
        flex-col
        items-center
        justify-center"
        >
        <p className={`${spmono.className} font-bold text-white text-[32px]`}>
            login
        </p>
        <div className="flex flex-col">
            <label className={`${spmono.className} font-bold text-[#9CA3AF] text-[16px] mt-[30px]`}>username</label>
            <input className='w-[540px] h-[80px] bg-[#2A3247] rounded-2xl mt-[8px]'/>
        </div>
        <div className="flex flex-col">
            <label className={`${spmono.className} font-bold text-[#9CA3AF] text-[16px] mt-[20px]`}>password</label>
            <input className='w-[540px] h-[80px] bg-[#2A3247] rounded-2xl mt-[8px]'/>
        </div>
        <button className={`${spmono.className} font-bold text-white text-[32px] w-[280px] h-[80px] bg-[#EF4444] rounded-xl mt-[50px]`}>
            login
        </button>
        <p className={`${spmono.className} font-bold text-white text-[14px] mt-[50px]`}>Don&apos;t have an account?</p>
        <a className={`${spmono.className} font-bold text-white text-[14px] underline`}>Register</a>
        </div>
    </div>
  );
}

export default LoginPage;
