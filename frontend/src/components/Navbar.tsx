'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, LayoutDashboard } from 'lucide-react';
import NotificationsPopover from '@/components/NotificationsPopover';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dashboardLink = user?.role === 'employer' ? '/employers/dashboard' : '/helpers/dashboard';

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
            {user?.role === 'helper' ? (
              <>
                <Link href="/helpers/dashboard" className="text-[#6E727D] hover:text-black font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/helpers/explore" className="text-[#6E727D] hover:text-black font-medium transition-colors">
                  Find Jobs
                </Link>
                <Link href="/academy" className="text-[#6E727D] hover:text-black font-medium transition-colors">
                  Academy
                </Link>
              </>
            ) : (
              <>
                <Link href="/helpers/explore" className="text-[#6E727D] hover:text-black font-medium transition-colors">
                  Find Helpers
                </Link>
                <Link href="/for-helpers" className="text-[#6E727D] hover:text-black font-medium transition-colors">
                  For Helpers
                </Link>
                <Link href="/process" className="text-[#6E727D] hover:text-black font-medium transition-colors">
                  How it works
                </Link>
              </>
            )}
            
            {isLoading ? (
              // Loading skeleton
              <div className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user?.role === 'employer' && <NotificationsPopover />}
                
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-700 hover:text-black font-medium focus:outline-none"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="hidden lg:block max-w-[100px] truncate">{user?.email?.split('@')[0]}</span>
                    <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      
                      <Link 
                        href={dashboardLink}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/login" className="text-[#DB0011] font-medium hover:text-[#B2000E] transition-colors">
                Log In
              </Link>
            )}
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
              {user?.role === 'helper' ? (
                <>
                  <Link href="/helpers/dashboard" className="text-[#6E727D] hover:text-black font-medium py-2">
                    Dashboard
                  </Link>
                  <Link href="/helpers/explore" className="text-[#6E727D] hover:text-black font-medium py-2">
                    Find Jobs
                  </Link>
                  <Link href="/academy" className="text-[#6E727D] hover:text-black font-medium py-2">
                    Academy
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/helpers/explore" className="text-[#6E727D] hover:text-black font-medium py-2">
                    Find Helpers
                  </Link>
                  <Link href="/for-helpers" className="text-[#6E727D] hover:text-black font-medium py-2">
                    For Helpers
                  </Link>
                  <Link href="/process" className="text-[#6E727D] hover:text-black font-medium py-2">
                    How it works
                  </Link>
                </>
              )}
              
              {isLoading ? (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-4 px-2 animate-pulse">
                    <div className="w-10 h-10 bg-gray-100 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded w-24 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-16" />
                    </div>
                  </div>
                </div>
              ) : isAuthenticated ? (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Link 
                    href={dashboardLink} 
                    className="flex items-center gap-2 text-gray-700 hover:text-black font-medium py-2 px-2 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-red-600 font-medium py-2 px-2 hover:bg-red-50 rounded-lg text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/login" className="text-[#DB0011] font-medium py-2">
                  Log In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}