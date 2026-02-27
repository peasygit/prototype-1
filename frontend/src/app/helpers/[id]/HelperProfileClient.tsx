'use client';

import { useState, useEffect } from 'react';
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
  Shield,
  Loader2
} from 'lucide-react';
import { api } from '@/utils/api';

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
  profilePhotoUrl?: string;
}

interface HelperProfileClientProps {
  id: string;
}

export default function HelperProfileClient({ id }: HelperProfileClientProps) {
  const [helper, setHelper] = useState<Helper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchHelper = async () => {
      try {
        setLoading(true);
        const data = await api.get<any>(`/helpers/${id}`);
        
        // Transform backend data to frontend Helper interface
        const transformedHelper: Helper = {
          id: data.id,
          name: data.fullName || data.displayName || 'Helper',
          age: data.birthdate ? new Date().getFullYear() - new Date(data.birthdate).getFullYear() : 30,
          nationality: data.nationality || 'Unknown',
          experience: data.yearsExperienceTotal || 0,
          rating: 4.8, // Mock
          reviews: 12, // Mock
          bio: data.aboutMe || 'No bio provided.',
          skills: data.skills?.map((s: any) => s.skillType) || [],
          languages: Array.isArray(data.languages) ? data.languages.map((l: string) => ({
             name: l, level: 'Native', percentage: 100 
          })) : [{ name: 'English', level: 'Basic', percentage: 50 }], 
          certifications: [], // Mock
          workHistory: data.careExperience?.map((exp: any, idx: number) => ({
             id: idx,
             role: exp.targetType,
             period: 'N/A',
             duration: exp.yearsExperience + ' years',
             familyName: 'Employer',
             location: 'Hong Kong',
             duties: [],
             rating: 5
          })) || [],
          availability: data.availableFrom ? new Date(data.availableFrom).toLocaleDateString() : 'Available',
          expectedSalary: data.expectedSalaryMin ? `$${data.expectedSalaryMin} - $${data.expectedSalaryMax}` : 'Negotiable',
          currentLocation: data.currentLocation || 'Hong Kong',
          religion: data.religion || 'N/A',
          maritalStatus: 'Single', // Missing in backend
          cookingPreference: 'N/A', // Missing
          petFriendly: true, // Missing
          wuxing: data.wuxingElement || 'Fire',
          zodiac: data.westernZodiac || 'Aries',
          zodiacEmoji: '♈', // Simplified
          matchScore: 90, // Mock
          verified: true,
          profilePhotoUrl: data.profilePhotoUrl
        };
        
        setHelper(transformedHelper);
      } catch (err) {
        console.error(err);
        setError('Failed to load helper profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchHelper();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error || !helper) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load data</h2>
          <p className="text-gray-600 mb-4">{error || 'Helper not found'}</p>
          <Link href="/employers/dashboard" className="text-red-600 hover:text-red-700 font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Scroll padding for sticky header */}
      <style>{`html { scroll-padding-top: 80px; }`}</style>
      
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">Peasy</Link>
            <Link href="/employers/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-medium">
              <ArrowLeft className="w-4 h-4" />Back to Matches
            </Link>
          </div>
        </div>
      </header>

      {/* Space for fixed header */}
      <div className="h-16" />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-32 h-32 shrink-0 bg-gray-100 rounded-2xl flex items-center justify-center text-4xl font-bold text-gray-400 overflow-hidden">
                  {helper.profilePhotoUrl ? (
                    <img 
                      src={helper.profilePhotoUrl} 
                      alt={helper.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    helper.name.charAt(0)
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-black">{helper.name}</h1>
                        {helper.verified && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-100">
                            <Check className="w-4 h-4" />Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 mb-0 font-medium">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-gray-400" />{helper.nationality}
                        </span>
                        <span>{helper.age} years old</span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4 text-gray-400" />{helper.experience} years exp
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Home className="w-4 h-4 text-gray-400" />{helper.currentLocation}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200">
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => setIsSaved(!isSaved)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border ${
                          isSaved ? 'bg-red-50 border-red-200' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${isSaved ? 'text-[#DB0011] fill-current' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-8">
              <div className="space-y-6">

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(helper.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <span className="font-bold text-black">{helper.rating}</span>
                    <span className="text-gray-400 font-medium">({helper.reviews} reviews)</span>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-[#F0FDF4] to-[#F7FEE7] rounded-2xl border border-green-100/50 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {helper.matchScore}%
                      </div>
                      <div>
                        <div className="font-semibold text-green-800">Highly Matched</div>
                        <div className="text-sm text-green-600">Calculated based on your needs</div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-green-700">
                      <div>Wuxing: {helper.wuxing}</div>
                      <div>Zodiac: {helper.zodiac} {helper.zodiacEmoji}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-black mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{helper.bio}</p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-black mb-6">Work Experience</h2>
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
                        <p className="text-gray-700 text-sm">"{exp.review}"</p>
                      </div>
                    )}
                  </div>
                ))}
                {helper.workHistory.length === 0 && (
                  <p className="text-gray-500">No work experience records</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-semibold text-black mb-6">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {helper.skills.map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              
              <h3 className="text-lg font-semibold text-black mb-4">Languages</h3>
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
              <h2 className="text-xl font-semibold text-black mb-6">Certifications</h2>
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
                {helper.certifications.length === 0 && (
                  <p className="text-gray-500">No certification records</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-grey-900 mb-1">{helper.expectedSalary}</div>
                <div className="text-gray-500 text-sm">Expected Salary</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">Available: {helper.availability}</span>
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
                    <span className="text-gray-700">Pet Friendly</span>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowContactModal(true)}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
              >
                <MessageCircle className="w-5 h-5" />
                Contact {helper.name}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Clicking contact implies agreement to pay for unlocking contact info
              </p>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Background Verified · Authentic Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-semibold text-black mb-4">Unlock Contact Information</h3>
            <p className="text-gray-600 mb-6">
              Subscribe to view full contact details for {helper.name}.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="p-4 border-2 border-red-600 rounded-xl bg-red-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-black">7-Day Trial</span>
                  <span className="text-xl font-bold text-red-600">HK$199</span>
                </div>
                <p className="text-sm text-gray-600">View up to 3 helpers' contact info</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-black">30-Day Plan</span>
                  <span className="text-xl font-bold text-grey-900">HK$599</span>
                </div>
                <p className="text-sm text-gray-600">Unlimited contact info access</p>
              </div>
            </div>

            <button className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors mb-3">
              Subscribe Now
            </button>
            <button 
              onClick={() => setShowContactModal(false)}
              className="w-full h-14 border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-400 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
