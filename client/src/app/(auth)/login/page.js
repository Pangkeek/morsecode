"use client";

import React, { useState } from 'react'
import { Space_Mono } from 'next/font/google'
import { useAuth } from '@/contexts/AuthContext'

const spmono = Space_Mono({
  subsets: ['latin'],
  weight: ["400", "700"],
})

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const res = await fetch(
            "https://morsecode-production.up.railway.app/api/auth/login",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            }
          );

          const data = await res.json();

          if (!res.ok) {
            alert(data.message || "Login failed");
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
    <div className="w-full max-w-[705px] px-4 sm:px-0">
        <form onSubmit={handleSubmit}>
        <div
        className="
        max-w-[705px]
        min-h-[650px]
        bg-[#1E2332]
        rounded-xl
        flex
        flex-col
        items-center
        justify-center
        px-4 sm:px-0"
        >
        <p className={`${spmono.className} font-bold text-white text-[32px]`}>
            login
        </p>
        <div className="flex flex-col w-full sm:w-auto">
            <label className={`${spmono.className} font-bold text-[#9CA3AF] text-[16px] mt-7.5`}>email</label>
            <input 
                type="email"
                className={`w-full sm:w-[540px] h-20 bg-[#2A3247] rounded-2xl mt-2 ${spmono.className} font-bold text-white text-[16px] pl-6`}
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
        </div>
        <div className="flex flex-col w-full sm:w-auto">
            <label className={`${spmono.className} font-bold text-[#9CA3AF] text-[16px] mt-5`}>password</label>
            <input 
                type="password"
                className={`w-full sm:w-[540px] h-20 bg-[#2A3247] rounded-2xl mt-2 ${spmono.className} font-bold text-white text-[16px] pl-6`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <div className="flex items-center w-full sm:w-[540px] mt-4">
            <input 
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#EF4444] bg-[#2A3247] border-gray-600 rounded focus:ring-[#EF4444] focus:ring-2"
            />
            <label htmlFor="rememberMe" className={`${spmono.className} font-bold text-[#9CA3AF] text-[14px] ml-2`}>
                Remember me
            </label>
        </div>
        <button type="submit" disabled={loading} className={`${spmono.className} font-bold text-white text-[32px] w-full sm:w-[280px] h-20 bg-[#EF4444] rounded-xl mt-[50px] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? 'logging in...' : 'login'}
        </button>
        <p className={`${spmono.className} font-bold text-white text-[14px] mt-12.5`}>Don&apos;t have an account?</p>
        <a href="/register" className={`${spmono.className} font-bold text-white text-[14px] underline`}>Register</a>
        </div>
        </form>
    </div>
  );

}



export default LoginPage;

