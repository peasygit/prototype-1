'use client';

import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#F9FAFB] to-white text-center">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <span className="inline-block px-4 py-1.5 bg-[#FFE5E7] text-[#DB0011] rounded-full text-sm font-bold mb-5">
            Transparent & Simple
          </span>
          <h1 className="text-5xl md:text-[56px] font-bold tracking-tight leading-tight text-black mb-5">
            How it works
          </h1>
          <p className="text-lg text-[#6E727D] max-w-[600px] mx-auto leading-relaxed">
            Hiring the right helper shouldn't be a gamble. We've streamlined the process to give you control, safety, and peace of mind.
          </p>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="container mx-auto px-6 lg:px-8 max-w-[1200px]">
        <div className="relative max-w-[900px] mx-auto my-20 pl-4 md:pl-0">
          
          {/* Step 1 */}
          <div className="flex gap-8 md:gap-12 pb-20 relative group">
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-[56px] bottom-0 w-0.5 bg-[#EDEEF2] group-last:hidden"></div>
            
            {/* Marker */}
            <div className="w-14 h-14 bg-[#F5F6FC] rounded-full flex items-center justify-center text-[#DB0011] font-bold text-xl shrink-0 z-10 border-4 border-white relative">
              1
            </div>
            
            {/* Content */}
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#989CA5] mb-1 block">Step 1</span>
              <h3 className="text-[28px] font-bold text-black mb-2">Tell Us Your Needs</h3>
              <p className="text-lg text-[#6E727D] leading-relaxed">
                Complete a quick 3-minute questionnaire about your household, care requirements, and schedule. This helps us understand exactly what you're looking for in a helper.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-8 md:gap-12 pb-20 relative group">
            <div className="absolute left-[27px] top-[56px] bottom-0 w-0.5 bg-[#EDEEF2] group-last:hidden"></div>
            <div className="w-14 h-14 bg-[#F5F6FC] rounded-full flex items-center justify-center text-[#DB0011] font-bold text-xl shrink-0 z-10 border-4 border-white relative">
              2
            </div>
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#989CA5] mb-1 block">Step 2</span>
              <h3 className="text-[28px] font-bold text-black mb-2">Smart Matching</h3>
              <p className="text-lg text-[#6E727D] leading-relaxed">
                Our AI analyzes thousands of pre-vetted candidates to find the best matches for your family's personality and needs. No more sifting through irrelevant profiles.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-8 md:gap-12 pb-20 relative group">
            <div className="absolute left-[27px] top-[56px] bottom-0 w-0.5 bg-[#EDEEF2] group-last:hidden"></div>
            <div className="w-14 h-14 bg-[#F5F6FC] rounded-full flex items-center justify-center text-[#DB0011] font-bold text-xl shrink-0 z-10 border-4 border-white relative">
              3
            </div>
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#989CA5] mb-1 block">Step 3</span>
              <h3 className="text-[28px] font-bold text-black mb-2">Interview & Select</h3>
              <p className="text-lg text-[#6E727D] leading-relaxed">
                Review your matches and conduct video interviews with your top choices. We provide interview guides to help you assess professionalism and fit.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-8 md:gap-12 pb-20 relative group">
            <div className="absolute left-[27px] top-[56px] bottom-0 w-0.5 bg-[#EDEEF2] group-last:hidden"></div>
            <div className="w-14 h-14 bg-[#F5F6FC] rounded-full flex items-center justify-center text-[#DB0011] font-bold text-xl shrink-0 z-10 border-4 border-white relative">
              4
            </div>
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#989CA5] mb-1 block">Step 4</span>
              <h3 className="text-[28px] font-bold text-black mb-2">Hassle-free Onboarding</h3>
              <p className="text-lg text-[#6E727D] leading-relaxed">
                Once you've made a choice, we handle the contracts, visa processing, and insurance. We'll guide you through every legal requirement until your helper arrives.
              </p>
            </div>
          </div>
          
          {/* CTA */}
          <div className="pl-20 md:pl-24 pt-8">
            <Link href="/employers/questionnaire" className="inline-flex items-center justify-center h-14 px-8 bg-[#DB0011] text-white rounded-full text-lg font-bold hover:bg-[#B2000E] transition-all hover:-translate-y-px shadow-lg shadow-red-600/20">
              Start Your Search
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
