'use client';

import { useEffect, useRef, useState } from 'react';
import { ClipboardList, Search, UserCheck, FileCheck, ArrowRight } from 'lucide-react';
import { AnimatedButton, Card } from './ui';

const steps = [
  {
    number: '01',
    title: 'Describe Needs',
    description: 'Fill out a 3-min questionnaire about your household and expectations.',
    icon: ClipboardList,
    color: 'bg-red-600',
    features: ['Household Size', 'Care Needs', 'Work Schedule'],
  },
  {
    number: '02',
    title: 'We Screen',
    description: 'AI selects the best matches from thousands of candidates.',
    icon: Search,
    color: 'bg-orange-500',
    features: ['Smart Matching', 'Background Check', 'Skill Assessment'],
  },
  {
    number: '03',
    title: 'Interview',
    description: 'Meet candidates to understand their professionalism and personality.',
    icon: UserCheck,
    color: 'bg-amber-500',
    features: ['Online Interview', 'In-person Meeting', 'Trial Period'],
  },
  {
    number: '04',
    title: 'Support',
    description: 'Full support for contracts, visas, and onboarding.',
    icon: FileCheck,
    color: 'bg-green-500',
    features: ['Contract Drafting', 'Visa Application', 'Onboarding Training'],
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
            Simple 4 Steps
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            From needs to onboarding, we make the process simple and transparent.
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-red-200 via-orange-200 to-green-200 -translate-y-1/2" />

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
            Start Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
