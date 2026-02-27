'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Briefcase, MessageCircle, Heart, Filter, Loader2 } from 'lucide-react';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import EmployerProfileSection from '@/components/EmployerProfileSection';
import EmployerRequirementsSection from '@/components/EmployerRequirementsSection';

export default function EmployerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [employerName, setEmployerName] = useState('User');

  const fetchData = useCallback(async () => {
    try {
      // Check for token first
      const token = localStorage.getItem('token');
      if (!token) {
         router.push('/login');
         return;
      }

      // 1. Get profile for name
      const profileData = await api.get<any>('/employers/profile');
      setProfile(profileData);
      
      let displayName = 'User';
      if (profileData.name) {
        displayName = profileData.name;
      } else if (profileData.user && profileData.user.email) {
        // Fallback to email username if name is missing
        displayName = profileData.user.email.split('@')[0];
      }
      
      setEmployerName(displayName);

      // 2. Get matches
      const matchesData = await api.get<any>('/matches');
      setMatches(matchesData.data || []);
    } catch (err: any) {
      console.error('Fetch dashboard data error:', err);
      if (err.message === 'No token provided' || err.status === 401) {
           router.push('/login');
           return;
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">Welcome back, {employerName}</h1>
          <p className="text-gray-600">Here is your dashboard overview.</p>
        </div>

        {/* Profile & Requirements Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EmployerProfileSection profile={profile} onUpdate={fetchData} />
          <EmployerRequirementsSection profile={profile} onUpdate={fetchData} />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Recommended Matches</h2>
          <p className="text-gray-600">We found {matches.length} suitable helpers based on your needs</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-red-600">{matches.length}</div>
            <div className="text-sm text-gray-600 mt-1">Recommended</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-black">0</div>
            <div className="text-sm text-gray-600 mt-1">Saved</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-black">0</div>
            <div className="text-sm text-gray-600 mt-1">To Contact</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Filter</span>
            </div>
            <input
              type="text"
              placeholder="Search name, skills..."
              className="flex-1 min-w-[200px] h-10 px-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-full">All</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200">Immediate Available</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-200">Exp 5y+</button>
            </div>
          </div>
        </div>

        {/* Helper List */}
        <div className="space-y-4">
          {matches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">No matches found yet, please check back later.</p>
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
                          {match.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-black">{helper.fullName}</h3>
                          {match.job && (
                            <div className="text-sm text-red-600 font-medium mb-1">
                              Matched Job: {match.job.title}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />{helper.nationality}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />{helper.yearsExperienceTotal} years exp
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4">{helper.aboutMe || 'No self-introduction'}</p>

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
                            <Calendar className="w-4 h-4" />{new Date(helper.availableFrom).toLocaleDateString()} Available
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="text-lg font-semibold text-black">
                          {helper.expectedSalaryMin ? `$${helper.expectedSalaryMin}` : 'Negotiable'}<span className="text-sm font-normal text-gray-500">/mo</span>
                        </div>
                        <div className="flex gap-3">
                          <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-full hover:border-red-600 hover:text-red-600 transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                          <Link
                            href={`/helpers/${helper.id}`}
                            className="inline-flex items-center gap-2 h-10 px-4 border border-gray-200 rounded-full text-sm font-medium hover:border-black transition-colors"
                          >
                            View Profile
                          </Link>
                          <button className="inline-flex items-center gap-2 h-10 px-6 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors">
                            <MessageCircle className="w-4 h-4" />Contact
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
