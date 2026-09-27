"use client";
import { useState, useEffect } from "react";
import { FileText, Cpu, ShieldCheck, GitBranch, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function LandingHeroTerminal() {
  const [activeTab, setActiveTab] = useState<"deed" | "ocr" | "risk" | "graph">("deed");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const tabs: Array<"deed" | "ocr" | "risk" | "graph"> = ["deed", "ocr", "risk", "graph"];
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const nextIndex = (tabs.indexOf(prev) + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <div 
      className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-[#DAC0A3]/30 shadow-2xl bg-[#091B36] text-[#F8F0E5] transition-all"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Top Bar */}
      <div className="bg-[#07152B] border-b border-[#DAC0A3]/20 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="ml-3 font-mono font-bold text-[11px] text-[#DAC0A3] tracking-widest uppercase">
            TitleNode • How Land Verification Works
          </span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AnyRoR Gujarat: Connected
          </span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="hidden sm:inline-block">AI Vision: Ready</span>
          <span className="hidden sm:inline-block text-slate-600">|</span>
          <span className="text-[#DAC0A3]">Speed: 4-10 min</span>
        </div>
      </div>

      {/* Stage Navigator */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#DAC0A3]/20 bg-[#0F2C59]/60 backdrop-blur-sm">
        <button
          onClick={() => { setActiveTab("deed"); setIsAutoPlaying(false); }}
          className={`px-4 py-3.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "deed"
              ? "border-[#DAC0A3] text-[#DAC0A3] bg-[#0F2C59]"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0F2C59]/40"
          }`}
        >
          <FileText className="w-4 h-4 text-[#DAC0A3]" />
          <span>1. Get Old Deed</span>
        </button>

        <button
          onClick={() => { setActiveTab("ocr"); setIsAutoPlaying(false); }}
          className={`px-4 py-3.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "ocr"
              ? "border-[#DAC0A3] text-[#DAC0A3] bg-[#0F2C59]"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0F2C59]/40"
          }`}
        >
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>2. AI Reads It</span>
        </button>

        <button
          onClick={() => { setActiveTab("risk"); setIsAutoPlaying(false); }}
          className={`px-4 py-3.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "risk"
              ? "border-[#DAC0A3] text-[#DAC0A3] bg-[#0F2C59]"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0F2C59]/40"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>3. 4-Point Safety Check</span>
        </button>

        <button
          onClick={() => { setActiveTab("graph"); setIsAutoPlaying(false); }}
          className={`px-4 py-3.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "graph"
              ? "border-[#DAC0A3] text-[#DAC0A3] bg-[#0F2C59]"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0F2C59]/40"
          }`}
        >
          <GitBranch className="w-4 h-4 text-amber-400" />
          <span>4. Ownership History</span>
        </button>
      </div>

      {/* Stage Content */}
      <div className="p-6 md:p-8 min-h-[380px] flex items-center">
        {/* Stage 1: Get Old Deed */}
        {activeTab === "deed" && (
          <div className="w-full grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAC0A3]/10 border border-[#DAC0A3]/20 text-[11px] font-mono text-[#DAC0A3]">
                <Sparkles className="w-3.5 h-3.5" /> Step 1: Automatic Download
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                We pull the official government records instantly
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                You don't need to visit the taluka or mamlatdar office. TitleNode connects directly to the AnyRoR Gujarat portal and downloads the 7/12 land record and all original scanned mutation deeds.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                <div className="bg-[#07152B] p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Land Location</span>
                  <span className="text-white font-bold">Survey 2 • Hasannagar, Bavla</span>
                </div>
                <div className="bg-[#07152B] p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase">Record Type</span>
                  <span className="text-emerald-400 font-bold">Old Deed #132 (Year 1964)</span>
                </div>
              </div>
            </div>

            <div className="relative bg-[#07152B] border border-slate-800 rounded-lg p-4 shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DAC0A3]/5 to-transparent animate-pulse-slow pointer-events-none"></div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-[10px] font-mono text-slate-400">
                <span>SCANNED GOVERNMENT RECORD</span>
                <span className="text-emerald-400 font-bold">ORIGINAL COPY</span>
              </div>
              <div className="bg-amber-950/20 border border-amber-500/30 rounded p-4 text-amber-200/90 font-serif text-xs space-y-2 leading-relaxed">
                <div className="border-b border-amber-500/20 pb-1 font-bold text-amber-100 flex justify-between">
                  <span>ગામ નમુનો નં. ૬ (હક્ક પત્રક નોંધ)</span>
                  <span className="text-[10px] font-mono">૧૫-૦૪-૧૯૬૪</span>
                </div>
                <p className="italic">
                  "હુકમ અન્વયે ગણોતધારા કલમ ૩૨-જી મુજબ [કાયદેસર ખાતેદાર / વારસદાર] ના નામે સરકારી હુકમ મુજબ ગણોતિયા હક્ક કાયમ કરવા બાબત..."
                </p>
                <div className="mt-3 inline-block px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-500/30">
                  ✓ Found in Gujarat Government Archive
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: AI Reads It */}
        {activeTab === "ocr" && (
          <div className="w-full grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-[11px] font-mono text-cyan-300">
                <Cpu className="w-3.5 h-3.5" /> Step 2: Smart AI Reading
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                AI reads old, faded Gujarati handwriting easily
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Old deeds from 40 or 60 years ago are written in cursive Gujarati that is hard for normal people to read. Our AI reads every word: who sold it, who bought it, what date, and under what government order.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" /> Clear English & Gujarati text generated in seconds
              </div>
            </div>

            <div className="bg-[#07152B] border border-slate-800 rounded-lg p-4 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-[10px] text-slate-400">
                <span className="text-cyan-400 font-bold">Deed Summary (In Plain Words)</span>
                <span>VERIFIED</span>
              </div>
              <div className="space-y-2 text-xs bg-black/40 p-3 rounded border border-slate-900 text-slate-200">
                <div><span className="text-slate-400">Entry Number:</span> <span className="text-white font-bold">132</span></div>
                <div><span className="text-slate-400">Date:</span> <span className="text-white">15 April 1964</span></div>
                <div><span className="text-slate-400">Transaction:</span> <span className="text-emerald-400">Tenancy Rights Given (ગણોતિયા હક્ક)</span></div>
                <div><span className="text-slate-400">Old Owner:</span> <span className="text-white">Registered Landholder [Protected]</span></div>
                <div><span className="text-slate-400">New Owners:</span> <span className="text-white font-bold">Legal Heirs & Successors [Protected]</span></div>
                <div><span className="text-slate-400">Tenure:</span> <span className="text-emerald-400 font-bold">Old Tenure (Freehold - Clear to buy)</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: 4-Point Safety Check */}
        {activeTab === "risk" && (
          <div className="w-full grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[11px] font-mono text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" /> Step 3: Safety Red Flags
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                4-Point Safety Traffic Lights (Green, Yellow, Red)
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Before you buy, TitleNode automatically checks the 4 biggest land risks in India: government land restrictions, new tenure rules, hidden bank loans, and court cases.
              </p>
              <div className="text-xs text-[#DAC0A3] font-mono">
                → Simple colors: Green means Safe, Yellow means Attention, Red means Danger.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#07152B] border border-emerald-500/30 p-3.5 rounded-lg">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1">1. Ownership</span>
                <span className="text-sm font-bold text-white block">🟢 Safe (Private Land)</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Not government or village grazing land</span>
              </div>

              <div className="bg-[#07152B] border border-emerald-500/30 p-3.5 rounded-lg">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1">2. Land Rules (Tenure)</span>
                <span className="text-sm font-bold text-white block">🟢 Old Tenure (જૂની શરત)</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Can sell directly without special permission</span>
              </div>

              <div className="bg-[#07152B] border border-amber-500/30 p-3.5 rounded-lg">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block mb-1">3. Bank Loan (Boja)</span>
                <span className="text-sm font-bold text-white block">🟡 Bank Loan Found</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Bank of Baroda loan (Must get NOC first)</span>
              </div>

              <div className="bg-[#07152B] border border-emerald-500/30 p-3.5 rounded-lg">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block mb-1">4. Court Cases</span>
                <span className="text-sm font-bold text-white block">🟢 No Court Case</span>
                <span className="text-[10px] text-slate-400 mt-1 block">Zero civil court or revenue disputes found</span>
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Ownership History */}
        {activeTab === "graph" && (
          <div className="w-full grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-[11px] font-mono text-amber-300">
                <GitBranch className="w-3.5 h-3.5" /> Step 4: Clear Family Tree
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                See who owned the land for the last 70 years
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We draw an easy-to-follow visual timeline showing every owner since 1952. You can see how the land was passed from father to son, when it was mortgaged, and when it was sold.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a 
                  href="/advocate/tree/2" 
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#DAC0A3] hover:text-white bg-[#0F2C59] px-4 py-2 rounded border border-[#DAC0A3]/30 transition-colors"
                >
                  View Full Family Tree <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="bg-[#07152B] border border-slate-800 rounded-lg p-4 shadow-inner space-y-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span>SURVEY 2 • 70-YEAR HISTORY</span>
                <span className="text-emerald-400 font-bold">ALL ENTRIES VERIFIED</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-3 p-2 bg-[#0F2C59]/40 border border-[#DAC0A3]/20 rounded">
                  <span className="text-[10px] bg-[#DAC0A3] text-[#0F2C59] px-1.5 py-0.5 font-bold rounded">1952</span>
                  <div className="flex-1">
                    <span className="text-white font-bold block text-xs">First Government Record</span>
                    <span className="text-[10px] text-slate-400">Government → Original Allottee</span>
                  </div>
                  <span className="text-emerald-400 text-[10px]">✓ Clear</span>
                </div>

                <div className="flex items-center gap-3 p-2 bg-[#0F2C59]/40 border border-[#DAC0A3]/20 rounded">
                  <span className="text-[10px] bg-[#DAC0A3] text-[#0F2C59] px-1.5 py-0.5 font-bold rounded">1964</span>
                  <div className="flex-1">
                    <span className="text-white font-bold block text-xs">Tenancy Rights (ગણોત)</span>
                    <span className="text-[10px] text-slate-400">Allottee → Direct Legal Heirs</span>
                  </div>
                  <span className="text-emerald-400 text-[10px]">✓ Clear</span>
                </div>

                <div className="flex items-center gap-3 p-2 bg-[#0F2C59]/40 border border-[#DAC0A3]/20 rounded">
                  <span className="text-[10px] bg-[#DAC0A3] text-[#0F2C59] px-1.5 py-0.5 font-bold rounded">2015</span>
                  <div className="flex-1">
                    <span className="text-white font-bold block text-xs">Registered Sale Deed</span>
                    <span className="text-[10px] text-slate-400">Family Heirs → Commercial Buyer</span>
                  </div>
                  <span className="text-amber-400 text-[10px]">Lawyer Reviewing</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="bg-[#07152B] border-t border-[#DAC0A3]/20 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
        <span className="font-mono text-[11px]">
          Sample Case: <span className="text-white font-bold">Survey 2, Hasannagar, Bavla (Ahmedabad)</span>
        </span>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <a href="/advocate/review/2" className="text-[#DAC0A3] hover:underline flex items-center gap-1">
            Test Review Screen <ArrowRight className="w-3 h-3" />
          </a>
          <span className="text-slate-600">|</span>
          <a href="/advocate/dossier/2" className="text-[#DAC0A3] hover:underline flex items-center gap-1">
            View Printable Report <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
