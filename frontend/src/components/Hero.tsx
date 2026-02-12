'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';
import { AnimatedButton } from './ui';

// Stats data
const stats = [
  { value: '2,500+', label: 'Successful Matches' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '0', label: 'Helper Fees' },
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-red-50 to-transparent rounded-full blur-3xl opacity-60 -translate-y-1/4 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-50 to-transparent rounded-full blur-3xl opacity-40 translate-y-1/4 -translate-x-1/4" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full">
              <Sparkles className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-700">Peasy v2.0 is Live</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-black">
                Your Family's
                <br />
                <span className="relative">
                  <span className="gradient-text">HR Consultant</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M0 8C50 8 50 2 100 2C150 2 150 8 200 8" stroke="#DB0011" strokeWidth="3" strokeLinecap="round" className="opacity-30"/>
                  </svg>
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-light text-gray-700">
                Caring for People and Home
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              Fair matching, complete HR support, zero helper fees.
              <br />
              Professional management of domestic employment.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Background Verified</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">24h Matching</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <AnimatedButton href="/employers/questionnaire" variant="primary" size="lg">
                Start 3-min Questionnaire
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </AnimatedButton>
              <AnimatedButton href="#process" variant="outline" size="lg">
                How it Works
              </AnimatedButton>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8 border-t border-gray-100">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-black">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className={`relative transition-all duration-1000 delay-300 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-red-100 rounded-2xl rotate-12 animate-float" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-100 rounded-full animate-float" style={{ animationDelay: '1s' }} />
              
              {/* Main Card */}
              <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100 hover-lift">
                {/* Top Bar */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <div className="ml-4 px-3 py-1 bg-white rounded-md text-xs text-gray-400 font-mono">
                    peasy.app
                  </div>
                </div>

                {/* Content Mock */}
                <div className="p-6 space-y-4">
                  {/* Profile Card Mock */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center text-xl font-bold text-red-600">
                      M
                    </div>
                    <div>
                      <div className="font-semibold text-black">Maria Santos</div>
                      <div className="text-sm text-gray-500">Infant Care Expert · 5 Years Exp</div>
                    </div>
                    <div className="ml-auto">
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        92%
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex gap-2">
                    {['Infant Care', 'Cooking', 'Housework'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Cantonese</span>
                        <span className="text-gray-800">85%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">English</span>
                        <span className="text-gray-800">75%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: '75%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg p-3 border border-gray-100 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-black">Matched Successfully</div>
                    <div className="text-gray-500 text-xs">3 mins ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="#F5F6FC"/>
        </svg>
      </div>
    </section>
  );
}
