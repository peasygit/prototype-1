'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, DollarSign, Star, Briefcase, MessageCircle, Bell, User, ChevronRight, TrendingUp } from 'lucide-react';

const mockJobs = [
  {
    id: '1',
    title: '住家保母 - 照顧 2 歲幼兒',
    location: '西貢',
    household: '3人家庭',
    salary: '$5,200',
    startDate: '即時',
    requirements: ['嬰兒護理', '煮食', '家務'],
    employerName: '陳家',
    rating: 4.9,
    matchScore: 95,
  },
  {
    id: '2',
    title: '長者護理員',
    location: '大埔',
    household: '2位長者',
    salary: '$5,500',
    startDate: '1星期後',
    requirements: ['長者護理', '基本護理知識', '煮食'],
    employerName: '李家',
    rating: 4.7,
    matchScore: 88,
  },
  {
    id: '3',
    title: '家務助理（非住家）',
    location: '灣仔',
    household: '4人家庭',
    salary: '$50/小時',
    startDate: '2星期後',
    requirements: ['家務清潔', '煮食'],
    employerName: '王家',
    rating: 4.8,
    matchScore: 82,
  },
];

export default function HelperDashboard() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'messages'>('jobs');

  const stats = [
    { label: '推薦工作', value: 8, change: '+2' },
    { label: '已申請', value: 3, change: '' },
    { label: '面試邀請', value: 1, change: 'NEW' },
    { label: '檔案瀏覽', value: 24, change: '+5' },
  ];

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
                M
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">歡迎回來，Maria</h1>
          <p className="text-gray-600">今天為您找到 {mockJobs.length} 個合適的工作機會</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-bold text-black">{stat.value}</span>
                {stat.change && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    stat.change === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 mb-8 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">您的檔案完整度</h2>
              <p className="text-red-100 text-sm">完整的檔案可提高 3 倍配對機會</p>
            </div>
            <div className="text-3xl font-bold">75%</div>
          </div>
          <div className="h-2 bg-red-800/50 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-white rounded-full" style={{ width: '75%' }} />
          </div>
          <button className="text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors">
            完善檔案 →
          </button>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-black mb-4">推薦工作</h2>
          {mockJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition-colors">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Job Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />{job.location}
                        </span>
                        <span>{job.household}</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          {job.employerName} ({job.rating})
                        </span>
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {job.matchScore}% 匹配
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.map((req) => (
                      <span key={req} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {req}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-lg font-bold text-red-600">{job.salary}<span className="text-sm font-normal text-gray-500">/月</span></span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />{job.startDate}開始
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex md:flex-col gap-3 md:justify-center">
                  <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 h-10 px-6 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
                    立即申請
                  </button>
                  <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 h-10 px-6 border border-gray-200 rounded-full text-sm font-medium hover:border-black transition-colors">
                    查看詳情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700">
            查看更多工作 <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
