'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Briefcase, 
  Heart, 
  Share2, 
  MessageCircle,
  Check,
  Award,
  Clock,
  Home,
  Baby,
  Utensils,
  Sparkles,
  Shield
} from 'lucide-react';

interface Helper {
  id: string;
  name: string;
  age: number;
  nationality: string;
  experience: number;
  rating: number;
  reviews: number;
  bio: string;
  skills: string[];
  languages: { name: string; level: string; percentage: number }[];
  certifications: { name: string; issuer: string; year: string }[];
  workHistory: any[];
  availability: string;
  expectedSalary: string;
  currentLocation: string;
  religion: string;
  maritalStatus: string;
  cookingPreference: string;
  petFriendly: boolean;
  wuxing: string;
  zodiac: string;
  zodiacEmoji: string;
  matchScore: number;
  verified: boolean;
}

interface HelperProfileClientProps {
  helper: Helper;
}

export default function HelperProfileClient({ helper }: HelperProfileClientProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scroll padding for sticky header */}
      <style>{`html { scroll-padding-top: 80px; }`}</style>
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">Peasy</Link>
            <Link href="/employers/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-medium">
              <ArrowLeft className="w-4 h-4" />返回配對結果
            </Link>
          </div>
        </div>
      </header>

      {/* Space for fixed header */}
      <div className="h-16" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              <div className="h-48 bg-gradient-to-r from-red-500 via-red-400 to-orange-400 relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button 
                    onClick={() => setIsSaved(!isSaved)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isSaved ? 'bg-red-100' : 'bg-white/90 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'text-red-600 fill-current' : 'text-gray-700'}`} />
                  </button>
                </div>
              </div>
              
              <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6 -mt-20">
                  <div className="w-40 h-40 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center text-5xl font-bold text-red-600 border-4 border-white shadow-lg">
                    {helper.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 pt-4">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-black">{helper.name}</h1>
                      {helper.verified && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                          <Check className="w-4 h-4" />已認證
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />{helper.nationality}
                      </span>
                      <span>{helper.age} 歲</span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />{helper.experience} 年經驗
                      </span>
                      <span className="flex items-center gap-1">
                        <Home className="w-4 h-4" />{helper.currentLocation}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.floor(helper.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-black">{helper.rating}</span>
                      <span className="text-gray-500">({helper.reviews} 評價)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {helper.matchScore}%
                      </div>
                      <div>
                        <div className="font-semibold text-green-800">高度匹配</div>
                        <div className="text-sm text-green-600">根據您的需求計算</div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-green-700">
                      <div>五行: {helper.wuxing}</div>
                      <div>星座: {helper.zodiac} {helper.zodiacEmoji}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-black mb-4">關於我</h2>
              <p className="text-gray-700 leading-relaxed">{helper.bio}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-black mb-6">工作經驗</h2>
              <div className="space-y-6">
                {helper.workHistory.map((exp: any, index: number) => (
                  <div key={exp.id} className="relative pl-8 pb-8 border-l-2 border-gray-100 last:pb-0 last:border-0">
                    <div className="absolute left-0 top-0 w-4 h-4 bg-red-600 rounded-full -translate-x-[9px]" />
                    <div className="mb-1">
                      <span className="text-sm text-gray-500">{exp.period}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-black">{exp.role}</h3>
                    <div className="text-gray-600 mb-2">
                      {exp.familyName} · {exp.location} · {exp.duration}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exp.children && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md">
                          <Baby className="w-3 h-3 inline mr-1" />{exp.children}
                        </span>
                      )}
                      {exp.duties.map((duty: string) => (
                        <span key={duty} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                          {duty}
                        </span>
                      ))}
                    </div>
                    {exp.review && (
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium text-sm">{exp.rating}.0</span>
                        </div>
                        <p className="text-gray-700 text-sm">「{exp.review}」</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-black mb-6">技能與專長</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {helper.skills.map((skill: string) => (
                  <span key={skill} className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold text-black mb-4">語言能力</h3>
              <div className="space-y-4">
                {helper.languages.map((lang: any) => (
                  <div key={lang.name}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-gray-700">{lang.name}</span>
                      <span className="text-sm text-gray-500">{lang.level}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-600 rounded-full transition-all"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-black mb-6">證書與資格</h2>
              <div className="space-y-4">
                {helper.certifications.map((cert: any, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-black">{cert.name}</div>
                      <div className="text-sm text-gray-600">{cert.issuer} · {cert.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-grey-900 mb-1">{helper.expectedSalary}</div>
                <div className="text-gray-500 text-sm">期望月薪</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">可到職: {helper.availability}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Home className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{helper.maritalStatus} · {helper.religion}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Utensils className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{helper.cookingPreference}</span>
                </div>
                {helper.petFriendly && (
                  <div className="flex items-center gap-3 text-sm">
                    <Sparkles className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">接受寵物</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowContactModal(true)}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
              >
                <MessageCircle className="w-5 h-5" />
                聯繫 {helper.name}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                點擊聯繫即表示您同意付費解鎖聯繫資訊
              </p>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>背景已認證 · 資料真實</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-semibold text-black mb-4">解鎖聯繫資訊</h3>
            <p className="text-gray-600 mb-6">
              查看 {helper.name} 的完整聯繫方式需要訂閱我們的服務計劃。
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="p-4 border-2 border-red-600 rounded-xl bg-red-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-black">7天體驗</span>
                  <span className="text-xl font-bold text-red-600">HK$199</span>
                </div>
                <p className="text-sm text-gray-600">查看最多3位幫手聯繫資訊</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-black">30天方案</span>
                  <span className="text-xl font-bold text-grey-900">HK$599</span>
                </div>
                <p className="text-sm text-gray-600">無限制查看聯繫資訊</p>
              </div>
            </div>

            <button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors mb-3">
              立即訂閱
            </button>
            <button 
              onClick={() => setShowContactModal(false)}
              className="w-full h-14 border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition-colors"
            >
              稍後再說
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
