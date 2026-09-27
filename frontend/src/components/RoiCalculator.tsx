"use client";
import { useState } from "react";
import { Clock, ShieldAlert, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RoiCalculator() {
  const [parcelCount, setParcelCount] = useState<number>(50);
  const [avgLandValueCr, setAvgLandValueCr] = useState<number>(3); // 3 Crores INR

  const hoursPerTraditionalSearch = 18;
  const hoursWithTitleNode = 0.5;
  const totalHoursSaved = Math.round(parcelCount * (hoursPerTraditionalSearch - hoursWithTitleNode));
  const portfolioAtRiskCr = parcelCount * avgLandValueCr;
  const estimatedCostSavingInr = Math.round(parcelCount * 22500);

  return (
    <div className="bg-white border border-[#0F2C59]/15 rounded-2xl shadow-xl p-8 md:p-12 text-[#0F2C59]">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#7A5C2E] bg-[#DAC0A3]/20 px-3 py-1 rounded-full inline-block mb-3">
          Savings Calculator
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          See How Much Time & Money You Save
        </h3>
        <p className="text-slate-600 text-sm mt-2">
          Compare the old manual 3-week title search with TitleNode's instant 4-second check.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Sliders Input Column */}
        <div className="space-y-8 bg-slate-50 p-6 rounded-xl border border-[#0F2C59]/10">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                How many land parcels do you check per month?
              </label>
              <span className="text-lg font-mono font-bold text-[#0F2C59] bg-white px-3 py-1 rounded border border-[#0F2C59]/20 shadow-sm">
                {parcelCount} Parcels
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="300"
              step="5"
              value={parcelCount}
              onChange={(e) => setParcelCount(Number(e.target.value))}
              className="w-full accent-[#0F2C59] cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>5 parcels (Small Buyer)</span>
              <span>150 (Builder / Solar)</span>
              <span>300+ (Large Developer)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                Average Land Value per Parcel
              </label>
              <span className="text-lg font-mono font-bold text-[#0F2C59] bg-white px-3 py-1 rounded border border-[#0F2C59]/20 shadow-sm">
                ₹{avgLandValueCr} Crores
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25"
              step="0.5"
              value={avgLandValueCr}
              onChange={(e) => setAvgLandValueCr(Number(e.target.value))}
              className="w-full accent-[#0F2C59] cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>₹50 Lakhs</span>
              <span>₹5 Crores</span>
              <span>₹25+ Crores</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 space-y-1.5 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Includes complete 70-year deed history</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cross-referenced against official AnyRoR mutation registers</span>
            </div>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0F2C59] text-white p-5 rounded-xl shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#DAC0A3] mb-3">
              <Clock className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Hours Saved</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold font-mono tracking-tight text-white block">
                {totalHoursSaved.toLocaleString()}
              </span>
              <span className="text-xs text-slate-300 font-medium">Due Diligence Hours Saved / mo</span>
            </div>
          </div>

          <div className="bg-[#0F2C59] text-white p-5 rounded-xl shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400 mb-3">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Safe Investment</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold font-mono tracking-tight text-emerald-300 block">
                ₹{portfolioAtRiskCr.toLocaleString()} Cr
              </span>
              <span className="text-xs text-slate-300 font-medium">Protected From Land Fraud</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-[#0F2C59]/15 p-5 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#7A5C2E] mb-3">
              <TrendingUp className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Cost Saved</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold font-mono tracking-tight text-[#0F2C59] block">
                ₹{(estimatedCostSavingInr / 100000).toFixed(1)} Lakhs
              </span>
              <span className="text-xs text-slate-500 font-medium">Saved in Travel & Clerk Fees</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-[#0F2C59]/15 p-5 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-600 mb-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Turnaround Time</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold font-mono tracking-tight text-[#0F2C59] block">
                3 Weeks → 4-10 min
              </span>
              <span className="text-xs text-slate-500 font-medium">Fast Land Verification</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-600 text-center sm:text-left">
          Want to test TitleNode on your next land purchase?
        </p>
        <div className="flex items-center gap-3">
          <a
            href="/developer"
            className="inline-flex items-center gap-2 bg-[#0F2C59] hover:bg-[#1a407e] text-[#F8F0E5] text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg shadow-md transition-all"
          >
            Try Developer Workspace <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
