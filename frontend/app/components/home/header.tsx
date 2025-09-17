"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Home' },
        { href: '/account', label: 'My Account' },
        { href: '/pricing', label: 'Pricing' },
    ];

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
                <div className="flex w-full items-center justify-between py-4">
                    
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" onClick={closeMenu}>
                            <span className="text-2xl font-bold text-gray-800 tracking-tight">
                                Ideafinder
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <span className={`text-base font-medium transition-colors ${
                                    pathname === link.href 
                                        ? 'text-[#872524]' 
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}>
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                        <Link href="/pricing">
                            <span className="ml-4 inline-flex items-center justify-center px-5 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#872524] hover:bg-[#7a2121] transition-colors">
                                Get ideas
                            </span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger Icon */}
                            <svg className={`block h-6 w-6 ${isMenuOpen ? 'hidden' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                            {/* Close Icon */}
                            <svg className={`block h-6 w-6 ${isMenuOpen ? '' : 'hidden'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Panel */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                    <div className="space-y-1 pt-2 pb-4">
                        {links.map((link) => (
                             <Link key={link.href} href={link.href} onClick={closeMenu}>
                                <span className={`block rounded-md px-3 py-2 text-base font-medium transition-colors ${
                                    pathname === link.href 
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
                                }`}>
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                         <Link href="/pricing" onClick={closeMenu}>
                            <span className="block w-full mt-2 rounded-md bg-indigo-600 px-3 py-2 text-center text-base font-medium text-white shadow hover:bg-indigo-700">
                                Get ideas
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}
