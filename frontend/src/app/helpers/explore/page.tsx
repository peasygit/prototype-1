'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Search, Filter, MapPin, Briefcase, Star, Clock } from 'lucide-react';
import { api } from '@/utils/api';

interface Helper {
  id: string;
  fullName: string;
  displayName?: string;
  nationality: string;
  yearsExperienceTotal: number;
  profilePhotoUrl?: string;
  skills: { skillType: string }[];
  careExperience: { targetType: string; yearsExperience: number }[];
}

export default function ExploreHelpers() {
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    nationality: '',
    minExperience: '',
    maxExperience: '',
    skills: [] as string[]
  });

  const fetchHelpers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.nationality) queryParams.append('nationality', filters.nationality);
      if (filters.minExperience) queryParams.append('minExperience', filters.minExperience);
      if (filters.maxExperience) queryParams.append('maxExperience', filters.maxExperience);
      if (filters.skills.length > 0) queryParams.append('skills', filters.skills.join(','));

      const data = await api.get<any>(`/helpers?${queryParams.toString()}`);
      setHelpers(data.data || []);
    } catch (error) {
      console.error('Error fetching helpers:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHelpers();
  }, [fetchHelpers]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill: string) => {
    setFilters(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Smart Match Banner */}
      <div className="bg-gradient-to-r from-red-50 to-white border-b border-red-100 py-12">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-[#DB0011] text-sm font-bold mb-4">
              <Star className="w-4 h-4 fill-current" />
              Recommended Way
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stop searching, start matching
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Browsing profiles can be overwhelming. Let our AI analyze 50+ compatibility factors to find your perfect helper in minutes.
            </p>
          </div>
          <Link 
            href="/employers/questionnaire"
            className="flex-shrink-0 inline-flex items-center justify-center h-14 px-8 bg-[#DB0011] text-white rounded-full text-lg font-bold hover:bg-[#B2000E] transition-all hover:-translate-y-px shadow-lg shadow-red-600/20"
          >
            Start 3-min Questionnaire
          </Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                <Filter className="w-5 h-5" />
                <h2>Filters</h2>
              </div>
              
              {/* Nationality */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <select 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#DB0011] focus:border-[#DB0011]"
                  value={filters.nationality}
                  onChange={(e) => handleFilterChange('nationality', e.target.value)}
                >
                  <option value="">All Nationalities</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Myanmar">Myanmar</option>
                </select>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#DB0011] focus:border-[#DB0011]"
                    value={filters.minExperience}
                    onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                  />
                  <span className="text-gray-400 self-center">-</span>
                  <input 
                    type="number" 
                    placeholder="Max"
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#DB0011] focus:border-[#DB0011]"
                    value={filters.maxExperience}
                    onChange={(e) => handleFilterChange('maxExperience', e.target.value)}
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="space-y-2">
                  {['Child Care', 'Elderly Care', 'Cooking', 'Pet Care', 'Housekeeping', 'Driving'].map((skill) => (
                    <label key={skill} className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={filters.skills.includes(skill)}
                        onChange={() => toggleSkill(skill)}
                        className="rounded border-gray-300 text-[#DB0011] focus:ring-[#DB0011]"
                      />
                      <span className="text-sm text-gray-600">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : helpers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {helpers.map((helper) => (
                  <Link href={`/helpers/${helper.id}`} key={helper.id} className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-[4/3] bg-gray-100 relative">
                      {helper.profilePhotoUrl ? (
                        <img 
                          src={helper.profilePhotoUrl} 
                          alt={helper.displayName || helper.fullName} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <span className="text-4xl">👤</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {helper.nationality}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#DB0011] transition-colors mb-1">
                        {helper.displayName || helper.fullName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{helper.yearsExperienceTotal}y exp</span>
                        </div>
                        {/* Add age or other info if available */}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {helper.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                            {skill.skillType}
                          </span>
                        ))}
                        {helper.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-md font-medium">
                            +{helper.skills.length - 3}
                          </span>
                        )}
                      </div>

                      <button className="w-full py-2 px-4 bg-white border border-[#DB0011] text-[#DB0011] font-semibold rounded-lg hover:bg-[#DB0011] hover:text-white transition-colors">
                        View Profile
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No helpers found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                <button 
                  onClick={() => setFilters({ nationality: '', minExperience: '', maxExperience: '', skills: [] })}
                  className="mt-4 text-[#DB0011] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
