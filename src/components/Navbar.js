'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const navItems = [
        { name: 'Home', href: '/' },
        { name: 'Resources', href: '/resources' },
        { name: 'Bookings', href: '/bookings' },
        { name: 'Profile', href: '/profile' },
    ];

    return (
        <nav className="bg-white shadow-md fixed w-full z-50">
            <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link href="/">
                    <span className="text-xl font-bold text-blue-600">eduSlot</span>
                </Link>

                {/* Hamburger Menu (Mobile) */}
                <button
                    className="lg:hidden text-gray-700 focus:outline-none"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {isMobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>

                {/* Navigation Links (Desktop) */}
                <ul className="hidden lg:flex space-x-6 text-gray-700">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <Link href={item.href}>
                <span className="hover:text-blue-600 transition-colors duration-200">
                  {item.name}
                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-white shadow-md">
                    <ul className="flex flex-col space-y-2 px-4 py-2 text-gray-700">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link href={item.href}>
                  <span
                      className="block py-2 hover:text-blue-600 transition-colors duration-200"
                      onClick={toggleMobileMenu}
                  >
                    {item.name}
                  </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </nav>
    );
}
