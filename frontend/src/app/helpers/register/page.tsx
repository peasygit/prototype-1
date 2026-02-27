'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check, Upload, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  accept?: string; // For file input
}

interface Step {
  title: string;
  fields: Field[];
}

const steps: Step[] = [
  {
    title: 'Account Settings',
    fields: [
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
      { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 8 characters' },
      { name: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Re-enter password' },
    ]
  },
  {
    title: 'Personal Information',
    fields: [
      { name: 'profilePhoto', label: 'Profile Photo', type: 'file', accept: 'image/*' },
      { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name' },
      { name: 'birthDate', label: 'Date of Birth', type: 'date' },
      { name: 'nationality', label: 'Nationality', type: 'select', options: ['Philippines', 'Indonesia', 'Thailand', 'India', 'Other'] },
      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+852 0000 0000' },
      { name: 'currentLocation', label: 'Current Location', type: 'select', options: ['Hong Kong', 'Philippines', 'Indonesia', 'Other'] },
      { name: 'contractStatus', label: 'Contract Status', type: 'select', options: ['Finishing', 'Terminated', 'Transfer', 'Overseas'] },
    ]
  },
  {
    title: 'Work Experience',
    fields: [
      { name: 'experience', label: 'Years of Experience', type: 'select', options: ['Less than 1 year', '1-3 years', '3-5 years', 'More than 5 years'] },
      { name: 'previousEmployers', label: 'Number of Previous Employers', type: 'number', placeholder: '0' },
      { name: 'specialties', label: 'Specialties (Select multiple)', type: 'multiselect', options: ['Infant Care', 'Child Care', 'Elderly Care', 'Pet Care', 'Cooking', 'Housekeeping', 'Driving'] },
    ]
  },
  {
    title: 'Skills & Languages',
    fields: [
      { name: 'languages', label: 'Languages (Select multiple)', type: 'multiselect', options: ['Cantonese', 'Mandarin', 'English', 'Indonesian', 'Tagalog'] },
      { name: 'cooking', label: 'Cooking Skills', type: 'select', options: ['No Cooking', 'Basic Cooking', 'Chinese Cuisine', 'Western Cuisine', 'Baking'] },
      { name: 'driving', label: 'Driving Skills', type: 'select', options: ['No Driving', 'Hong Kong License', 'International License'] },
    ]
  },
  {
    title: 'Other Information',
    fields: [
      { name: 'availability', label: 'Earliest Start Date', type: 'date' },
      { name: 'salary', label: 'Expected Salary (HKD)', type: 'select', options: ['$4,630 (Standard)', '$5,000-6,000', '$6,000-7,000', '$7,000-8,000', '$8,000+'] },
      { name: 'bio', label: 'Self Introduction', type: 'textarea', placeholder: 'Briefly introduce yourself and your strengths...' },
    ]
  },
];

export default function HelperRegister() {
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false); // Add verification state
  const [verificationCode, setVerificationCode] = useState('');

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      handleInputChange('profilePhoto', previewUrl);
    }
  };

  const handleMultiSelect = (name: string, option: string) => {
    const current = formData[name] || [];
    const updated = current.includes(option)
      ? current.filter((o: string) => o !== option)
      : [...current, option];
    handleInputChange(name, updated);
  };

  const validateStep = () => {
    const fields = steps[currentStep].fields;
    for (const field of fields) {
      if (!formData[field.name]) {
        setError(`Please fill in ${field.label}`);
        return false;
      }
    }
    
    if (currentStep === 0) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setError('');
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setError('');
    }
  };

  const convertContractStatus = (status: string) => {
    if (status === 'Finishing') return 'finishing';
    if (status === 'Terminated') return 'early_termination';
    if (status === 'Transfer') return 'transfer';
    if (status === 'Overseas') return 'overseas';
    return 'finishing'; // Default
  };

  const convertExperience = (exp: string) => {
    if (exp === 'Less than 1 year') return 0;
    if (exp === '1-3 years') return 2;
    if (exp === '3-5 years') return 4;
    if (exp === 'More than 5 years') return 6;
    return 0;
  };

  const convertSalary = (salary: string) => {
     // Extract first number
     const match = salary.replace(/,/g, '').match(/(\d+)/);
     return match ? parseInt(match[0]) : 4630;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      let token = localStorage.getItem('token');

      // 1. Register Account if no token
      if (!token) {
        const authData = await api.post<{ user: any; token: string; requireEmailVerification?: boolean }>('/auth/register', {
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: 'helper'
        });

        // If verification is required, stop here and show verification UI
        if (authData.requireEmailVerification || (authData as any).verificationRequired) {
          setVerificationPending(true);
          if (authData.token) {
            login(authData.token, authData.user);
          }
          setIsSubmitting(false);
          return;
        }

        // Save token
        token = authData.token;
        login(authData.token, authData.user);
      }

      // Transform skills and experience
      const skills = [];
      const specialties = formData.specialties || [];
      const yearsExp = convertExperience(formData.experience);
      
      if (specialties.includes('Housekeeping')) skills.push({ skillType: 'housework', proficiencyLevel: 'good' });
      
      // Cooking
      if (specialties.includes('Cooking') || (formData.cooking && formData.cooking !== 'No Cooking')) {
         const isBasic = formData.cooking === 'Basic Cooking';
         skills.push({ skillType: 'cooking', proficiencyLevel: isBasic ? 'basic' : 'good' });
      }
      
      // Driving
      if (specialties.includes('Driving') || (formData.driving && formData.driving !== 'No Driving')) {
         skills.push({ skillType: 'driving', proficiencyLevel: 'good' });
      }

      // Care Experience
      const careExperience = [];
      if (specialties.includes('Infant Care')) careExperience.push({ targetType: 'infant', yearsExperience: yearsExp });
      if (specialties.includes('Child Care')) careExperience.push({ targetType: 'child', yearsExperience: yearsExp });
      if (specialties.includes('Elderly Care')) careExperience.push({ targetType: 'elderly', yearsExperience: yearsExp });
      if (specialties.includes('Pet Care')) careExperience.push({ targetType: 'pet', yearsExperience: yearsExp });

      // 2. Create Profile
      let profilePhotoUrl = null;

      if (selectedFile) {
        try {
          const uploadData = new FormData();
          uploadData.append('file', selectedFile);
          const { url } = await api.upload<{ url: string }>('/upload', uploadData, {
            token: token || undefined
          });
          profilePhotoUrl = url;
        } catch (uploadError) {
          console.error('Photo upload failed:', uploadError);
          // Optional: decide if we should stop or continue without photo
        }
      }

      const profileData = {
        fullName: formData.name,
        displayName: formData.name.split(' ')[0], // Simple heuristic
        nationality: formData.nationality,
        birthdate: formData.birthDate,
        currentLocation: formData.currentLocation || 'Hong Kong',
        contractStatus: convertContractStatus(formData.contractStatus),
        availableFrom: formData.availability,
        yearsExperienceTotal: convertExperience(formData.experience),
        yearsExperienceLocal: 0, // Default or add field
        languages: formData.languages,
        aboutMe: formData.bio,
        profilePhotoUrl,
        expectedSalaryMin: convertSalary(formData.salary),
        skills,
        careExperience,
      };

      await api.post('/helpers/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` } // Explicitly pass token just in case
      });

      setIsComplete(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Registration failed, please try again later');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = async () => {
    // When user says they are verified, we try to proceed with profile creation
    if (verificationCode) {
         setIsSubmitting(true);
         try {
             const data = await api.post<{ user: any; token: string }>('/auth/verify', {
                email: formData.email,
                token: verificationCode,
                role: 'helper',
                phone: formData.phone
             });
             
             login(data.token, data.user);
             
             setVerificationPending(false);
             
             // Continue with profile creation by calling handleSubmit again
             // Since token is now in localStorage, it will skip registration
             await handleSubmit();
         } catch (err: any) {
             console.error(err);
             // Keep verification pending state
             setError(err.message || 'Verification failed, please check your code');
             setIsSubmitting(false);
         }
         return;
    }

    setIsSubmitting(true);
    setVerificationPending(false);
    await handleSubmit();
  };

  if (verificationPending) {
    return (
      <div className="min-h-screen bg-white">
        <main className="py-24 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">✉️</div>
            </div>
            <h1 className="text-3xl font-semibold text-black mb-4">Please Verify Your Email</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We have sent a verification code to <strong>{formData.email}</strong>.<br/>
              Please enter the code or click the link in the email.
            </p>
            
            <div className="mb-6 max-w-xs mx-auto">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent text-center text-lg tracking-widest"
                />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerificationComplete}
                className="inline-flex items-center justify-center h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-all w-full sm:w-auto"
              >
                I have verified, continue
              </button>
              <div className="mt-4">
                 <button className="text-gray-500 text-sm hover:underline">Didn't receive email? Resend</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-white">
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">Peasy</Link>
            </div>
          </div>
        </header>
        
        <main className="py-24 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-semibold text-black mb-4">Registration Successful!</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Welcome to Peasy! We will review your information and notify you via email within 24 hours.
            </p>
            <div className="space-y-3">
              <Link
                href="/helpers/dashboard"
                className="inline-flex items-center justify-center h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-full transition-all"
              >
                Go to Dashboard
              </Link>
              <div>
                <Link href="/" className="text-gray-600 hover:text-black underline">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">Peasy</Link>
            <Link href="/" className="text-gray-600 hover:text-black font-medium">Back to Home</Link>
          </div>
        </div>
      </header>

      <main className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold text-black mb-2">Register as a Helper</h1>
          <p className="text-gray-600 mb-8">Free registration, connect with quality employers</p>
          
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-black">Step {currentStep + 1} / {steps.length}</span>
              <span className="text-gray-600">{currentStepData.title}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            <h2 className="text-xl font-semibold text-black mb-6">{currentStepData.title}</h2>
            <div className="space-y-5">
              {currentStepData.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-black mb-2">{field.label}</label>
                  {field.type === 'file' && (
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                        {formData[field.name] ? (
                          <img 
                            src={formData[field.name]} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        accept={field.accept}
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-red-50 file:text-red-700
                          hover:file:bg-red-100
                        "
                      />
                    </div>
                  )}
                  {field.type === 'text' || field.type === 'email' || field.type === 'password' ? (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                    />
                  ) : null}
                  {field.type === 'tel' && (
                    <input
                      type="tel"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                    />
                  )}
                  {field.type === 'number' && (
                    <input
                      type="number"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, parseInt(e.target.value) || 0)}
                      placeholder={field.placeholder}
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                    />
                  )}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                    />
                  )}
                  {field.type === 'select' && (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                    >
                      <option value="">Select...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'multiselect' && (
                    <div className="flex flex-wrap gap-2">
                      {field.options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleMultiSelect(field.name, option)}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            (formData[field.name] || []).includes(option)
                              ? 'bg-red-600 text-white'
                              : 'bg-white border border-gray-200 text-gray-700 hover:border-red-600'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  {field.type === 'textarea' && (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none resize-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                currentStep === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                {isSubmitting ? 'Submitting...' : 'Complete Registration'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all"
              >
                Next<ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
