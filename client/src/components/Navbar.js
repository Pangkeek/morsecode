"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Space_Mono } from 'next/font/google';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const spmono = Space_Mono({
    subsets: ['latin'],
    weight: ["400", "700"],
});

export default function Navbar() {
    const pathname = usePathname();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'home' },
        { href: '/practice', label: 'practice' },
        { href: '/leaderboard', label: 'leaderboard' },
        { href: '/about', label: 'about' },
        { href: '/setting', label: '⚙️' },
    ];

    if (user && user.role === 'ADMIN') {
        navLinks.push({ href: '/admin/dashboard', label: 'admin' });
    }

    const linkClass = (href) =>
        `${spmono.className} font-bold transition-colors duration-300 text-base md:text-[20px]'}`;

    return (
        <>
            <nav className='w-full flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-4 md:py-6 lg:py-10 absolute top-0 left-0 z-50 backdrop-blur-sm shadow-xl transition-colors duration-300' style={{ backgroundColor: 'var(--background)', opacity: 0.8 }}>
                <a href='/' className={`${spmono.className} font-bold text-base md:text-[20px] shrink-0`} style={{ color: 'var(--foreground)' }}>morse<span style={{ color: 'var(--primary)' }}>code</span></a>

                {/* Desktop: horizontal links + profile */}
                <div className='hidden md:flex max-w-[520px] flex-1 justify-between items-center gap-2 mx-6'>
                    {navLinks.filter(l => l.href !== '/').map(({ href, label }) => (
                        <a key={href} href={href} className={linkClass(href)} style={{ color: pathname === href ? 'var(--primary)' : 'var(--foreground)', opacity: pathname === href ? 1 : 0.7 }}>{label}</a>
                    ))}
                    <a href='/profile' className={`${spmono.className} w-12 h-12 rounded-full flex items-center justify-center font-bold text-[14px] outline shrink-0 transition-colors duration-300`} style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', outlineColor: 'var(--primary)' }}>
                        <p className='mb-1'>{user?.username ? user.username.slice(0, 2).toUpperCase() : 'JP'}</p>
                    </a>
                </div>

                {/* Mobile: hamburger button */}
                <button
                    type="button"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={menuOpen}
                    className='md:hidden w-12 h-12 flex flex-col justify-center items-center gap-1.5 focus:outline-none focus:ring-2 rounded transition-colors duration-300'
                    style={{ color: 'var(--foreground)', '--tw-ring-color': 'var(--primary)' }}
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    {menuOpen ? (
                        <span className='text-2xl leading-none' aria-hidden>×</span>
                    ) : (
                        <>
                            <span className='w-6 h-0.5 rounded' style={{ backgroundColor: 'var(--foreground)' }} />
                            <span className='w-6 h-0.5 rounded' style={{ backgroundColor: 'var(--foreground)' }} />
                            <span className='w-6 h-0.5 rounded' style={{ backgroundColor: 'var(--foreground)' }} />
                        </>
                    )}
                </button>
            </nav>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className='md:hidden fixed top-[80px] left-0 w-full px-4 pb-4 z-40 shadow-2xl transition-colors duration-300' style={{ backgroundColor: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
                    <div className={`flex flex-col gap-1 ${spmono.className}`}>
                        {navLinks.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                className={`block py-3 px-2 font-bold text-[18px] transition-colors duration-300`}
                                style={{ color: pathname === href ? 'var(--primary)' : 'var(--foreground)', opacity: pathname === href ? 1 : 0.7 }}
                                onClick={() => setMenuOpen(false)}
                            >
                                {label}
                            </a>
                        ))}
                        <a
                            href='/profile'
                            className={`flex items-center gap-3 py-3 px-2 font-bold text-[18px] transition-colors duration-300 mt-2 pt-4`}
                            style={{ color: 'var(--foreground)', opacity: 0.7, borderTop: '1px solid var(--border)' }}
                            onClick={() => setMenuOpen(false)}
                        >
                            <span className='w-12 h-12 rounded-full flex items-center justify-center text-[14px] outline shrink-0 transition-colors duration-300' style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)', outlineColor: 'var(--primary)' }}>
                                <span className='mb-1'>{user?.username ? user.username.slice(0, 2).toUpperCase() : 'JP'}</span>
                            </span>
                            profile
                        </a>
                    </div>
                </div>
            )}

            {/* Decorative separator */}
            <div className='w-full px-4 sm:px-7 absolute top-[90px] md:top-[120px] left-0'>
                <div className='w-full h-px transition-colors duration-300' style={{ backgroundColor: 'var(--border)', opacity: 0.3 }}></div>
            </div>
        </>
    );
}