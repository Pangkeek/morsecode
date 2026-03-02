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
    const { theme, updateTheme } = useTheme();
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
        `${spmono.className} font-bold transition-colors duration-300 hover:text-primary text-base md:text-[20px] ${pathname === href ? 'text-primary' : 'text-foreground/70'}`;

    const themes = [
        { id: 'dark', label: 'Dark' },
        { id: 'theme-light', label: 'Light' },
        { id: 'theme-cyberpunk', label: 'Cyberpunk' }
    ];

    const handleThemeCycle = () => {
        const currentIndex = themes.findIndex(t => t.id === theme) || 0;
        const nextIndex = (currentIndex + 1) % themes.length;
        updateTheme(themes[nextIndex].id);
    };

    const currentThemeLabel = themes.find(t => t.id === theme)?.label || 'Dark';

    return (
        <>
            <nav className='w-full flex justify-between items-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-4 md:py-6 lg:py-10 absolute top-0 left-0 z-50 bg-background/80 backdrop-blur-md shadow-xl border-b border-border/50 transition-colors duration-500'>
                <a href='/' className={`${spmono.className} font-bold text-foreground text-base md:text-[20px] shrink-0`}>
                    morse<span className='text-primary'>code</span>
                </a>

                {/* Desktop: horizontal links + profile + theme */}
                <div className='hidden md:flex flex-1 justify-end items-center gap-6 mx-6'>
                    {navLinks.filter(l => l.href !== '/').map(({ href, label }) => (
                        <a key={href} href={href} className={linkClass(href)}>{label}</a>
                    ))}

                    <button onClick={handleThemeCycle} className={`px-3 py-1 text-sm rounded-full border border-border text-foreground hover:bg-card/50 transition duration-300 font-mono ${theme === 'theme-cyberpunk' ? 'shadow-[var(--glow-pink)] border-primary hover:shadow-[var(--glow-cyan)]' : ''}`}>
                        {currentThemeLabel}
                    </button>

                    <a href='/profile' className={`${spmono.className} w-11 h-11 bg-card rounded-full flex items-center justify-center font-bold text-[14px] text-foreground border-2 border-primary hover:bg-primary/20 transition-colors duration-300 shrink-0`}>
                        <p className='mb-1'>{user?.username ? user.username.slice(0, 2).toUpperCase() : 'JP'}</p>
                    </a>
                </div>

                {/* Mobile: hamburger button */}
                <div className="flex md:hidden items-center gap-3">
                    <button onClick={handleThemeCycle} className={`px-2 py-1 text-[10px] rounded border border-border text-foreground font-mono`}>
                        {currentThemeLabel}
                    </button>
                    <button
                        type="button"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        className='w-10 h-10 flex flex-col justify-center items-center gap-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded'
                        onClick={() => setMenuOpen((o) => !o)}
                    >
                        {menuOpen ? (
                            <span className='text-2xl leading-none' aria-hidden>×</span>
                        ) : (
                            <>
                                <span className='w-6 h-0.5 bg-foreground rounded' />
                                <span className='w-6 h-0.5 bg-foreground rounded' />
                                <span className='w-6 h-0.5 bg-foreground rounded' />
                            </>
                        )}
                    </button>
                </div>
            </nav>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className='md:hidden fixed top-[80px] left-0 w-full px-4 pb-4 bg-background border-b border-border z-40 shadow-2xl transition-colors duration-500'>
                    <div className={`flex flex-col gap-1 ${spmono.className}`}>
                        {navLinks.map(({ href, label }) => (
                            <a
                                key={href}
                                href={href}
                                className={`block py-3 px-2 font-bold text-[18px] transition-colors duration-300 ${pathname === href ? 'text-primary' : 'text-foreground hover:text-primary'}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {label}
                            </a>
                        ))}
                        <a
                            href='/profile'
                            className={`flex items-center gap-3 py-3 px-2 font-bold text-[18px] text-foreground hover:text-primary transition-colors duration-300 border-t border-border mt-2 pt-4`}
                            onClick={() => setMenuOpen(false)}
                        >
                            <span className='w-11 h-11 bg-card rounded-full flex items-center justify-center text-[14px] text-foreground border-2 border-primary shrink-0'>
                                <span className='mb-1'>{user?.username ? user.username.slice(0, 2).toUpperCase() : 'JP'}</span>
                            </span>
                            profile
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
