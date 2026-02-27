'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Upload, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/utils/api';

interface HelperProfile {
  fullName: string;
  displayName: string;
  nationality: string;
  birthdate: string;
  currentLocation: string;
  contractStatus: string;
  availableFrom: string;
  yearsExperienceTotal: number;
  languages: string[];
  aboutMe: string;
  profilePhotoUrl?: string;
  expectedSalaryMin: number;
  specialties?: string[]; // Frontend helper for skills
  skills?: { skillType: string; proficiencyLevel: string }[];
  careExperience?: { targetType: string; yearsExperience: number }[];
}

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<HelperProfile>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await api.get<any>('/helpers/profile');
        
        // Transform backend data to form format
        const profile: Partial<HelperProfile> = {
          fullName: data.fullName,
          displayName: data.displayName,
          nationality: data.nationality,
          birthdate: data.birthdate ? new Date(data.birthdate).toISOString().split('T')[0] : '',
          currentLocation: data.currentLocation,
          contractStatus: data.contractStatus,
          availableFrom: data.availableFrom ? new Date(data.availableFrom).toISOString().split('T')[0] : '',
          yearsExperienceTotal: data.yearsExperienceTotal,
          languages: data.languages || [],
          aboutMe: data.aboutMe,
          profilePhotoUrl: data.profilePhotoUrl,
          expectedSalaryMin: data.expectedSalaryMin,
          // Extract specialties from skills/experience for UI if needed, 
          // but for now let's keep it simple and focus on main fields + photo
        };

        setFormData(profile);
        if (data.profilePhotoUrl) {
            setPreviewUrl(data.profilePhotoUrl);
        }
      } catch (err) {
        console.error('Fetch profile error:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let profilePhotoUrl = formData.profilePhotoUrl;

      // Upload new photo if selected
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        const { url } = await api.upload<{ url: string }>('/upload', uploadData);
        profilePhotoUrl = url;
      }

      // Update profile
      await api.post('/helpers/profile', {
        ...formData,
        profilePhotoUrl,
        // Ensure required fields are present if they were not in formData (should be there from fetch)
      });

      router.push('/helpers/dashboard');
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/helpers/dashboard" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Photo Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Photo</h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-2xl font-bold text-gray-400">
                    {formData.displayName?.charAt(0) || formData.fullName?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div>
                <label className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-all mb-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input
                  type="text"
                  value={formData.displayName || ''}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.birthdate || ''}
                  onChange={(e) => handleInputChange('birthdate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <select
                  value={formData.nationality || ''}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                >
                  <option value="">Select...</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Thailand">Thailand</option>
                  <option value="India">India</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Location</label>
                <select
                  value={formData.currentLocation || ''}
                  onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                >
                  <option value="">Select...</option>
                  <option value="Hong Kong">Hong Kong</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contract Status</label>
                <select
                  value={formData.contractStatus || ''}
                  onChange={(e) => handleInputChange('contractStatus', e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none"
                >
                  <option value="">Select...</option>
                  <option value="finishing">Finishing</option>
                  <option value="terminated">Terminated</option>
                  <option value="break">Break</option>
                  <option value="transfer">Transfer</option>
                  <option value="first_time">First Time</option>
                  <option value="ex_hk">Ex-HK</option>
                  <option value="ex_abroad">Ex-Abroad</option>
                </select>
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">About Me</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Self Introduction</label>
              <textarea
                value={formData.aboutMe || ''}
                onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none resize-none"
                placeholder="Tell employers about yourself..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/helpers/dashboard"
              className="px-6 py-3 border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
