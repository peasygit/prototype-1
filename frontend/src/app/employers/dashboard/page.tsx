'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, Calendar, Briefcase, MessageCircle, User, Bell, ChevronRight, Heart, Filter, Search, Loader2 } from 'lucide-react';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'matches' | 'saved' | 'messages'>('matches');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [employerName, setEmployerName] = useState('User');
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    // Define async function
    const fetchData = async () => {
      try {
        setLoading(true);
        // Check for token first
        const token = localStorage.getItem('token');
        if (!token) {
           // Redirect will be handled by protected route check usually, 
           // but let's be safe and redirect here too
           router.push('/login');
           return;
        }

        // 1. Get profile for name
        const profile = await api.get<any>('/employers/profile');
        setEmployerName(profile.name || 'User');

        // 2. Get matches
        const matchesData = await api.get<any>('/matches');
        setMatches(matchesData.data || []);
      } catch (err: any) {
        console.error('Fetch dashboard data error:', err);
        if (err.message === 'No token provided' || err.status === 401) {
             router.push('/login');
             return;
        }
        setError('無法載入資料');
      } finally {
        setLoading(false);
      }
    };

    // Call it
    fetchData();
  }, [router]); // Dependencies are stable

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">Peasy</Link>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-black"
              >
                登出
              </button>
              <button className="relative p-2 text-gray-600 hover:text-black">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold">
                {employerName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">歡迎回來，{employerName}</h1>
          <p className="text-gray-600">根據您的需求，我們為您找到了 {matches.length} 位合適的幫手</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-red-600">{matches.length}</div>
            <div className="text-sm text-gray-600 mt-1">推薦配對</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-black">0</div>
            <div className="text-sm text-gray-600 mt-1">已儲存</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-black">0</div>
            <div className="text-sm text-gray-600 mt-1">待聯繫</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">篩選</span>
            </div>
            <input
              type="text"
              placeholder="搜尋名字、技能..."
              className="flex-1 min-w-[200px] h-10 px-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-full">全部</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200">即時可到職</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200">經驗5年+</button>
            </div>
          </div>
        </div>

        {/* Helper List */}
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">暫時沒有配對結果，請稍後再查看。</p>
            </div>
          ) : (
            matches.map((match) => {
              const helper = match.helper;
              return (
                <div key={match.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition-colors">
                  <div className="flex gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {helper.profilePhotoUrl ? (
                         <img src={helper.profilePhotoUrl} alt={helper.fullName} className="w-24 h-24 rounded-2xl object-cover" />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-2xl font-bold text-red-600">
                          {helper.fullName?.charAt(0) || 'H'}
                        </div>
                      )}
                      <div className="mt-2 text-center">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          {match.matchScore}% 匹配
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-black">{helper.fullName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />{helper.nationality}
                            </span>
                            {/* <span>{helper.age} 歲</span> */}
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />{helper.yearsExperienceTotal} 年經驗
                            </span>
                          </div>
                        </div>
                        {/* Rating placeholder */}
                        {/* <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-semibold text-black">4.8</span>
                          <span className="text-sm text-gray-500">(12 評價)</span>
                        </div> */}
                      </div>

                      <p className="text-gray-700 mb-4">{helper.aboutMe || '暫無自我介紹'}</p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(helper.skills || []).map((skill: any) => (
                          <span key={skill.id} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {skill.skillType}
                          </span>
                        ))}
                        {(helper.languages || []).map((lang: string) => (
                           <span key={lang} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                             {lang}
                           </span>
                        ))}
                      </div>

                      {/* Availability */}
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        {helper.availableFrom && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />{new Date(helper.availableFrom).toLocaleDateString()} 可到職
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-lg font-semibold text-black">
                          {helper.expectedSalaryMin ? `$${helper.expectedSalaryMin}` : '面議'}<span className="text-sm font-normal text-gray-500">/月</span>
                        </div>
                        <div className="flex gap-3">
                          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full hover:border-red-600 hover:text-red-600 transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                          <Link
                            href={`/helpers/${helper.id}`}
                            className="inline-flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-full text-sm font-medium hover:border-black transition-colors"
                          >
                            查看檔案
                          </Link>
                          <button className="inline-flex items-center gap-2 h-10 px-6 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
                            <MessageCircle className="w-4 h-4" />聯繫
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
