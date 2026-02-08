'use client';

const steps = [
  { number: '01', title: '描述需求', subtitle: '3分鐘問卷' },
  { number: '02', title: '我們篩選', subtitle: '精選檔案' },
  { number: '03', title: '面試', subtitle: '會面與選擇' },
  { number: '04', title: '支援', subtitle: '文件與入職' },
];

export default function ProcessSteps() {
  return (
    <section id="process" className="py-16 lg:py-20 px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="bg-[#F5F6FC] rounded-2xl p-8 lg:p-12">
          <h2 className="text-2xl lg:text-3xl font-semibold text-black mb-10">運作方式</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-4 left-full w-full h-0.5 bg-[#E5E7EB]" />
                )}
                
                <div className="space-y-3">
                  <span className={`block text-3xl lg:text-4xl font-bold ${
                    index === 0 ? 'text-[#DB0011]' : 'text-[#E5E7EB]'
                  }`}>
                    {step.number}
                  </span>
                  <div>
                    <h4 className="text-lg font-semibold text-black">{step.title}</h4>
                    <p className="text-sm text-[#6E727D] mt-1">{step.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}