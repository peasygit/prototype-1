'use client';

import { useEffect, useRef, useState } from 'react';
import { ClipboardList, Search, UserCheck, FileCheck, ArrowRight } from 'lucide-react';
import { AnimatedButton, Card } from './ui';

const steps = [
  {
    number: '01',
    title: '描述需求',
    description: '只需3分鐘填寫問卷，告訴我們您的家庭狀況和期望。',
    icon: ClipboardList,
    color: 'bg-red-600',
    features: ['家庭人數', '照顧需求', '工作時間'],
  },
  {
    number: '02',
    title: '我們篩選',
    description: 'AI算法為您從數千名候選人中精選最合適的配對。',
    icon: Search,
    color: 'bg-orange-500',
    features: ['智能配對', '背景審查', '技能評估'],
  },
  {
    number: '03',
    title: '面試',
    description: '與推薦候選人會面，親身了解他們的專業和性格。',
    icon: UserCheck,
    color: 'bg-amber-500',
    features: ['線上面試', '實體會面', '試工期'],
  },
  {
    number: '04',
    title: '支援',
    description: '我們全程支援合約、簽證等入職手續。',
    icon: FileCheck,
    color: 'bg-green-500',
    features: ['合約草擬', '簽證申請', '入職培訓'],
  },
];

export default function ProcessSteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" ref={sectionRef} className="py-20 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className={`
          text-center max-w-2xl mx-auto mb-16 transition-all duration-700
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-6">
            簡單四步
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            運作方式
          </h2>
          <p className="text-lg text-gray-600">
            從需求到入職，我們讓整個過程變得簡單、透明
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-red-200 via-orange-200 to-green-200" />

          {/* Steps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= activeStep;
              return (
                <div
                  key={step.number}
                  className={`
                    relative transition-all duration-700
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                  `}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  <Card 
                    className={`
                      h-full cursor-pointer transition-all duration-300
                      ${isActive ? 'border-red-300 shadow-lg shadow-red-500/5' : ''}
                    `}
                    hover={false}
                  >
                    <div className="space-y-6">
                      {/* Number & Icon */}
                      <div className="flex items-center justify-between">
                        <span className={`
                          text-4xl lg:text-5xl font-bold transition-colors duration-300
                          ${isActive ? 'text-red-600' : 'text-gray-200'}
                        `}>
                          {step.number}
                        </span>
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                          ${step.color} text-white shadow-lg
                          ${isActive ? 'scale-110' : 'scale-100'}
                        `}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-black">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {step.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-24 items-center justify-center w-8 h-8 z-10">
                      <ArrowRight className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className={`
          text-center mt-16 transition-all duration-700 delay-700
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}>
          <AnimatedButton href="/employers/questionnaire" variant="primary" size="lg">
            立即開始
            <ArrowRight className="w-5 h-5 ml-2" />
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
