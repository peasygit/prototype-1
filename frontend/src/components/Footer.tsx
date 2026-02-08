'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EDEEF2] py-12 px-6 lg:px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-black">
              Peasy
            </Link>
            <p className="text-[#6E727D] mt-3 max-w-sm">
              你的家庭人力資源顧問。不只找外傭，更是家庭人力顧問。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-black mb-4">僱主</h4>
            <ul className="space-y-2">
              <li><Link href="/employers/questionnaire" className="text-[#6E727D] hover:text-black transition-colors">尋找幫手</Link></li>
              <li><Link href="#" className="text-[#6E727D] hover:text-black transition-colors">登入</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-black mb-4">幫手</h4>
            <ul className="space-y-2">
              <li><Link href="/helpers/register" className="text-[#6E727D] hover:text-black transition-colors">建立檔案</Link></li>
              <li><Link href="#" className="text-[#6E727D] hover:text-black transition-colors">常見問題</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#EDEEF2] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#989CA5]">
            © 2026 Peasy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-[#6E727D] hover:text-black transition-colors">私隱政策</Link>
            <Link href="#" className="text-sm text-[#6E727D] hover:text-black transition-colors">服務條款</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}