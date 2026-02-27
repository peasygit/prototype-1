'use client';

import { useState } from 'react';
import { Calendar, Languages, List, FileText, Edit2, X, Save, Loader2, Check } from 'lucide-react';
import { api } from '@/utils/api';

interface EmployerRequirementsSectionProps {
  profile: any;
  onUpdate: () => void;
}

export default function EmployerRequirementsSection({ profile, onUpdate }: EmployerRequirementsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Helper to safely get array from JSON or return empty array
  const getArray = (json: any) => Array.isArray(json) ? json : [];
  
  const [formData, setFormData] = useState({
    preferredHelperTraits: getArray(profile?.preferredHelperTraits).join(', '),
    languagePreferences: getArray(profile?.languagePreferences).join(', '),
    householdRules: profile?.householdRules || '',
    preferredStartDate: profile?.preferredStartDate ? new Date(profile.preferredStartDate).toISOString().split('T')[0] : '',
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Convert comma-separated strings back to arrays
      const payload = {
        ...formData,
        preferredHelperTraits: formData.preferredHelperTraits.split(',').map(s => s.trim()).filter(Boolean),
        languagePreferences: formData.languagePreferences.split(',').map(s => s.trim()).filter(Boolean),
        preferredStartDate: formData.preferredStartDate ? new Date(formData.preferredStartDate).toISOString() : null,
      };

      await api.post('/employers/profile', payload);
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update requirements:', error);
      alert('Failed to update requirements');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Requirements</h2>
          <button 
            onClick={() => setIsEditing(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Helper Traits</label>
            <p className="text-xs text-gray-500 mb-2">Separate by comma (e.g. Patient, Good Cook, Pet Lover)</p>
            <input
              type="text"
              name="preferredHelperTraits"
              value={formData.preferredHelperTraits}
              onChange={handleChange}
              placeholder="Patient, Good Cook, Pet Lover..."
              className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language Preferences</label>
            <p className="text-xs text-gray-500 mb-2">Separate by comma (e.g. English, Cantonese, Mandarin)</p>
            <input
              type="text"
              name="languagePreferences"
              value={formData.languagePreferences}
              onChange={handleChange}
              placeholder="English, Cantonese..."
              className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Household Rules / Notes</label>
            <textarea
              name="householdRules"
              value={formData.householdRules}
              onChange={handleChange}
              rows={4}
              placeholder="Any specific rules or notes for the helper..."
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Start Date</label>
            <input
              type="date"
              name="preferredStartDate"
              value={formData.preferredStartDate}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
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
        <h2 className="text-xl font-bold text-gray-900">Requirements & Preferences</h2>
        <button 
          onClick={() => {
            setFormData({
              preferredHelperTraits: getArray(profile?.preferredHelperTraits).join(', '),
              languagePreferences: getArray(profile?.languagePreferences).join(', '),
              householdRules: profile?.householdRules || '',
              preferredStartDate: profile?.preferredStartDate ? new Date(profile.preferredStartDate).toISOString().split('T')[0] : '',
            });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-purple-50 rounded-lg shrink-0">
            <List className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Preferred Traits</p>
            <div className="flex flex-wrap gap-2">
              {getArray(profile?.preferredHelperTraits).length > 0 ? (
                getArray(profile?.preferredHelperTraits).map((trait: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 bg-purple-50 text-purple-700 text-sm rounded-full font-medium">
                    {trait}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">No preferences set</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg shrink-0">
            <Languages className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {getArray(profile?.languagePreferences).length > 0 ? (
                getArray(profile?.languagePreferences).map((lang: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
                    {lang}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm italic">No language preferences set</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-50 rounded-lg shrink-0">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Household Rules / Notes</p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {profile?.householdRules || <span className="text-gray-400 italic">No rules specified</span>}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-50 rounded-lg shrink-0">
            <Calendar className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Preferred Start Date</p>
            <p className="text-sm font-medium text-gray-900">
              {profile?.preferredStartDate ? new Date(profile.preferredStartDate).toLocaleDateString() : <span className="text-gray-400 italic">Not specified</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
