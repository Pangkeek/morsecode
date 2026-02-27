"use client";

import React, { useState, useEffect } from 'react';
import { Space_Mono } from "next/font/google";
import Navbar from '../../../components/Navbar';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const spmono = Space_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [metrics, setMetrics] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchAdminMetrics = async () => {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (!token) return;

                const API_URL = "http://localhost:5000/api";
                const res = await fetch(`${API_URL}/admin/metrics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setMetrics(data);
                } else {
                    setError("Failed to load metrics. Are you sure you're an Admin?");
                }
            } catch (err) {
                console.error("Admin fetch error:", err);
                setError(err.message);
            } finally {
                setLoadingMetrics(false);
            }
        };

        if (user && user.role === 'ADMIN') {
            fetchAdminMetrics();
        }
    }, [user]);

    if (authLoading || (user && user.role !== 'ADMIN')) {
        return <div className="min-h-screen bg-[#0E121E] flex justify-center items-center text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-[#0E121E]">
            <Navbar />
            <div className="pt-[140px] px-4 pb-10 flex justify-center">
                <div className="w-full max-w-6xl">
                    <div className="flex justify-between items-center mb-10">
                        <h1 className={`${spmono.className} text-3xl md:text-5xl font-bold text-white tracking-wider flex items-center gap-4`}>
                            <span className="text-[#EF4444]">//</span> ADMIN DASHBOARD
                        </h1>
                        <div className="bg-[#EF4444] text-white px-4 py-2 rounded-full font-bold text-sm">
                            ACCESS GRANTED
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg mb-8">
                            {error}
                        </div>
                    )}

                    {loadingMetrics ? (
                        <div className="text-white text-center py-20">Loading platform metrics...</div>
                    ) : metrics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Metric Cards Row */}
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#1E2332] p-6 rounded-xl border border-[#2A3247] flex flex-col items-center justify-center">
                                    <div className="text-gray-400 font-bold mb-2">TOTAL USERS</div>
                                    <div className="text-4xl text-white font-bold">{metrics.totalUsers}</div>
                                </div>
                                <div className="bg-[#1E2332] p-6 rounded-xl border border-[#2A3247] flex flex-col items-center justify-center">
                                    <div className="text-gray-400 font-bold mb-2">TOTAL PLAY SESSIONS</div>
                                    <div className="text-4xl text-white font-bold">{metrics.totalPlaySessions}</div>
                                </div>
                                <div className="bg-[#1E2332] p-6 rounded-xl border border-[#2A3247] flex flex-col items-center justify-center">
                                    <div className="text-gray-400 font-bold mb-2">GLOBAL AVG WPM</div>
                                    <div className="text-4xl text-[#EF4444] font-bold">{metrics.globalAvgWpm}</div>
                                </div>
                            </div>

                            {/* Most Failed Characters */}
                            <div className="md:col-span-2 bg-[#1E2332] rounded-xl border border-[#2A3247] overflow-hidden">
                                <div className="bg-[#252B3D] p-4 font-bold text-white border-b border-[#2A3247]">
                                    🔥 PLATFORM'S MOST FAILED CHARACTERS
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-4">
                                        {metrics.mostFailedCharacters.length === 0 ? (
                                            <div className="text-gray-400 w-full text-center py-4">No mistake data points gathered yet.</div>
                                        ) : (
                                            metrics.mostFailedCharacters.map((mistake, index) => (
                                                <div key={index} className="flex-1 min-w-[120px] bg-[#2A3247] p-4 rounded-lg flex flex-col items-center border border-[#3d4556]">
                                                    <div className={`text-4xl font-bold mb-2 ${index === 0 ? 'text-[#ef4444]' : 'text-white'}`}>
                                                        {mistake.character.toUpperCase()}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {mistake.errorCount} Errors
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
