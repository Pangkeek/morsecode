"use client";

import React, { useState } from 'react'
import { Space_Mono } from 'next/font/google'
import { useAuth } from '@/contexts/AuthContext'

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

function RegisterPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const res = await fetch(
            "https://morsecode-production.up.railway.app/api/auth/register",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password, username }),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            alert(data.message || "Register failed");
            return;
          }

          // Use login function from AuthContext
          login(data.token, data.user);
        } catch (err) {
          alert("Server error");
        } finally {
          setLoading(false);
        }
    }
  return (
    <div className="w-full max-w-[705px]">
        <form onSubmit={handleSubmit}>
        <div
        className="
        max-w-[705px]
        min-h-[725px]
        bg-[#1E2332]
        rounded-xl
        flex
        flex-col
        items-center
        justify-center"
        >
        <p className={`${spmono.className} font-bold text-white text-[32px]`}>
            register
        </p>
        <div className="flex flex-col">
            <label className={`${spmono.className} font-bold text-[#9CA3AF] text-[16px] mt-[25px]`}>email</label>
            <input 
                type="email"
                className={`w-[540px] h-[80px] bg-[#2A3247] rounded-2xl mt-[8px] ${spmono.className} font-bold text-white text-[16px] px-6`}
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="flex flex-col">
            <label className={`${spmono.className} font-bold text-[#9CA3AF] text-[16px] mt-[8px]`}>username</label>
            <input 
                type="username"
                className={`w-[540px] h-[80px] bg-[#2A3247] rounded-2xl mt-[8px] ${spmono.className} font-bold text-white text-[16px] px-6`}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
        </div>
        <div className="flex flex-col">
            <label className={`${spmono.className} font-bold text-[#9CA3AF] text-[16px] mt-[8px]`}>password</label>
            <input 
                type="password"
                className={`w-[540px] h-[80px] bg-[#2A3247] rounded-2xl mt-[8px] ${spmono.className} font-bold text-white text-[16px] px-6`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button 
            type="submit"
            onClick={handleSubmit}
            className={`${spmono.className} font-bold text-white text-[32px] w-[280px] h-[80px] bg-[#EF4444] rounded-xl mt-[40px] transition-all duration-300 hover:bg-white hover:text-[#EF4444] hover:scale-105`}>
            register
        </button>
        <p className={`${spmono.className} font-bold text-white text-[14px] mt-[30px]`}>Already have an account?</p>
        <a href="/login" className={`${spmono.className} font-bold text-white text-[14px] underline transition-colors duration-300 hover:text-[#EF4444]`}>Log in</a>
        </div>
        </form>
    </div>
  )
}

export default RegisterPage
