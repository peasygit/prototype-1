'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EDEEF2]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">
            Peasy
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#helpers" className="text-[#6E727D] hover:text-black font-medium transition-colors">
              Find Helpers
            </Link>
            <Link href="#helper-info" className="text-[#6E727D] hover:text-black font-medium transition-colors">
              For Helpers
            </Link>
            <Link href="#process" className="text-[#6E727D] hover:text-black font-medium transition-colors">
              Process
            </Link>
            <Link href="/login" className="text-[#DB0011] font-medium hover:text-[#B2000E] transition-colors">
              Log In
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#6E727D] hover:text-black"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-[#EDEEF2]">
            <nav className="flex flex-col gap-4">
              <Link href="#helpers" className="text-[#6E727D] hover:text-black font-medium py-2">
                Find Helpers
              </Link>
              <Link href="#helper-info" className="text-[#6E727D] hover:text-black font-medium py-2">
                For Helpers
              </Link>
              <Link href="#process" className="text-[#6E727D] hover:text-black font-medium py-2">
                Process
              </Link>
              <Link href="/login" className="text-[#DB0011] font-medium py-2">
                Log In
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}