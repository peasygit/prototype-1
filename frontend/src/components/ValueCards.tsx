'use client';

const values = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18M5 21V7l8-4 8 4v14M9 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: '家庭 HR，非中介',
    description: '我們以銀行級合規標準處理合約、簽證及薪酬管理。',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: '公平與安全',
    description: '道德標準保護家庭與家庭傭工雙方權益。',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '智能配對',
    description: '根據性格、技能及生活需求進行算法配對。',
  },
];

export default function ValueCards() {
  return (
    <section className="pb-16 lg:pb-24">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-5">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-[#F5F6FC] rounded-2xl p-8 hover:bg-[#EBEFF8] transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#DB0011] mb-5">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">{value.title}</h3>
              <p className="text-[#6E727D] leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}