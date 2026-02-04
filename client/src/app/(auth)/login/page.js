import React from "react";
import { Space_Mono } from 'next/font/google';

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

function LoginPage() {
  return (
    <div className="w-full max-w-176.25">
        <div
        className="
        max-w-176.25
        min-h-162.5
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
            <label className={`${spmono.className} font-bold text-[#9CA3AF] text-[16px] mt-7.5`}>username</label>
            <input 
                className={`w-135 h-20 bg-[#2A3247] rounded-2xl mt-2 ${spmono.className} font-bold text-white text-[16px] px-6`}
                placeholder="Enter username"
            />
        </div>
        <div className="flex flex-col">
            <label className={`${spmono.className} font-bold text-[#9CA3AF] text-[16px] mt-5`}>password</label>
            <input 
                type="password"
                className={`w-135 h-20 bg-[#2A3247] rounded-2xl mt-2 ${spmono.className} font-bold text-white text-[16px] px-6`}
                placeholder="Enter password"
            />
        </div>
        <button className={`${spmono.className} font-bold text-white text-[32px] w-70 h-20 bg-[#EF4444] rounded-xl mt-[50px] transition-all duration-300 hover:bg-white hover:text-[#EF4444] hover:scale-105`}>
            login
        </button>
        <p className={`${spmono.className} font-bold text-white text-[14px] mt-12.5`}>Don&apos;t have an account?</p>
        <a className={`${spmono.className} font-bold text-white text-[14px] underline transition-colors duration-300 hover:text-[#EF4444]`}>Register</a>
        </div>
    </div>
  );
}

export default LoginPage;
