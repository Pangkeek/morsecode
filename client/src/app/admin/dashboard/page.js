"use client";

import React, { useState, useEffect } from 'react';
import { Space_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';
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
    const [contents, setContents] = useState([]);
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [loadingContents, setLoadingContents] = useState(true);
    const [error, setError] = useState(null);

    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) return;

            const API_URL = "https://morsecode-production.up.railway.app/api";

            // Fetch Metrics
            const metricsRes = await fetch(`${API_URL}/admin/metrics`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (metricsRes.ok) {
                const data = await metricsRes.json();
                setMetrics(data);
            }

            // Fetch Contents
            const contentsRes = await fetch(`${API_URL}/admin/contents`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (contentsRes.ok) {
                const data = await contentsRes.json();
                setContents(data);
            } else {
                setError("Failed to load admin data. Access denied.");
            }
        } catch (err) {
            console.error("Admin fetch error:", err);
            setError(err.message);
        } finally {
            setLoadingMetrics(false);
            setLoadingContents(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            fetchData();
        }
    }, [user]);

    const handleUpdateContent = async (id) => {
        setUpdating(true);
        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const API_URL = "https://morsecode-production.up.railway.app/api";

            const res = await fetch(`${API_URL}/admin/contents/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: editValue })
            });

            if (res.ok) {
                setContents(contents.map(c => c.id === id ? { ...c, content: editValue } : c));
                setEditingId(null);
            } else {
                alert("Failed to update content");
            }
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setUpdating(false);
        }
    };

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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Metric Cards Row */}
                        {loadingMetrics ? (
                            <div className="md:col-span-2 text-white text-center py-10">Loading metrics...</div>
                        ) : metrics && (
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
                        )}

                        {/* Content Management Section */}
                        <div className="md:col-span-2 bg-[#1E2332] rounded-xl border border-[#2A3247] overflow-hidden">
                            <div className="bg-[#252B3D] p-4 font-bold text-white border-b border-[#2A3247] flex justify-between items-center">
                                <span>📦 GAME CONTENT MANAGEMENT (HUMAN READABLE)</span>
                                <span className="text-xs text-gray-400">Manage what users see in each mode</span>
                            </div>
                            <div className="p-0 overflow-x-auto">
                                {loadingContents ? (
                                    <div className="p-10 text-center text-gray-400">Loading game contents...</div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-[#161B28] text-gray-400 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4">Mode</th>
                                                <th className="px-6 py-4">Symbol</th>
                                                <th className="px-6 py-4">Difficulty</th>
                                                <th className="px-6 py-4">Display Content</th>
                                                <th className="px-6 py-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-white text-sm">
                                            {contents.map((item) => (
                                                <tr key={item.id} className="border-b border-[#2A3247] hover:bg-[#252B3D] transition-colors">
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.mode.name === 'encode' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                                            {item.mode.name.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 capitalize">{item.symbol.name}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold">{item.difficulty.name.toUpperCase()}</span>
                                                            <span className="text-xs text-gray-500">{item.difficulty.amtWord} words</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {editingId === item.id ? (
                                                            <textarea
                                                                className="w-full bg-[#0E121E] border border-[#EF4444] rounded p-2 text-white focus:outline-none h-20"
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                            />
                                                        ) : (
                                                            <div className="max-w-xs truncate text-gray-400">{item.content}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {editingId === item.id ? (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    disabled={updating}
                                                                    onClick={() => handleUpdateContent(item.id)}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                                                                >
                                                                    {updating ? '...' : 'SAVE'}
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingId(null)}
                                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs"
                                                                >
                                                                    X
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setEditingId(item.id);
                                                                    setEditValue(item.content);
                                                                }}
                                                                className="text-[#EF4444] hover:underline text-xs font-bold"
                                                            >
                                                                EDIT
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Most Failed Characters */}
                        {metrics && (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
