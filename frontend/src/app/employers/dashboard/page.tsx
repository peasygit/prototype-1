'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, MapPin, Calendar, Briefcase, MessageCircle, User, Bell, ChevronRight, Heart, Filter, Search } from 'lucide-react';

const mockHelpers = [
  {
    id: '1',
    name: 'Maria Santos',
    age: 34,
    nationality: '菲律賓',
    experience: 5,
    rating: 4.8,
    reviews: 12,
    skills: ['嬰兒護理', '煮食', '家務'],
    languages: ['廣東話', '英文'],
    availability: '即時可到職',
    salary: '$5,200',
    location: '現居香港',
    bio: '經驗豐富的外傭，擅長照顧嬰幼兒，煮得一手好菜。',
    matchScore: 92,
  },
  {
    id: '2',
    name: 'Siti Rahayu',
    age: 29,
    nationality: '印尼',
    experience: 3,
    rating: 4.6,
    reviews: 8,
    skills: ['長者護理', '家務', '寵物照顧'],
    languages: ['廣東話', '印尼話'],
    availability: '2星期後',
    salary: '$5,000',
    location: '現居香港',
    bio: '細心有耐心，擅長照顧長者，有護理證書。',
    matchScore: 88,
  },
  {
    id: '3',
    name: 'Rosa Dela Cruz',
    age: 41,
    nationality: '菲律賓',
    experience: 8,
    rating: 4.9,
    reviews: 24,
    skills: ['煮食', '家務', '駕駛'],
    languages: ['英文', '菲律賓話'],
    availability: '1個月後',
    salary: '$6,000',
    location: '現居香港',
    bio: '多年經驗，擅長煮中西餐，有香港駕駛執照。',
    matchScore: 85,
  },
];

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<'matches' | 'saved' | 'messages'>('matches');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">Peasy</Link>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-black">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold">
                J
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">歡迎回來，Master Joe</h1>
          <p className="text-gray-600">根據您的需求，我們為您找到了 {mockHelpers.length} 位合適的幫手</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-red-600">{mockHelpers.length}</div>
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
          {mockHelpers.map((helper) => (
            <div key={helper.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition-colors">
              <div className="flex gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-2xl font-bold text-red-600">
                    {helper.name.charAt(0)}
                  </div>
                  <div className="mt-2 text-center">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {helper.matchScore}% 匹配
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-black">{helper.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />{helper.nationality}
                        </span>
                        <span>{helper.age} 歲</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />{helper.experience} 年經驗
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold text-black">{helper.rating}</span>
                      <span className="text-sm text-gray-500">({helper.reviews} 評價)</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{helper.bio}</p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {helper.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Languages & Availability */}
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <span>語言: {helper.languages.join(', ')}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />{helper.availability}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-lg font-semibold text-black">
                      {helper.salary}<span className="text-sm font-normal text-gray-500">/月</span>
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
          ))}
        </div>
      </div>
    </div>
  );
}
