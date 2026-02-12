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
              Your family HR consultant. More than just finding a helper.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-black mb-4">Employers</h4>
            <ul className="space-y-2">
              <li><Link href="/employers/questionnaire" className="text-[#6E727D] hover:text-black transition-colors">Find Helper</Link></li>
              <li><Link href="#" className="text-[#6E727D] hover:text-black transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-black mb-4">Helpers</h4>
            <ul className="space-y-2">
              <li><Link href="/helpers/register" className="text-[#6E727D] hover:text-black transition-colors">Create Profile</Link></li>
              <li><Link href="#" className="text-[#6E727D] hover:text-black transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#EDEEF2] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#989CA5]">
            © 2026 Peasy. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-[#6E727D] hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-[#6E727D] hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}