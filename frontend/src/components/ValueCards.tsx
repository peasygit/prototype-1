'use client';

import { useEffect, useRef, useState } from 'react';
import { Building2, ShieldCheck, Sparkles } from 'lucide-react';
import { Card } from './ui';

const features = [
  {
    icon: Building2,
    title: 'Family HR, Not Agency',
    description: 'We handle contracts, visas, and payroll with bank-grade compliance.',
    gradient: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: ShieldCheck,
    title: 'Fair & Safe',
    description: 'Ethical standards protecting both families and helpers.',
    gradient: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Sparkles,
    title: 'Smart Matching',
    description: 'Algorithmic matching based on personality, skills, and lifestyle.',
    gradient: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
];



export default function ValueCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
    <section ref={sectionRef} className="relative -mt-20 lg:-mt-28">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Main Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`
                  transition-all duration-700 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                `}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Card className="h-full group">
                  <div className="space-y-5">
                    {/* Icon */}
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center
                      ${feature.bgColor} transition-transform duration-300 group-hover:scale-110
                    `}>
                      <Icon className={`w-7 h-7 text-red-600`} />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-black group-hover:text-red-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Decorative Line */}
                    <div className="h-1 w-12 bg-gray-200 rounded-full group-hover:w-20 group-hover:bg-red-600 transition-all duration-300" />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
