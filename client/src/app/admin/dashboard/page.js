"use client";

import React, { useState, useEffect } from 'react';
import { Space_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";

const spmono = Space_Mono({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const { theme } = useTheme();
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

            const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://morsecode-production-8a2d.up.railway.app/api";

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
                const errData = await contentsRes.json().catch(() => ({}));
                setError(`Failed to load content: ${contentsRes.status} ${errData.error || 'Server Error'}. Please try to Logout and Login again.`);
            }
        } catch (err) {
            console.error("Admin fetch error:", err);
            setError(`Network or System Error: ${err.message}`);
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
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://morsecode-production-8a2d.up.railway.app/api";

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
        return <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>Loading...</div>;
    }

    return (
        <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--background)' }}>
            <Navbar />
            <div className="pt-[140px] px-4 pb-10 flex justify-center">
                <div className="w-full max-w-6xl">
                    <div className="flex justify-between items-center mb-10">
                        <h1 className={`${spmono.className} text-3xl md:text-5xl font-bold tracking-wider flex items-center gap-4`} style={{ color: 'var(--foreground)' }}>
                            <span style={{ color: 'var(--primary)' }}>//</span> ADMIN DASHBOARD
                        </h1>
                        <div className="px-4 py-2 rounded-full font-bold text-sm" style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground, #fff)' }}>
                            ACCESS GRANTED
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-lg mb-8" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Metric Cards Row */}
                        {loadingMetrics ? (
                            <div className="md:col-span-2 text-center py-10" style={{ color: 'var(--foreground)' }}>Loading metrics...</div>
                        ) : metrics && (
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-6 rounded-xl flex flex-col items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                                    <div className="font-bold mb-2" style={{ color: 'var(--foreground)', opacity: 0.6 }}>TOTAL USERS</div>
                                    <div className="text-4xl font-bold" style={{ color: 'var(--card-foreground)' }}>{metrics.totalUsers}</div>
                                </div>
                                <div className="p-6 rounded-xl flex flex-col items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                                    <div className="font-bold mb-2" style={{ color: 'var(--foreground)', opacity: 0.6 }}>TOTAL PLAY SESSIONS</div>
                                    <div className="text-4xl font-bold" style={{ color: 'var(--card-foreground)' }}>{metrics.totalPlaySessions}</div>
                                </div>
                                <div className="p-6 rounded-xl flex flex-col items-center justify-center transition-colors duration-300" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                                    <div className="font-bold mb-2" style={{ color: 'var(--foreground)', opacity: 0.6 }}>GLOBAL AVG WPM</div>
                                    <div className="text-4xl font-bold" style={{ color: 'var(--primary)' }}>{metrics.globalAvgWpm}</div>
                                </div>
                            </div>
                        )}

                        {/* Content Management Section */}
                        <div className="md:col-span-2 rounded-xl overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                            <div className="p-4 font-bold flex justify-between items-center transition-colors duration-300" style={{ backgroundColor: 'var(--background)', color: 'var(--card-foreground)', borderBottom: '1px solid var(--border)' }}>
                                <span>📦 GAME CONTENT MANAGEMENT (HUMAN READABLE)</span>
                                <span className="text-xs" style={{ color: 'var(--foreground)', opacity: 0.5 }}>Manage what users see in each mode</span>
                            </div>
                            <div className="p-0 overflow-x-auto">
                                {loadingContents ? (
                                    <div className="p-10 text-center" style={{ color: 'var(--foreground)', opacity: 0.5 }}>Loading game contents...</div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-xs uppercase tracking-wider" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)', opacity: 0.7 }}>
                                                <th className="px-6 py-4">Mode</th>
                                                <th className="px-6 py-4">Symbol</th>
                                                <th className="px-6 py-4">Difficulty</th>
                                                <th className="px-6 py-4">Display Content</th>
                                                <th className="px-6 py-4">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm" style={{ color: 'var(--card-foreground)' }}>
                                            {contents.map((item) => (
                                                <tr key={item.id} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
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
                                                                className="w-full rounded p-2 focus:outline-none h-20"
                                                                style={{ backgroundColor: 'var(--background)', border: '1px solid var(--primary)', color: 'var(--foreground)' }}
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                            />
                                                        ) : (
                                                            <div className="max-w-xs truncate" style={{ color: 'var(--foreground)', opacity: 0.6 }}>{item.content}</div>
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
                                                                className="hover:underline text-xs font-bold"
                                                                style={{ color: 'var(--primary)' }}
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
                            <div className="md:col-span-2 rounded-xl overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
                                <div className="p-4 font-bold transition-colors duration-300" style={{ backgroundColor: 'var(--background)', color: 'var(--card-foreground)', borderBottom: '1px solid var(--border)' }}>
                                    🔥 PLATFORM'S MOST FAILED CHARACTERS
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-wrap gap-4">
                                        {metrics.mostFailedCharacters.length === 0 ? (
                                            <div className="w-full text-center py-4" style={{ color: 'var(--foreground)', opacity: 0.5 }}>No mistake data points gathered yet.</div>
                                        ) : (
                                            metrics.mostFailedCharacters.map((mistake, index) => (
                                                <div key={index} className="flex-1 min-w-[120px] p-4 rounded-lg flex flex-col items-center transition-colors duration-300" style={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)' }}>
                                                    <div className="text-4xl font-bold mb-2" style={{ color: index === 0 ? 'var(--primary)' : 'var(--card-foreground)' }}>
                                                        {mistake.character.toUpperCase()}
                                                    </div>
                                                    <div className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.5 }}>
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
