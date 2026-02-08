'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const steps = [
  {
    title: '基本資料',
    fields: [
      { name: 'familySize', label: '家庭人數', type: 'select', options: ['1-2人', '3-4人', '5-6人', '7人以上'] },
      { name: 'homeSize', label: '居住面積', type: 'select', options: ['< 400呎', '400-600呎', '600-800呎', '800-1000呎', '> 1000呎'] },
      { name: 'district', label: '居住地區', type: 'select', options: ['香港島', '九龍', '新界東', '新界西'] },
    ]
  },
  {
    title: '工作需求',
    fields: [
      { name: 'careType', label: '主要照顧對象', type: 'select', options: ['嬰兒 (0-2歲)', '幼兒 (2-6歲)', '學童', '長者', '寵物', '家務'] },
      { name: 'workHours', label: '工作時間', type: 'select', options: ['全職住家', '全職非住家', '兼職'] },
      { name: 'startDate', label: '預計開始日期', type: 'date' },
    ]
  },
  {
    title: '技能要求',
    fields: [
      { name: 'cooking', label: '煮食要求', type: 'select', options: ['不需煮食', '簡單煮食', '一般家常菜', '擅長中菜', '擅長西餐', '需要烘焙'] },
      { name: 'language', label: '語言要求', type: 'select', options: ['廣東話', '普通話', '英文', '印尼話', '菲律賓話'] },
      { name: 'driving', label: '需要駕駛?', type: 'checkbox' },
    ]
  },
  {
    title: '配對偏好',
    fields: [
      { name: 'experience', label: '經驗要求', type: 'select', options: ['新手亦可', '1-2年經驗', '3-5年經驗', '5年以上'] },
      { name: 'personality', label: '期望性格', type: 'select', options: ['主動積極', '細心有耐心', '誠寶可靠', '獨立自主'] },
      { name: 'budget', label: '月薪預算 (HKD)', type: 'select', options: ['$4,000-5,000', '$5,000-6,000', '$6,000-7,000', '$7,000-8,000', '$8,000以上'] },
    ]
  },
];

export default function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsComplete(true);
  };

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
            <h1 className="text-3xl font-semibold text-black mb-4">問卷已提交！</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              感謝你填寫問卷。我們正在為你分析需求，並將在24小時內透過電郵發送最合適的配對結果。
            </p>
            <div className="space-y-3">
              <Link
                href="/employers/dashboard"
                className="inline-flex items-center justify-center h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-full transition-all"
              >
                查看配對結果
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
          <div className="mb-8">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-black">步驟 {currentStep + 1} / {steps.length}</span>
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
            <h2 className="text-xl font-semibold text-black mb-6">{currentStepData.title}</h2>
            <div className="space-y-5">
              {currentStepData.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-black mb-2">{field.label}</label>
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
                      <span className="text-gray-600">是</span>
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
              <ChevronLeft className="w-5 h-5" />上一步
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all disabled:opacity-50"
              >
                {isSubmitting ? '提交中...' : '提交問卷'}
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
