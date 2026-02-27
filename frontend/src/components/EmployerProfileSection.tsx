'use client';

import { useState } from 'react';
import { User, MapPin, Users, Mail, Edit2, X, Loader2 } from 'lucide-react';
import { api } from '@/utils/api';

interface EmployerProfileSectionProps {
  profile: any;
  onUpdate: () => void;
}

export default function EmployerProfileSection({ profile, onUpdate }: EmployerProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    location: profile?.location || '',
    householdSize: profile?.householdSize || 0,
    adults: profile?.adults || 0,
    children: profile?.children || 0,
    hasElderly: profile?.hasElderly || false,
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.post('/employers/profile', formData);
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Hong Kong Island"
              className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Household Size</label>
            <input
              type="number"
              name="householdSize"
              value={formData.householdSize}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
              <input
                type="number"
                name="adults"
                value={formData.adults}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
              <input
                type="number"
                name="children"
                value={formData.children}
                onChange={handleChange}
                className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasElderly"
              name="hasElderly"
              checked={formData.hasElderly}
              onChange={handleChange}
              className="w-5 h-5 text-red-600 rounded border-gray-300 focus:ring-red-600"
            />
            <label htmlFor="hasElderly" className="text-sm font-medium text-gray-700">Has Elderly Care Needs</label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-2xl font-bold text-red-600">
            {profile?.name?.charAt(0) || profile?.user?.email?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.name || 'My Profile'}</h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                ID: {profile?.readableId || 'N/A'}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs sm:text-sm">Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            setFormData({
                name: profile?.name || '',
                location: profile?.location || '',
                householdSize: profile?.householdSize || 0,
                adults: profile?.adults || 0,
                children: profile?.children || 0,
                hasElderly: profile?.hasElderly || false,
            });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-50 rounded-lg shrink-0">
            <Mail className="w-5 h-5 text-gray-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Email</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5 break-all">{profile?.user?.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-50 rounded-lg shrink-0">
            <MapPin className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Location</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">{profile?.location || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-50 rounded-lg shrink-0">
            <Users className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Household</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">
              {profile?.householdSize ? `${profile.householdSize} Members` : 'Not set'}
            </p>
            {profile?.householdSize > 0 && (
                <p className="text-xs text-gray-500">
                    {profile.adults || 0} Adults, {profile.children || 0} Children
                </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-gray-50 rounded-lg shrink-0">
            <User className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Elderly Care</p>
            <p className="text-sm font-medium text-gray-900 mt-0.5">
              {profile?.hasElderly ? 'Required' : 'Not required'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
