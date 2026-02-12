'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react';
import { api } from '@/utils/api';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'employer' | 'helper'>('employer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await api.post<{ user: any; token: string; requireEmailVerification?: boolean }>('/auth/login', {
        email,
        password,
      });

      // Handle verification required (from Login flow)
      if (data.requireEmailVerification) {
          setVerificationPending(true);
          // Still store token if available (DEV_TOKEN) to allow proceeding
          if (data.token) {
             localStorage.setItem('token', data.token);
             localStorage.setItem('user', JSON.stringify(data.user));
          } else {
             // If no token (shouldn't happen with our backend fix), we can't let them proceed
             // But we show the screen anyway. The button will just fail.
             // Ideally we should re-login behind scenes or ask backend to issue token.
             console.warn("No token received with verification requirement");
          }
          setIsLoading(false);
          return;
      }

      // Store token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Check if user role matches selected type (optional, but good UX)
      if (data.user.role !== userType) {
        // Warn or redirect to correct dashboard?
        // For now, just redirect based on actual role
      }

      const redirectUrl = data.user.role === 'employer' ? '/employers/dashboard' : '/helpers/dashboard';
      router.push(redirectUrl);
    } catch (err: any) {
      console.error(err);
      
      // Check for verification required error message even if status is error
      const errorMessage = err.message?.toLowerCase() || '';
      if (
          errorMessage.includes('email verification') || 
          errorMessage.includes('email not confirmed') ||
          errorMessage.includes('email not verified') ||
          errorMessage.includes('verification required')
      ) {
          // Can't proceed without token in this case usually, but show UI
          console.warn('Verification required detected in error:', errorMessage);
          setVerificationPending(true);
          setIsLoading(false);
          return;
      }
      
      setError(err.message || 'Login failed, please check your credentials');
      
      // Specific help for "Invalid credentials"
      if (err.message === 'Invalid credentials') {
         if (email.includes('example.com') || email.includes('peasy.com')) {
             setError('Invalid credentials. Note: Seed accounts (example.com) may not exist in the Auth system. Please register a new account.');
         } else {
             setError('Invalid email or password. Please double-check your credentials.');
         }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationComplete = async () => {
    // If user entered a code, try to verify with it
    if (verificationCode) {
        setIsLoading(true);
        try {
            const data = await api.post<{ user: any; token: string }>('/auth/verify', {
               email,
               token: verificationCode,
               role: userType // Pass selected role as fallback
            });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Check if user role matches selected type
            if (data.user.role !== userType) {
               // Adjust redirect if needed, or just warn
            }

            const redirectUrl = data.user.role === 'employer' ? '/employers/dashboard' : '/helpers/dashboard';
            router.push(redirectUrl);
        } catch (err: any) {
            console.error(err);
            alert(err.message || 'Verification failed, please check the code');
            setIsLoading(false);
        }
        return;
    }

    // User claims verification complete (link click), proceed to dashboard
    // IMPORTANT: We must ensure token is present, otherwise Dashboard will redirect back to login
    const token = localStorage.getItem('token');
    
    if (!token) {
       // This shouldn't happen if backend sent DEV_TOKEN, but if it does:
       setError('Cannot verify identity, please login again');
       setVerificationPending(false);
       return;
    }

     const redirectUrl = userType === 'employer' ? '/employers/dashboard' : '/helpers/dashboard';
     router.push(redirectUrl);
  };

  if (verificationPending) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">Peasy</Link>
            </div>
          </div>
        </header>
        
        <main className="py-24 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">✉️</div>
            </div>
            <h1 className="text-3xl font-semibold text-black mb-4">Verify Your Email</h1>
            <p className="text-gray-600 mb-6">
              Your account requires email verification to continue.<br/>
              We have sent a verification code to <strong>{email}</strong>.<br/>
              Please enter the code below or click the link in the email.
            </p>
            
            <div className="mb-6 max-w-xs mx-auto">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerificationComplete}
                disabled={isLoading}
                className="inline-flex items-center justify-center h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-all w-full sm:w-auto disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify & Continue'}
              </button>
              <div className="mt-4">
                 <button className="text-gray-500 text-sm hover:underline">Resend Email</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">Peasy</Link>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-medium">
              <ChevronLeft className="w-4 h-4" />Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-black mb-3">Login</h1>
            <p className="text-gray-600">Welcome back, please select your role</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              onClick={() => setUserType('employer')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
                userType === 'employer'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              I am an Employer
            </button>
            <button
              onClick={() => setUserType('helper')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
                userType === 'helper'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              I am a Helper
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-xl focus:border-red-600 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-black">Password</label>
                <Link href="/forgot-password" className="text-sm text-red-600 hover:text-red-700">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-14 pl-12 pr-12 bg-white border border-gray-200 rounded-xl focus:border-red-600 focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <div className="text-center">
              <span className="text-gray-600 text-sm">Don't have an account?</span>
              <Link 
                href={userType === 'employer' ? '/employers/questionnaire' : '/helpers/register'} 
                className="text-red-600 font-medium text-sm hover:underline ml-1"
              >
                Register Now
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
