'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

interface Field {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
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
      { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+852 0000 0000' },
    ]
  },
  {
    title: 'Basic Information',
    fields: [
      { name: 'name', label: 'Your Name', type: 'text', placeholder: 'Mr./Ms. Chan' },
      { name: 'birthDate', label: 'Date of Birth', type: 'date' },
      { name: 'familySize', label: 'Family Size', type: 'select', options: ['1-2 people', '3-4 people', '5-6 people', '7+ people'] },
      { name: 'homeSize', label: 'Home Size', type: 'select', options: ['< 400 sq ft', '400-600 sq ft', '600-800 sq ft', '800-1000 sq ft', '> 1000 sq ft'] },
      { name: 'district', label: 'District', type: 'select', options: ['Hong Kong Island', 'Kowloon', 'New Territories East', 'New Territories West'] },
    ]
  },
  {
    title: 'Job Requirements',
    fields: [
      { name: 'careType', label: 'Main Care Target', type: 'select', options: ['Infant (0-2y)', 'Toddler (2-6y)', 'School Age', 'Elderly', 'Pets', 'Housework Only'] },
      { name: 'workHours', label: 'Work Schedule', type: 'select', options: ['Full-time Live-in', 'Full-time Live-out', 'Part-time'] },
      { name: 'startDate', label: 'Expected Start Date', type: 'date' },
    ]
  },
  {
    title: 'Skills Required',
    fields: [
      { name: 'cooking', label: 'Cooking Skills', type: 'select', options: ['No Cooking', 'Basic Cooking', 'Chinese Cuisine', 'Western Cuisine', 'Baking'] },
      { name: 'language', label: 'Language', type: 'select', options: ['Cantonese', 'Mandarin', 'English', 'Indonesian', 'Tagalog'] },
      { name: 'driving', label: 'Driving Required?', type: 'checkbox' },
    ]
  },
  {
    title: 'Preferences',
    fields: [
      { name: 'experience', label: 'Experience', type: 'select', options: ['Fresh Helper', '1-2 Years', '3-5 Years', '> 5 Years'] },
      { name: 'personality', label: 'Personality', type: 'select', options: ['Proactive', 'Patient', 'Honest', 'Independent'] },
      { name: 'budget', label: 'Monthly Budget (HKD)', type: 'select', options: ['$4,000-5,000', '$5,000-6,000', '$6,000-7,000', '$7,000-8,000', '> $8,000'] },
    ]
  },
];

export default function Questionnaire() {
  const router = useRouter();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep = () => {
    const fields = steps[currentStep].fields;
    for (const field of fields) {
      if (field.type !== 'checkbox' && !formData[field.name]) {
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

  const convertHouseholdSize = (size: string) => {
    if (size.includes('1-2')) return 2;
    if (size.includes('3-4')) return 4;
    if (size.includes('5-6')) return 6;
    return 8;
  };

  const convertExperience = (exp: string) => {
    if (exp.includes('1-2')) return 2;
    if (exp.includes('3-5')) return 4;
    if (exp.includes('5')) return 6;
    return 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      let token = localStorage.getItem('token');
      
      // 1. Register if no token found
      if (!token) {
        const authData = await api.post<{ user: any; token: string; requireEmailVerification?: boolean }>('/auth/register', {
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: 'employer'
        });

        // If verification is required, stop here and show verification UI
        if (authData.requireEmailVerification || (authData as any).verificationRequired) {
           setVerificationPending(true);
           // We still store the DEV_TOKEN if available to allow "I have verified" button to proceed
           // But in a real app, we might wait. Here we store it but block UI.
           if (authData.token) {
             login(authData.token, authData.user);
           }
           setIsSubmitting(false);
           return;
        }

        token = authData.token;
        login(authData.token, authData.user);
      }

      // 2. Create Profile
      const profileData = {
        name: formData.name,
        householdSize: convertHouseholdSize(formData.familySize),
        location: formData.district,
        languagePreferences: [formData.language],
        preferredHelperTraits: [formData.personality],
        // Other mappings
      };

      await api.post('/employers/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 3. Create Job
      const jobData = {
        title: `Hiring Helper - ${formData.district}`,
        description: `Looking for care for ${formData.careType}, ${formData.workHours}, ${formData.cooking}`,
        duties: {
          care: formData.careType,
          cooking: formData.cooking,
          driving: formData.driving,
          housework: true
        },
        preferredExperienceYears: convertExperience(formData.experience),
        preferredLanguages: [formData.language],
        preferredStartDate: formData.startDate,
        salaryRange: formData.budget,
      };

      await api.post('/employers/jobs', jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsComplete(true);
    } catch (err: any) {
      console.error(err);
      
      // Check for verification required error message
      if (err.message && (
          err.message.includes('Email verification') || 
          err.message.includes('Email not confirmed') ||
          err.message.includes('verification required')
      )) {
          // If this happens during profile/job creation (after registration),
          // it means our token isn't valid yet or user needs to verify.
          // We show the verification screen.
          setVerificationPending(true);
          setIsSubmitting(false);
          return;
      }

      setError(err.message || 'Registration failed, please try again later');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = async () => {
    // If user entered a code, try to verify with it
    if (verificationCode) {
         setIsSubmitting(true);
         try {
             const data = await api.post<{ user: any; token: string }>('/auth/verify', {
                email: formData.email,
                token: verificationCode,
                role: 'employer',
                phone: formData.phone,
                name: formData.name
             });
             
             login(data.token, data.user);
             
             setVerificationPending(false);
             // Retry submission (create profile/job)
             await handleSubmit();
         } catch (err: any) {
             console.error(err);
             alert(err.message || 'Verification failed, please check the code');
             setIsSubmitting(false);
         }
         return;
    }

    // When user says they are verified (without code), we try to proceed with profile creation
    // This supports the legacy link-click flow or dev token flow
    setIsSubmitting(true);
    setVerificationPending(false);
    
    // We need to re-trigger the profile/job creation part. 
    // Since handleSubmit is designed to be idempotent-ish (checks for token), calling it again works.
    await handleSubmit();
  };

  if (verificationPending) {
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
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">✉️</div>
            </div>
            <h1 className="text-3xl font-semibold text-black mb-4">Please Verify Your Email</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              We have sent an email with a verification code to <strong>{formData.email}</strong>.<br/>
              Please enter the code below, or click the link in the email to activate your account.
            </p>

            <div className="mb-6 max-w-xs mx-auto">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                />
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerificationComplete}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-all w-full sm:w-auto disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying...' : 'Verify & Submit'}
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
            <h1 className="text-3xl font-semibold text-black mb-4">Questionnaire Submitted!</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Thank you for completing the questionnaire. We are analyzing your needs and will send the best matches to your email within 24 hours.
            </p>
            <div className="space-y-3">
              <Link
                href="/employers/dashboard"
                className="inline-flex items-center justify-center h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-full transition-all"
              >
                View Matches
              </Link>
              <div>
                <Link href="/" className="text-gray-600 hover:text-black underline">
                  Return to Home
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
            <Link href="/" className="text-gray-600 hover:text-black font-medium">Return to Home</Link>
          </div>
        </div>
      </header>

      <main className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-black">Step {currentStep + 1} / {steps.length}</span>
              <span className="text-gray-600">{currentStepData.title}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div key={index} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= currentStep ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                  <p className="text-sm">{error}</p>
                  {(error.toLowerCase().includes('exist') || error.toLowerCase().includes('registered')) && (
                    <Link href="/login" className="text-sm font-bold underline hover:text-red-800">
                      Login Now
                    </Link>
                  )}
                </div>
              </div>
            )}
            <h2 className="text-xl font-semibold text-black mb-6">{currentStepData.title}</h2>
            <div className="space-y-5">
              {currentStepData.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-black mb-2">{field.label}</label>
                  {field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'tel' ? (
                     <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                    />
                  ) : null}
                  {field.type === 'select' && (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                    >
                      <option value="">Please Select...</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                  {field.type === 'date' && (
                    <input
                      type="date"
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:border-red-600 focus:outline-none"
                    />
                  )}
                  {field.type === 'checkbox' && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[field.name] || false}
                        onChange={(e) => handleInputChange(field.name, e.target.checked)}
                        className="w-5 h-5 accent-red-600"
                      />
                      <span className="text-gray-600">Yes</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-2 h-12 px-6 bg-transparent border-2 border-gray-200 hover:border-gray-800 text-black font-semibold rounded-full transition-all disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />Back
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Questionnaire'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all"
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
