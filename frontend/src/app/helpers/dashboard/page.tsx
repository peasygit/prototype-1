'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, DollarSign, Star, Briefcase, MessageCircle, Bell, User, ChevronRight, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '@/utils/api';

interface Job {
  id: string;
  title: string | null;
  employer: {
    name: string | null;
    location: string | null;
    householdSize: number | null;
  };
  salaryRange: string | null;
  preferredStartDate: string | null;
  duties: string[] | null;
  matchScore?: number; // Calculated or mocked on frontend for now
}

interface HelperStats {
  totalApplications: number;
  shortlistedCount: number;
  interviewCount: number;
  hiredCount: number;
}

export default function HelperDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'messages'>('jobs');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [helperName, setHelperName] = useState<string>('Helper');
  const [profileCompletion, setProfileCompletion] = useState(0);
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
        
        // Calculate completion (simple logic)
        let filledFields = 0;
        const totalFields = 10; // approximate
        if (profile.fullName) filledFields++;
        if (profile.nationality) filledFields++;
        if (profile.birthdate) filledFields++;
        if (profile.religion) filledFields++;
        if (profile.currentLocation) filledFields++;
        if (profile.yearsExperienceTotal) filledFields++;
        if (profile.skills && profile.skills.length > 0) filledFields++;
        if (profile.careExperience && profile.careExperience.length > 0) filledFields++;
        if (profile.aboutMe) filledFields++;
        if (profile.profilePhotoUrl) filledFields++;
        
        setProfileCompletion(Math.min(100, Math.round((filledFields / totalFields) * 100)));

        // 2. Get stats
        const statsData = await api.get<HelperStats>('/helpers/stats');
        setStats(statsData);

        // 3. Get jobs
        const jobsResponse = await api.get<{ data: any[] }>('/helpers/explore?limit=10');
        
        // Transform backend job data to frontend format
        const transformedJobs = jobsResponse.data.map((job: any) => ({
          id: job.id,
          title: job.title || '家務助理',
          employer: {
            name: job.employer?.name || '僱主',
            location: job.employer?.location || '香港',
            householdSize: job.employer?.householdSize || 0,
          },
          salaryRange: job.salaryRange || '面議',
          preferredStartDate: job.preferredStartDate,
          duties: Array.isArray(job.duties) ? job.duties : (job.duties ? [job.duties] : []),
          matchScore: Math.floor(Math.random() * (99 - 70) + 70), // Mock score since backend doesn't provide it yet for explore
        }));
        
        setJobs(transformedJobs);

      } catch (err: any) {
        console.error('Fetch dashboard data error:', err);
        // Don't block UI on error, just log it. Maybe token expired?
        if (err.response?.status === 401) {
             router.push('/login');
        }
        setError('無法載入資料');
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
      // Remove job from list or mark as applied
      setJobs(prev => prev.filter(j => j.id !== jobId));
      // Update stats
      setStats(prev => ({ ...prev, totalApplications: prev.totalApplications + 1 }));
      alert('申請成功！');
    } catch (err) {
      console.error('Apply error:', err);
      alert('申請失敗，請稍後再試');
    } finally {
      setApplying(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const statItems = [
    { label: '推薦工作', value: jobs.length, change: 'NEW' },
    { label: '已申請', value: stats.totalApplications, change: '' },
    { label: '面試邀請', value: stats.interviewCount, change: '' }, // No "NEW" logic yet
    { label: '獲聘', value: stats.hiredCount, change: '' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
                {helperName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-2">歡迎回來，{helperName}</h1>
          <p className="text-gray-600">今天為您找到 {jobs.length} 個合適的工作機會</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statItems.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl font-bold text-black">{stat.value}</span>
                {stat.change && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700`}>
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
            <div className="text-3xl font-bold">{profileCompletion}%</div>
          </div>
          <div className="h-2 bg-red-800/50 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-white rounded-full" style={{ width: `${profileCompletion}%` }} />
          </div>
          <Link href="/helpers/register" className="inline-block text-sm font-medium bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors">
            完善檔案 →
          </Link>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-black mb-4">推薦工作</h2>
          {jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-500">暫時沒有推薦工作，請稍後再查看。</p>
            </div>
          ) : (
            jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-red-200 transition-colors">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Job Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />{job.employer.location}
                        </span>
                        <span>{job.employer.householdSize}人家庭</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          {job.employer.name}
                        </span>
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      {job.matchScore}% 匹配
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.duties && job.duties.map((req, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {req}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-lg font-bold text-red-600">{job.salaryRange}<span className="text-sm font-normal text-gray-500">/月</span></span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {job.preferredStartDate ? new Date(job.preferredStartDate).toLocaleDateString() : '即時'}開始
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex md:flex-col gap-3 md:justify-center">
                  <button 
                    onClick={() => handleApply(job.id)}
                    disabled={applying === job.id}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 h-10 px-6 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400"
                  >
                    {applying === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : '立即申請'}
                  </button>
                  <button className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 h-10 px-6 border border-gray-200 rounded-full text-sm font-medium hover:border-black transition-colors">
                    查看詳情
                  </button>
                </div>
              </div>
            </div>
          )))}
        </div>

        {/* View All Button */}
        {jobs.length > 0 && (
          <div className="text-center mt-8">
            <button className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700">
              查看更多工作 <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
