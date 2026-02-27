'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Users, Heart, Calendar, DollarSign, HelpCircle, AlertTriangle, MoreHorizontal, Download, Plus, CheckCircle2, Clock } from 'lucide-react';

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState('contracts');

  return (
    <div className="min-h-screen bg-white font-sans">

      <main className="max-w-[1200px] mx-auto px-6 lg:px-8 py-12 grid grid-cols-[240px_1fr] gap-12 min-h-screen">
        
        {/* Sidebar */}
        <aside className="flex flex-col gap-2">
          <Link href="/employers/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6E727D] hover:bg-[#F5F6FC] hover:text-[#DB0011] transition-colors font-medium">
            <Users className="w-5 h-5" />
            Matches
          </Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6E727D] hover:bg-[#F5F6FC] hover:text-[#DB0011] transition-colors font-medium cursor-pointer">
            <Heart className="w-5 h-5" />
            Shortlist
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6E727D] hover:bg-[#F5F6FC] hover:text-[#DB0011] transition-colors font-medium cursor-pointer">
            <Calendar className="w-5 h-5" />
            Interviews
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#F5F6FC] text-[#DB0011] font-medium cursor-pointer">
            <FileText className="w-5 h-5" />
            Contracts & HR
          </div>
          <div className="h-px bg-[#E5E7EB] my-3"></div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6E727D] hover:bg-[#F5F6FC] hover:text-[#DB0011] transition-colors font-medium cursor-pointer">
            <DollarSign className="w-5 h-5" />
            Payroll Settings
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#6E727D] hover:bg-[#F5F6FC] hover:text-[#DB0011] transition-colors font-medium cursor-pointer">
            <HelpCircle className="w-5 h-5" />
            Support
          </div>
        </aside>

        {/* Content */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[32px] font-bold text-black tracking-tight">Contract Management</h2>
            <button className="bg-[#DB0011] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#B2000E] transition-all flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Contract
            </button>
          </div>

          {/* Alert Banner */}
          <div className="bg-[#FEF2F2] border border-[#FEE2E2] rounded-2xl p-5 mb-8 flex items-center gap-5">
            <div className="text-[#DB0011]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-black mb-0.5">Action Required: Visa Renewal</p>
              <p className="text-sm text-[#6E727D] font-medium">Maria S.'s work permit expires in 45 days. Start the renewal process to avoid compliance gaps.</p>
            </div>
            <button className="bg-[#DB0011] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#B2000E] transition-all whitespace-nowrap">
              Renew Now
            </button>
          </div>

          <div className="grid grid-cols-[2fr_1fr] gap-8">
            
            <div className="flex flex-col gap-8">
              {/* Active Contracts Card */}
              <div className="bg-white border border-[#EDEEF2] rounded-3xl p-8">
                <h3 className="text-xl font-bold text-black mb-5">Active Contracts</h3>
                
                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] pb-3 border-b-2 border-[#EDEEF2] mb-2">
                  <span className="text-xs font-bold text-[#989CA5] uppercase tracking-wider">Helper</span>
                  <span className="text-xs font-bold text-[#989CA5] uppercase tracking-wider">Payroll Status</span>
                  <span className="text-xs font-bold text-[#989CA5] uppercase tracking-wider">Visa / Permit</span>
                  <span></span>
                </div>

                {/* Table Row 1 */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] py-5 border-b border-[#EDEEF2] items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center text-xs font-bold text-gray-500">MS</div>
                    <div>
                      <p className="text-sm font-semibold text-black">Maria Santos</p>
                      <p className="text-[10px] font-bold text-[#989CA5] uppercase tracking-wider">ID: PEA-2023-042</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[13px] font-bold">
                      Paid Oct
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#DB0011]">Expires Dec 15</p>
                  </div>
                  <div className="flex justify-end">
                    <button className="w-9 h-9 rounded-xl border border-[#EDEEF2] bg-white flex items-center justify-center text-black hover:bg-gray-50">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Table Row 2 */}
                <div className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] py-5 border-b border-[#EDEEF2] last:border-0 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center text-xs font-bold text-gray-500">ER</div>
                    <div>
                      <p className="text-sm font-semibold text-black">Elena Ramos</p>
                      <p className="text-[10px] font-bold text-[#989CA5] uppercase tracking-wider">ID: PEA-2023-118</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FFFBEB] text-[#D97706] text-[13px] font-bold">
                      Processing
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#10B981]">Valid til Jun 24</p>
                  </div>
                  <div className="flex justify-end">
                    <button className="w-9 h-9 rounded-xl border border-[#EDEEF2] bg-white flex items-center justify-center text-black hover:bg-gray-50">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Payroll History */}
              <div className="bg-white border border-[#EDEEF2] rounded-3xl p-8">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-bold text-black">Recent Payroll History</h3>
                  <a href="#" className="text-sm font-bold text-[#DB0011] hover:text-[#B2000E]">View All</a>
                </div>
                <div className="grid grid-cols-[1.5fr_1fr_1fr_0.5fr] items-center">
                  <div>
                    <p className="text-sm font-semibold text-black">October 2023 Payroll</p>
                    <p className="text-xs font-bold text-[#989CA5] uppercase tracking-wider mt-0.5">Batch processed Oct 28</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black">$3,240.00</p>
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#ECFDF5] text-[#059669] text-[13px] font-bold">
                      Disbursed
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button className="w-9 h-9 rounded-xl border border-[#EDEEF2] bg-white flex items-center justify-center text-black hover:bg-gray-50">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {/* Document Vault */}
              <div className="bg-white border border-[#EDEEF2] rounded-3xl p-8">
                <h3 className="text-xl font-bold text-black mb-5">Document Vault</h3>
                <p className="text-xs font-bold text-[#989CA5] uppercase tracking-wider mb-3">Legal & Compliance</p>
                
                <div className="flex items-center gap-3 p-3 border border-[#EDEEF2] rounded-xl mb-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-[#F5F6FC] rounded-lg flex items-center justify-center text-[#6E727D]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black truncate leading-tight">Standard Employment Contract</p>
                    <p className="text-[10px] font-bold text-[#989CA5] uppercase tracking-wider mt-0.5">PDF • 1.2 MB</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 border border-[#EDEEF2] rounded-xl mb-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 bg-[#F5F6FC] rounded-lg flex items-center justify-center text-[#6E727D]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black truncate leading-tight">Employer Insurance Policy</p>
                    <p className="text-[10px] font-bold text-[#989CA5] uppercase tracking-wider mt-0.5">PDF • 840 KB</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 p-4 border border-dashed border-[#EDEEF2] bg-[#F5F6FC] rounded-xl cursor-pointer hover:bg-[#EBEFF8] transition-colors text-[#DB0011] font-bold text-sm">
                  <Plus className="w-4 h-4" />
                  Upload Document
                </div>
              </div>

              {/* Compliance Score */}
              <div className="bg-[#F5F6FC] rounded-3xl p-8">
                <h3 className="text-xl font-bold text-black mb-3">Compliance Score</h3>
                <div className="flex items-center gap-5 mb-4">
                  <div className="text-[40px] font-extrabold text-black leading-none">
                    92<span className="text-xl font-normal text-[#6E727D]">/100</span>
                  </div>
                  <div className="flex-1 h-2 bg-[#E5E7EB] rounded-full relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-[92%] bg-[#10B981] rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-[#6E727D] leading-relaxed">
                  Your household is fully compliant. No immediate risks detected.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
