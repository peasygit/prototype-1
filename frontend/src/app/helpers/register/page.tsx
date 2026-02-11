'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check, Upload, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/utils/api';

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
    title: '帳戶設定',
    fields: [
      { name: 'email', label: '電郵地址', type: 'email', placeholder: 'your@email.com' },
      { name: 'password', label: '密碼', type: 'password', placeholder: '至少8位字元' },
      { name: 'confirmPassword', label: '確認密碼', type: 'password', placeholder: '再次輸入密碼' },
    ]
  },
  {
    title: '個人資料',
    fields: [
      { name: 'name', label: '姓名', type: 'text', placeholder: '請輸入您的姓名' },
      { name: 'birthDate', label: '出生日期', type: 'date' },
      { name: 'nationality', label: '國籍', type: 'select', options: ['菲律賓', '印尼', '泰國', '印度', '其他'] },
      { name: 'phone', label: '電話號碼', type: 'tel', placeholder: '+852 0000 0000' },
      { name: 'currentLocation', label: '現時所在地', type: 'select', options: ['香港', '菲律賓', '印尼', '其他'] },
      { name: 'contractStatus', label: '合約狀態', type: 'select', options: ['完約 (Finishing)', '斷約 (Terminated)', '轉工 (Transfer)', '海外 (Overseas)'] },
    ]
  },
  {
    title: '工作經驗',
    fields: [
      { name: 'experience', label: '工作經驗', type: 'select', options: ['少於1年', '1-3年', '3-5年', '5年以上'] },
      { name: 'previousEmployers', label: '前僱主數量', type: 'number', placeholder: '0' },
      { name: 'specialties', label: '專長 (可多選)', type: 'multiselect', options: ['嬰兒護理', '幼兒照顧', '長者護理', '寵物照顧', '煮食', '家務清潔', '駕駛'] },
    ]
  },
  {
    title: '技能與語言',
    fields: [
      { name: 'languages', label: '會說語言 (可多選)', type: 'multiselect', options: ['廣東話', '普通話', '英文', '印尼話', '菲律賓話'] },
      { name: 'cooking', label: '煮食能力', type: 'select', options: ['不會煮食', '簡單煮食', '一般家常菜', '擅長中菜', '擅長西餐', '擅長烘焙'] },
      { name: 'driving', label: '是否會駕駛', type: 'select', options: ['不會', '會駕駛 (香港牌)', '會駕駛 (國際牌)'] },
    ]
  },
  {
    title: '其他資訊',
    fields: [
      { name: 'availability', label: '可到職日期', type: 'date' },
      { name: 'salary', label: '期望月薪 (HKD)', type: 'select', options: ['$4,630 (標準)', '$5,000-6,000', '$6,000-7,000', '$7,000-8,000', '$8,000以上'] },
      { name: 'bio', label: '自我介紹', type: 'textarea', placeholder: '簡單介紹您的經驗和優點...' },
    ]
  },
];

export default function HelperRegister() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false); // Add verification state

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input
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
        setError(`請填寫${field.label}`);
        return false;
      }
    }
    
    if (currentStep === 0) {
      if (formData.password !== formData.confirmPassword) {
        setError('兩次輸入的密碼不一致');
        return false;
      }
      if (formData.password.length < 8) {
        setError('密碼長度需至少8位字元');
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
    if (status.includes('Finishing')) return 'finishing';
    if (status.includes('Terminated')) return 'early_termination';
    if (status.includes('Transfer')) return 'transfer';
    if (status.includes('Overseas')) return 'overseas';
    return 'finishing'; // Default
  };

  const convertExperience = (exp: string) => {
    if (exp === '少於1年') return 0;
    if (exp === '1-3年') return 2;
    if (exp === '3-5年') return 4;
    if (exp === '5年以上') return 6;
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
      // 1. Register Account
      const authData = await api.post<{ user: any; token: string; verificationRequired?: boolean }>('/auth/register', {
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'helper'
      });

      // If verification is required, stop here and show verification UI
      if (authData.verificationRequired) {
        setVerificationPending(true);
        if (authData.token) {
          localStorage.setItem('token', authData.token);
          localStorage.setItem('user', JSON.stringify(authData.user));
        }
        setIsSubmitting(false);
        return;
      }

      // Save token
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      // 2. Create Profile
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
        expectedSalaryMin: convertSalary(formData.salary),
        // Add other mappings as needed
      };

      await api.post('/helpers/profile', profileData, {
        headers: { Authorization: `Bearer ${authData.token}` } // Explicitly pass token just in case
      });

      setIsComplete(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '註冊失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = async () => {
    // When user says they are verified, we try to proceed with profile creation
    setIsSubmitting(true);
    setVerificationPending(false);
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
            <h1 className="text-3xl font-semibold text-black mb-4">請驗證您的電郵地址</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              我們已發送一封驗證信至 <strong>{formData.email}</strong>。<br/>
              請點擊信中的連結以啟用您的帳戶。
            </p>
            <div className="space-y-3">
              <button
                onClick={handleVerificationComplete}
                className="inline-flex items-center justify-center h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-all w-full sm:w-auto"
              >
                我已完成驗證，繼續
              </button>
              <div className="mt-4">
                 <button className="text-gray-500 text-sm hover:underline">沒收到郵件？重新發送</button>
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
            <h1 className="text-3xl font-semibold text-black mb-4">註冊成功！</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              歡迎加入 Peasy！我們會審核您的資料，並在24小時內通過電郵告知結果。
            </p>
            <div className="space-y-3">
              <Link
                href="/helpers/dashboard"
                className="inline-flex items-center justify-center h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-full transition-all"
              >
                前往 Dashboard
              </Link>
              <div>
                <Link href="/" className="text-gray-600 hover:text-black underline">
                  返回首頁
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
            <Link href="/" className="text-gray-600 hover:text-black font-medium">返回首頁</Link>
          </div>
        </div>
      </header>

      <main className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold text-black mb-2">註冊成為家庭幫手</h1>
          <p className="text-gray-600 mb-8">免費註冊，直通優質僱主</p>
          
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-black">步驟 {currentStep + 1} / {steps.length}</span>
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
                      <option value="">請選擇...</option>
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

          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="inline-flex items-center gap-2 h-12 px-6 bg-transparent border-2 border-gray-200 hover:border-gray-800 text-black font-semibold rounded-full transition-all disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />上一步
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all disabled:opacity-50"
              >
                {isSubmitting ? '提交中...' : '完成註冊'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all"
              >
                下一步<ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
