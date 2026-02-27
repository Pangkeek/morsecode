"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Space_Mono } from 'next/font/google';
import { useAuth } from '@/contexts/AuthContext';

const spmono = Space_Mono({
    subsets: ['latin'],
    weight: ["400", "700"],
});

export default function Navbar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'home' },
        { href: '/practice', label: 'practice' },
        { href: '/leaderboard', label: 'leaderboard' },
        { href: '/about', label: 'about' },
    ];

    if (user && user.role === 'ADMIN') {
        navLinks.push({ href: '/admin/dashboard', label: 'admin' });
    }

    const linkClass = (href) =>
        `${spmono.className} font-bold transition-colors duration-300 hover:text-white text-base md:text-[20px] ${pathname === href ? 'text-white' : 'text-[#9CA3AF]'}`;

    return (
        <>
            <nav className='w-full flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-4 md:py-6 lg:py-10 absolute top-0 left-0 z-50 bg-[#141720]/80 backdrop-blur-sm shadow-xl'>
                <a href='/' className={`${spmono.className} font-bold text-white text-base md:text-[20px] shrink-0`}>morse<span className='text-[#EF4444]'>code</span></a>

                {/* Desktop: horizontal links + profile */}
                <div className='hidden md:flex max-w-[520px] flex-1 justify-between items-center gap-2 mx-6'>
                    {navLinks.filter(l => l.href !== '/').map(({ href, label }) => (
                        <a key={href} href={href} className={linkClass(href)}>{label}</a>
                    ))}
                    <a href='/profile' className={`${spmono.className} w-12 h-12 bg-[#252B3D] rounded-full flex items-center justify-center font-bold text-[14px] text-white outline outline-[#EF4444] shrink-0`}>
                        <p className='mb-1'>{user?.username ? user.username.slice(0, 2).toUpperCase() : 'JP'}</p>
                    </a>
                </div>

                {/* Mobile: hamburger button */}
                <button
                    type="button"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    className='md:hidden w-12 h-12 flex flex-col justify-center items-center gap-1.5 text-white focus:outline-none focus:ring-2 focus:ring-[#EF4444] rounded'
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    {menuOpen ? (
                        <span className='text-2xl leading-none' aria-hidden>×</span>
                    ) : (
                        <>
                            <span className='w-6 h-0.5 bg-white rounded' />
                            <span className='w-6 h-0.5 bg-white rounded' />
                            <span className='w-6 h-0.5 bg-white rounded' />
                        </>
                    )}
                </button>
            </nav>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className='md:hidden fixed top-[80px] left-0 w-full px-4 pb-4 bg-[#141720] border-b border-white/10 z-40 shadow-2xl'>
                    <div className={`flex flex-col gap-1 ${spmono.className}`}>
                        {navLinks.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                className={`block py-3 px-2 font-bold text-[18px] transition-colors duration-300 ${pathname === href ? 'text-white' : 'text-[#9CA3AF] hover:text-white'}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {label}
                            </a>
                        ))}
                        <a
                            href='/profile'
                            className={`flex items-center gap-3 py-3 px-2 font-bold text-[18px] text-[#9CA3AF] hover:text-white transition-colors duration-300 border-t border-white/10 mt-2 pt-4`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <span className='w-12 h-12 bg-[#252B3D] rounded-full flex items-center justify-center text-[14px] text-white outline outline-[#EF4444] shrink-0'>
                                <span className='mb-1'>{user?.username ? user.username.slice(0, 2).toUpperCase() : 'JP'}</span>
                            </span>
                            profile
                        </a>
                    </div>
                </div>
            )}

            {/* Decorative separator */}
            <div className='w-full px-4 sm:px-7 absolute top-[90px] md:top-[120px] left-0'>
                <div className='bg-white/10 w-full h-px'></div>
            </div>
        </>
    );
}
