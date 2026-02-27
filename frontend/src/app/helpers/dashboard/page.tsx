'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Loader2,
  Settings, 
  User, 
  LogOut,
  Clock,
  Briefcase
} from 'lucide-react';
import { api } from '@/utils/api';

interface Job {
  id: string;
  title: string | null;
  employer: {
    name: string | null;
    location: string | null;
    householdSize: number | null;
    children?: any;
    hasElderly?: boolean;
  };
  salaryRange: string | null;
  preferredStartDate: string | null;
  duties: string[] | null;
  matchScore?: number;
}

interface HelperStats {
  totalApplications: number;
  shortlistedCount: number;
  interviewCount: number;
  hiredCount: number;
}

export default function HelperDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [helperName, setHelperName] = useState<string>('Helper');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<HelperStats>({
    totalApplications: 0,
    shortlistedCount: 0,
    interviewCount: 0,
    hiredCount: 0,
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Get profile
        const profile = await api.get<any>('/helpers/profile');
        setHelperName(profile.fullName || profile.displayName || 'Helper');
        setProfilePhotoUrl(profile.profilePhotoUrl || null);
        
        // 2. Get stats
        const statsData = await api.get<HelperStats>('/helpers/stats');
        setStats(statsData);

        // 3. Get jobs
        const jobsResponse = await api.get<{ data: any[] }>('/helpers/explore?limit=3');
        
        // Transform backend job data to frontend format
        const transformedJobs = jobsResponse.data.map((job: any) => ({
          id: job.id,
          title: job.title || 'Domestic Helper',
          employer: {
            name: job.employer?.name || 'Employer',
            location: job.employer?.location || 'Hong Kong',
            householdSize: job.employer?.householdSize || 0,
            children: job.employer?.children,
            hasElderly: job.employer?.hasElderly,
          },
          salaryRange: job.salaryRange || 'Negotiable',
          preferredStartDate: job.preferredStartDate,
          duties: Array.isArray(job.duties) ? job.duties : (job.duties ? [job.duties] : []),
          matchScore: Math.floor(Math.random() * (99 - 85) + 85), // High match scores for top matches
        }));
        
        setJobs(transformedJobs);

      } catch (err: any) {
        console.error('Fetch dashboard data error:', err);
        if (err.response?.status === 401) {
             router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleApply = async (jobId: string) => {
    try {
      setApplying(jobId);
      await api.post(`/helpers/apply/${jobId}`, {});
      setJobs(prev => prev.filter(j => j.id !== jobId));
      setStats(prev => ({ ...prev, totalApplications: prev.totalApplications + 1 }));
      alert('Application successful!');
    } catch (err) {
      console.error('Apply error:', err);
      alert('Application failed, please try again later');
    } finally {
      setApplying(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          
          {/* Main Content */}
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                  {profilePhotoUrl ? (
                    <img 
                      src={profilePhotoUrl} 
                      alt={helperName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-400">
                      {helperName.charAt(0)}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Good morning, {helperName} 👋</h1>
              </div>
              <div className="flex gap-3">
                <Link href="/helpers/profile/edit" className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                  Edit Profile
                </Link>
                <Link href="/helpers/explore" className="inline-flex items-center justify-center px-5 py-2.5 bg-[#DB0011] text-white rounded-full text-sm font-bold hover:bg-[#B2000E] transition-all shadow-sm hover:shadow">
                  Find New Jobs
                </Link>
              </div>
            </div>

            {/* Top Job Matches */}
            <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Top Job Matches ({jobs.length})</h3>
                <Link href="/helpers/explore" className="text-[#DB0011] text-sm font-bold hover:text-[#B2000E]">
                  View all matches
                </Link>
              </div>
              
              <div className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <div key={job.id} className="py-6 first:pt-0 last:pb-0 grid md:grid-cols-[64px_1fr_auto] gap-6 items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl border border-gray-100">
                      {job.employer.hasElderly ? '👴' : (job.employer.children ? '👨‍👩‍👧' : '🏘️')}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-base font-bold text-gray-900">{job.employer.name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wide">
                          {job.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                        <span>{job.employer.location}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{job.employer.householdSize} People</span>
                        {job.duties && job.duties.length > 0 && (
                          <>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="truncate max-w-[200px]">{job.duties[0]}</span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-5 py-2 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all">
                        Decline
                      </button>
                      <button 
                        onClick={() => handleApply(job.id)}
                        disabled={applying === job.id}
                        className="px-5 py-2 bg-[#DB0011] text-white rounded-full text-sm font-bold hover:bg-[#B2000E] transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                      >
                        {applying === job.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'View Details'}
                      </button>
                    </div>
                  </div>
                ))}
                
                {jobs.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-gray-500 font-medium">No new matches found today.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Peasy Academy Progress */}
            <section className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Peasy Academy Progress</h3>
                <button className="px-4 py-1.5 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                  Resume Training
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-gray-900">Advanced Newborn Care</span>
                    <span className="text-sm text-gray-500 font-medium">75%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#DB0011] rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">Next: Sleep Schedules & Routine</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-gray-900">Western Culinary Arts</span>
                    <span className="text-sm text-gray-500 font-medium">40%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#DB0011] rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">Next: Sauce Bases & Presentation</p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Upcoming Interviews */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4">Upcoming Interviews</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold text-[#DB0011] uppercase">Oct</span>
                    <span className="text-lg font-bold text-gray-900 leading-none">24</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Chen Family</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">10:30 AM • Video Call</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-12 h-12 bg-white rounded-lg flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                    <span className="text-[10px] font-bold text-[#DB0011] uppercase">Oct</span>
                    <span className="text-lg font-bold text-gray-900 leading-none">26</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Harrison Residence</div>
                    <div className="text-xs text-gray-500 font-medium mt-0.5">02:00 PM • Coffee Meetup</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-gray-900">Messages</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DB0011] text-white text-xs font-bold">
                  2 New
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3 pb-4 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900 mb-0.5">Sarah Chen</div>
                    <p className="text-xs text-gray-500 font-medium truncate">"We loved your cooking portfolio! Can you..."</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-900 mb-0.5">James Lim</div>
                    <p className="text-xs text-gray-500 font-medium truncate">"Thank you for the application. We are looking..."</p>
                  </div>
                </div>

                <button className="w-full py-2 border border-gray-200 rounded-full text-sm font-bold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all mt-2">
                  Open Inbox
                </button>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
