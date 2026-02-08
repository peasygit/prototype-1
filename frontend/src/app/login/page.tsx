'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'employer' | 'helper'>('employer');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    // Demo: redirect based on user type
    const redirectUrl = userType === 'employer' ? '/employers/dashboard' : '/helpers/dashboard';
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">Peasy</Link>
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-medium">
              <ChevronLeft className="w-4 h-4" />返回首頁
            </Link>
          </div>
        </div>
      </header>

      <main className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-black mb-3">登入</h1>
            <p className="text-gray-600">歡迎回來，請選擇您的身份</p>
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
              我是僱主
            </button>
            <button
              onClick={() => setUserType('helper')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-semibold transition-all ${
                userType === 'helper'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              我是幫手
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                {userType === 'employer' ? 'Email / 電郵地址' : '電話號碼 / Phone'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={userType === 'employer' ? 'email' : 'tel'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={userType === 'employer' ? 'your@email.com' : '+852 0000 0000'}
                  className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-xl focus:border-red-600 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-black">密碼</label>
                <Link href="#" className="text-sm text-red-600 hover:text-red-700">忘記密碼？</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="輸入密碼"
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
              className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-xl transition-all disabled:opacity-50 mt-6"
            >
              {isLoading ? '登入中...' : '登入'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              {userType === 'employer' ? '還未有帳戶？' : '還未註冊？'}
              {userType === 'employer' ? (
                <Link href="/employers/questionnaire" className="text-red-600 hover:text-red-700 font-medium ml-1">
                  填寫問卷開始
                </Link>
              ) : (
                <Link href="/helpers/register" className="text-red-600 hover:text-red-700 font-medium ml-1">
                  立即註冊
                </Link>
              )}
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              登入即表示您同意我們的 <Link href="#" className="underline">服務條款</Link> 和 <Link href="#" className="underline">私隱政策</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
