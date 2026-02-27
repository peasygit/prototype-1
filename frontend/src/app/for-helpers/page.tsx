'use client';

import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ForHelpersPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-[#FFF5F5] to-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 bg-[#FFE5E7] text-[#DB0011] rounded-full text-sm font-bold mb-5">
              Now Hiring in HK & SG
            </span>
            <h1 className="text-5xl md:text-[56px] font-bold tracking-tight leading-[1.1] text-black mb-5">
              A career that <br className="hidden md:block" /> respects you.
            </h1>
            <p className="text-lg text-[#6E727D] max-w-[500px] mx-auto lg:mx-0 mb-8 leading-relaxed">
              Join the first platform that puts domestic workers first. Get matched with professional families, access free training, and enjoy full insurance coverage.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link href="/helpers/register" className="inline-flex items-center justify-center h-12 px-8 bg-[#DB0011] text-white rounded-full text-base font-bold hover:bg-[#B2000E] transition-all hover:-translate-y-px">
                Apply as a Helper
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-[500px] lg:max-w-none rounded-3xl overflow-hidden h-[500px] shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=800&q=80" 
              alt="Happy Helper" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container mx-auto px-6 lg:px-8 py-20 max-w-[1200px]">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white rounded-3xl border border-[#EDEEF2]">
            <div className="w-14 h-14 bg-[#F5F6FC] rounded-2xl flex items-center justify-center text-[#DB0011] mb-5">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Fair Treatment</h3>
            <p className="text-[15px] text-[#6E727D] leading-relaxed">
              We only work with families who agree to our "Dignity Charter," ensuring respectful working environments and clear hours.
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-[#EDEEF2]">
            <div className="w-14 h-14 bg-[#F5F6FC] rounded-2xl flex items-center justify-center text-[#DB0011] mb-5">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20m10-10H2"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Zero Placement Fees</h3>
            <p className="text-[15px] text-[#6E727D] leading-relaxed">
              Peasy is 100% free for helpers. We never take a cut of your salary or charge you for matching services.
            </p>
          </div>
          <div className="p-8 bg-white rounded-3xl border border-[#EDEEF2]">
            <div className="w-14 h-14 bg-[#F5F6FC] rounded-2xl flex items-center justify-center text-[#DB0011] mb-5">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-2">Career Growth</h3>
            <p className="text-[15px] text-[#6E727D] leading-relaxed">
              Access specialized certifications in newborn care, elderly assistance, and culinary arts to increase your earning potential.
            </p>
          </div>
        </div>
      </section>

      {/* Benefit Section */}
      <section className="bg-[#F5F6FC] py-20 rounded-[40px] mx-6 lg:mx-8 mb-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          
          {/* Item 1 */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center mb-20">
            <div className="w-full md:w-1/2 h-[400px] rounded-3xl overflow-hidden bg-[#E5E7EB]">
              <img 
                src="https://images.unsplash.com/photo-1516534775068-ba3e84529519?w=800&q=80" 
                alt="Training Class" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 md:pl-8">
              <h2 className="text-[40px] font-bold text-black mb-8 leading-tight">Professional Training Programs</h2>
              <p className="text-lg text-[#6E727D] mb-6 leading-relaxed">
                Stand out from the crowd with Peasy Academy. Our members get exclusive access to:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                  <span className="text-base text-[#6E727D]">Western & Fusion Cooking Classes</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                  <span className="text-base text-[#6E727D]">Advanced First Aid & CPR Certification</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                  <span className="text-base text-[#6E727D]">Financial Literacy & Savings Workshops</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center">
            <div className="w-full md:w-1/2 h-[400px] rounded-3xl overflow-hidden bg-[#E5E7EB]">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" 
                alt="Health Insurance" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 md:pr-8">
              <h2 className="text-[40px] font-bold text-black mb-8 leading-tight">Full Benefits & Security</h2>
              <p className="text-lg text-[#6E727D] mb-6 leading-relaxed">
                Your well-being is our priority. Every helper placed through Peasy receives an enhanced benefits package beyond the legal minimum.
              </p>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <h4 className="text-base font-bold text-black mb-1">Health Insurance</h4>
                  <p className="text-sm text-[#6E727D]">Comprehensive medical and dental coverage for total peace of mind.</p>
                </div>
                <div>
                  <h4 className="text-base font-bold text-black mb-1">Legal Support</h4>
                  <p className="text-sm text-[#6E727D]">24/7 access to our mediation and legal advice hotline.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 container mx-auto px-6 lg:px-8 max-w-[1200px]">
        <div className="bg-white border border-[#EDEEF2] rounded-3xl p-12 max-w-[800px] mx-auto text-center shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" 
            alt="Elena" 
            className="w-20 h-20 rounded-full mx-auto mb-5 object-cover"
          />
          <p className="text-2xl font-bold italic text-black mb-5 leading-relaxed">
            "Finding a family through Peasy changed my life. They matched me with a family that actually values my cooking skills and supports my weekend classes. I finally feel like a professional."
          </p>
          <div className="font-bold text-black">Elena R.</div>
          <div className="text-sm text-[#6E727D] mt-1">Peasy Member since 2022 • Placed in Repulse Bay</div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 lg:px-8 pb-20">
        <div className="bg-black text-white rounded-[40px] py-20 px-8 text-center">
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-[40px] font-bold mb-5 text-white">Ready to start your professional journey?</h2>
            <p className="text-lg text-[#9CA3AF] mb-8">
              The application takes 10 minutes. Our team will review your profile and contact you for an interview within 48 hours.
            </p>
            <Link href="/helpers/register" className="inline-flex items-center justify-center h-12 px-12 bg-white text-[#DB0011] rounded-full text-base font-bold hover:bg-gray-100 transition-all">
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="container mx-auto px-6 lg:px-8 max-w-[1200px] mb-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#FFE5E7] text-[#DB0011] rounded-full text-sm font-bold mb-5">
            Your Journey
          </span>
          <h2 className="text-4xl font-bold text-black mb-4">
            How it works
          </h2>
          <p className="text-lg text-[#6E727D]">
            Simple steps to your new career
          </p>
        </div>

        <div className="relative max-w-[900px] mx-auto pl-4 md:pl-0">
          
          {/* Step 1 */}
          <div className="flex gap-8 md:gap-12 pb-20 relative group">
            <div className="absolute left-[27px] top-[56px] bottom-0 w-0.5 bg-[#EDEEF2] group-last:hidden"></div>
            <div className="w-14 h-14 bg-[#F5F6FC] rounded-full flex items-center justify-center text-[#DB0011] font-bold text-xl shrink-0 z-10 border-4 border-white relative">
              1
            </div>
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#989CA5] mb-1 block">Day 1</span>
              <h3 className="text-[28px] font-bold text-black mb-2">Online Application</h3>
              <p className="text-lg text-[#6E727D] leading-relaxed">
                Fill out our digital form. Tell us about your experience, your skills (like cooking or childcare), and what kind of family you'd like to work with. No paperwork required.
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#989CA5] mb-1 block">Day 2-3</span>
              <h3 className="text-[28px] font-bold text-black mb-2">Video Interview</h3>
              <p className="text-lg text-[#6E727D] leading-relaxed">
                Speak with one of our recruitment specialists. We get to know your personality and verify your references. This helps us ensure we match you with families who respect your boundaries.
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#989CA5] mb-1 block">Week 1</span>
              <h3 className="text-[28px] font-bold text-black mb-2">Peasy Academy Prep</h3>
              <p className="text-lg text-[#6E727D] leading-relaxed">
                Complete a free half-day orientation. We walk you through your rights, our "Dignity Charter," and give you a few tips to stand out during family interviews.
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#989CA5] mb-1 block">Week 2</span>
              <h3 className="text-[28px] font-bold text-black mb-2">Smart Matching</h3>
              <p className="text-lg text-[#6E727D] leading-relaxed">
                Our algorithm suggests 3-5 families that fit your preferences perfectly. You choose who you want to interview with. You are always in control of the decision.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-8 md:gap-12 pb-20 relative group">
            <div className="w-14 h-14 bg-[#F5F6FC] rounded-full flex items-center justify-center text-[#DB0011] font-bold text-xl shrink-0 z-10 border-4 border-white relative">
              5
            </div>
            <div className="pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#989CA5] mb-1 block">Week 3-4</span>
              <h3 className="text-[28px] font-bold text-black mb-2">Start Working</h3>
              <p className="text-lg text-[#6E727D] leading-relaxed">
                Once matched, we handle all the visa processing and contracts. We'll even help you coordinate your travel to the family's home.
              </p>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
