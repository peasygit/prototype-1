'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-[56px] font-semibold leading-[1.1] tracking-tight text-black">
              你的家庭人力資源顧問，<br />
              照顧「人」與「家」
            </h1>
            <p className="text-lg lg:text-xl text-[#6E727D] max-w-[480px] leading-relaxed">
              公平配對、完整人力資源支援、外傭零費用。以專業方式管理家庭聘僱。
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/employers/questionnaire"
                className="inline-flex items-center justify-center h-14 px-8 bg-[#DB0011] hover:bg-[#B2000E] text-white font-semibold text-lg rounded-full transition-all duration-200 hover:-translate-y-0.5"
              >
                開始 3 分鐘問卷
              </Link>
              <Link
                href="#process"
                className="inline-flex items-center justify-center h-14 px-8 bg-transparent border-2 border-[#EDEEF2] hover:border-[#212121] text-black font-semibold text-lg rounded-full transition-all duration-200"
              >
                了解運作方式
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-[#F5F6FC] rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-[#989CA5]">
                <svg className="w-24 h-24 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/5 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
