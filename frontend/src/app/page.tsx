"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TitleNodeLogo from "@/components/TitleNodeLogo";
import LandingHeroTerminal from "@/components/LandingHeroTerminal";
import RoiCalculator from "@/components/RoiCalculator";
import { 
  ShieldCheck, 
  Cpu, 
  GitBranch, 
  FileText, 
  Building, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Globe, 
  MapPin, 
  Share2, 
  Printer, 
  Clock, 
  Lock, 
  Zap,
  TrendingUp,
  X
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activePersonaTab, setActivePersonaTab] = useState<"advocate" | "developer">("advocate");

  const handleQuickLogin = (role: "advocate" | "developer") => {
    if (role === "advocate") {
      router.push("/advocate");
    } else {
      router.push("/developer");
    }
  };

  return (
    <div className="min-h-screen bg-[#07152B] text-[#F8F0E5] font-sans selection:bg-[#DAC0A3] selection:text-[#0F2C59]">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-[#0F2C59] via-[#1A3A6B] to-[#0F2C59] border-b border-[#DAC0A3]/20 text-center py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          <span className="bg-[#DAC0A3] text-[#0F2C59] text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm tracking-widest">
            LIVE IN GUJARAT
          </span>
          <span className="text-[#DAC0A3] font-medium">
            Instant Land Title & Safety Check for Gujarat AnyRoR Records
          </span>
          <Link 
            href="/advocate/dossier/2" 
            className="text-white hover:text-[#DAC0A3] font-bold underline inline-flex items-center gap-1"
          >
            See Sample Land Report (Survey 2) <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-[#07152B]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <TitleNodeLogo mode="reversed" variant="horizontal" size="sm" />
          </Link>

          <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#problem" className="hover:text-[#DAC0A3] transition-colors">Why Land is Risky</a>
            <a href="#how-it-works" className="hover:text-[#DAC0A3] transition-colors">How It Works</a>
            <a href="#who-is-it-for" className="hover:text-[#DAC0A3] transition-colors">Who Is It For</a>
            <a href="#savings" className="hover:text-[#DAC0A3] transition-colors">Savings Calculator</a>
            <a href="#roadmap" className="hover:text-[#DAC0A3] transition-colors">Coming Soon</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs font-bold uppercase tracking-wider text-[#DAC0A3] hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </button>
            <Link
              href="/advocate"
              className="bg-[#DAC0A3] hover:bg-[#e4cdb3] text-[#0F2C59] font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              Try Free Check <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION (SIMPLE, CLEAR WORDS) */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-grid-dark">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07152B]/80 to-[#07152B] pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#1a407e]/30 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#DAC0A3]/10 border border-[#DAC0A3]/30 text-xs font-mono text-[#DAC0A3] animate-pulse-slow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Land Verification Made 100x Easier</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight sm:leading-none">
            The Smartest Way to <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#DAC0A3] via-[#F8F0E5] to-[#DAC0A3] bg-clip-text text-transparent">
              Check Land Before You Buy.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Check 70 years of government land records in <strong>4-10 minutes</strong>. Find out who really owns the land, if there is an active court dispute, or if there is a hidden bank loan — before you pay a single rupee.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/advocate"
              className="w-full sm:w-auto bg-[#DAC0A3] hover:bg-[#e4cdb3] text-[#0F2C59] text-sm font-extrabold uppercase tracking-widest px-8 py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group"
            >
              <span>For Lawyers: Open Review OS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/developer"
              className="w-full sm:w-auto bg-[#0F2C59] hover:bg-[#153a73] text-white border border-[#DAC0A3]/40 text-sm font-extrabold uppercase tracking-widest px-8 py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Building className="w-4 h-4 text-[#DAC0A3]" />
              <span>For Builders: Check Multiple Lands</span>
            </Link>
          </div>

          {/* Micro Proof Ticker */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Direct AnyRoR Connection
            </span>
            <span className="hidden sm:inline-block text-slate-600">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Reads Old Handwritten Gujarati
            </span>
          </div>

          {/* 4. INTERACTIVE HERO TERMINAL */}
          <div className="pt-8">
            <LandingHeroTerminal />
          </div>

        </div>
      </section>

      {/* 4. WHY BUYING LAND IN INDIA IS RISKY (VERY EASY WORDS) */}
      <section id="problem" className="py-24 bg-[#091B36] border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#DAC0A3] bg-[#DAC0A3]/10 px-3 py-1 rounded-full inline-block">
              The Real Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Why Buying Land in India is So Risky
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              When you buy an apartment, the papers are usually clear. But when you buy land or a plot, 70 years of history are handwritten in old registers. Missing even one small detail can cause years in court.
            </p>
          </div>

          {/* 4 Big Everyday Pain Points */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-[#07152B] border border-slate-800 p-6 rounded-xl">
              <span className="text-4xl font-mono font-extrabold text-red-400 block mb-2">66%</span>
              <h4 className="text-sm font-bold text-white mb-1">Court Disputes</h4>
              <p className="text-xs text-slate-400">Over 6 out of 10 civil court cases in India happen because of land ownership fights.</p>
            </div>

            <div className="bg-[#07152B] border border-slate-800 p-6 rounded-xl">
              <span className="text-4xl font-mono font-extrabold text-[#DAC0A3] block mb-2">3 Weeks</span>
              <h4 className="text-sm font-bold text-white mb-1">Wasted on Travel</h4>
              <p className="text-xs text-slate-400">Lawyers must travel in person to taluka offices and read thousands of old paper pages by hand.</p>
            </div>

            <div className="bg-[#07152B] border border-slate-800 p-6 rounded-xl">
              <span className="text-4xl font-mono font-extrabold text-amber-400 block mb-2">Hidden Loans</span>
              <h4 className="text-sm font-bold text-white mb-1">Old Bank Mortgages</h4>
              <p className="text-xs text-slate-400">A seller might take a bank loan 10 years ago and hide it. If you buy the land, the bank can seize it.</p>
            </div>

            <div className="bg-[#07152B] border border-slate-800 p-6 rounded-xl">
              <span className="text-4xl font-mono font-extrabold text-emerald-400 block mb-2">4-10 Min</span>
              <h4 className="text-sm font-bold text-white mb-1">With TitleNode</h4>
              <p className="text-xs text-slate-400">TitleNode checks all 70 years of government records and shows you clear Green or Red flags instantly.</p>
            </div>
          </div>

          {/* Simple Before & After Matrix */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="bg-red-950/10 border border-red-500/20 rounded-2xl p-8 space-y-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-red-300">The Old Manual Way (Slow & Risky)</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>You have to visit government offices in person, stand in queues, and wait weeks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>Old records are written in cursive Gujarati handwriting that is very difficult to read.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>People miss hidden tenant rights (Ganot) or government restrictions (Navi Sharat).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span>You pay token money or full amount, only to find out later that the title was disputed.</span>
                </li>
              </ul>
            </div>

            {/* The TitleNode Way */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-8 space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-emerald-300">The TitleNode Way (Fast & Safe)</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Instant download: We fetch 7/12, 8A, and all mutation deeds from AnyRoR directly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Smart AI reads the handwriting and shows you who bought and sold the land since 1952.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Clear traffic light colors: Green means clear, Yellow means check loan, Red means stop.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Verified against official government mutation registers with complete data privacy.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS (IN SIMPLE WORDS) */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#DAC0A3] bg-[#DAC0A3]/10 px-3 py-1 rounded-full inline-block">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            How TitleNode Checks Your Land
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We do in 4-10 minutes what used to take weeks of physical visits and manual paperwork.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[#091B36] border border-slate-800 p-8 rounded-2xl space-y-4 hover:border-[#DAC0A3]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0F2C59] border border-[#DAC0A3]/30 flex items-center justify-center text-[#DAC0A3] group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1. AI Reads Old Gujarati Deeds</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We trained our AI specifically on Gujarati land records. It reads faded cursive handwriting from the 1950s and turns it into simple, readable text.
            </p>
            <div className="pt-2 text-[11px] font-mono text-[#DAC0A3]">
              → Reads faded stamps, names & dates accurately
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-[#091B36] border border-slate-800 p-8 rounded-2xl space-y-4 hover:border-[#DAC0A3]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0F2C59] border border-[#DAC0A3]/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">2. 4-Point Safety Traffic Lights</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We check: Is it private land? Can it be sold freely (Juni Sharat)? Is there an unpaid bank loan (Boja)? Is there a court case? Green means safe, Red means caution.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400">
              → Instant Green, Yellow, Red lights
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-[#091B36] border border-slate-800 p-8 rounded-2xl space-y-4 hover:border-[#DAC0A3]/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#0F2C59] border border-[#DAC0A3]/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <GitBranch className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Visual Family Ownership Tree</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              See a visual family tree showing who owned the land from 1952 until today. You can clearly trace every inheritance, sale, and bank mortgage in order.
            </p>
            <div className="pt-2 text-[11px] font-mono text-amber-400">
              → Complete 70-year timeline at a glance
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHO IS IT FOR (DUAL WORKSPACES) */}
      <section id="who-is-it-for" className="py-24 bg-[#091B36] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#DAC0A3] bg-[#DAC0A3]/10 px-3 py-1 rounded-full inline-block">
              Tailored For You
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Built for Lawyers, Builders & Land Buyers
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Whether you are an advocate issuing title search opinions, or a builder planning a large project, TitleNode makes your work fast and stress-free.
            </p>

            {/* Switcher */}
            <div className="inline-flex p-1.5 rounded-xl bg-[#07152B] border border-slate-800 mt-4">
              <button
                onClick={() => setActivePersonaTab("advocate")}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activePersonaTab === "advocate"
                    ? "bg-[#0F2C59] text-[#DAC0A3] border border-[#DAC0A3]/40 shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>For Lawyers & Title Searchers</span>
              </button>
              <button
                onClick={() => setActivePersonaTab("developer")}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activePersonaTab === "developer"
                    ? "bg-[#0F2C59] text-[#DAC0A3] border border-[#DAC0A3]/40 shadow-lg"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>For Builders & Land Buyers</span>
              </button>
            </div>
          </div>

          {/* Advocate Showcase */}
          {activePersonaTab === "advocate" && (
            <div className="bg-[#07152B] border border-slate-800 rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAC0A3]/10 text-[#DAC0A3] font-mono text-xs">
                  <Scale className="w-4 h-4" /> For Real Estate Advocates & Legal Teams
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  Finish 3-Week Title Searches in 30 Minutes
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  No more spending hours in record rooms. See original deed images side-by-side with our AI transcription. Review the entries, click confirm, and generate a professional, print-ready A4 legal dossier.
                </p>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Side-by-side view of scanned deed and auto-filled details</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Interactive visual family tree for ownership history</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Print-ready A4 legal title opinion report ready to sign & stamp</span>
                  </li>
                </ul>
                <div className="pt-2 flex items-center gap-4">
                  <Link
                    href="/advocate"
                    className="bg-[#DAC0A3] hover:bg-[#e4cdb3] text-[#0F2C59] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-md transition-all flex items-center gap-2"
                  >
                    Open Lawyer Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/advocate/review/2"
                    className="text-xs font-mono text-[#DAC0A3] hover:underline"
                  >
                    Test Review Screen (Survey 2) →
                  </Link>
                </div>
              </div>

              <div className="bg-[#091B36] border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono">
                  <span className="text-[#DAC0A3] font-bold">CASE IN REVIEW: SURVEY 2</span>
                  <span className="text-emerald-400">BAVLA, AHMEDABAD</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="bg-[#07152B] p-3 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold block">Deed #410 • Sale Deed (2015)</span>
                      <span className="text-slate-400 text-[10px]">TitleNode Commercial Ltd.</span>
                    </div>
                    <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded text-[10px] font-mono">
                      Needs Check
                    </span>
                  </div>
                  <div className="bg-[#07152B] p-3 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold block">Deed #337 • Bank Loan (1998)</span>
                      <span className="text-slate-400 text-[10px]">Bank of Baroda • ₹4,50,000</span>
                    </div>
                    <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded text-[10px] font-mono">
                      ✓ Confirmed
                    </span>
                  </div>
                  <div className="bg-[#07152B] p-3 rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold block">Deed #256 • Family Inheritance (1982)</span>
                      <span className="text-slate-400 text-[10px]">Direct Legal Heirs (Masked)</span>
                    </div>
                    <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded text-[10px] font-mono">
                      ✓ Confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Developer Showcase */}
          {activePersonaTab === "developer" && (
            <div className="bg-[#07152B] border border-slate-800 rounded-2xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DAC0A3]/10 text-[#DAC0A3] font-mono text-xs">
                  <Building className="w-4 h-4" /> For Real Estate Builders & Land Investors
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                  Check Hundreds of Survey Numbers at Once
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Planning a residential township, industrial park, or solar plant? Simply upload a list of survey numbers in Excel or CSV. Get a color-coded village map showing which plots are clean and which have disputes.
                </p>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Bulk upload 100+ survey numbers in one click</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Village risk grid: see clear, warning, and dangerous plots</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Easy WhatsApp summary to send to your partners or brokers</span>
                  </li>
                </ul>
                <div className="pt-2 flex items-center gap-4">
                  <Link
                    href="/developer"
                    className="bg-[#DAC0A3] hover:bg-[#e4cdb3] text-[#0F2C59] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-lg shadow-md transition-all flex items-center gap-2"
                  >
                    Open Builder Workspace <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/shared/2"
                    className="text-xs font-mono text-[#DAC0A3] hover:underline"
                  >
                    See WhatsApp Mobile Summary →
                  </Link>
                </div>
              </div>

              <div className="bg-[#091B36] border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3 text-xs font-mono">
                  <span className="text-[#DAC0A3] font-bold">VILLAGE SUMMARY: HASANNAGAR</span>
                  <span className="text-emerald-400">5 PLOTS CHECKED</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-[#07152B] rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold block">Survey 2 • 4 Hectares</span>
                      <span className="text-slate-400 text-[10px]">TitleNode Commercial Ltd.</span>
                    </div>
                    <span className="text-amber-400 text-[10px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      🟡 Bank Loan Found
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#07152B] rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold block">Survey 14 • 1.1 Hectares</span>
                      <span className="text-slate-400 text-[10px]">Private Landholder</span>
                    </div>
                    <span className="text-emerald-400 text-[10px] bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                      🟢 100% Clear Title
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#07152B] rounded border border-slate-800 flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold block">Survey 45 • 12.5 Hectares</span>
                      <span className="text-slate-400 text-[10px]">Government of Gujarat</span>
                    </div>
                    <span className="text-red-400 text-[10px] bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">
                      🔴 Government Land (Do Not Buy)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 7. SAVINGS CALCULATOR */}
      <section id="savings" className="py-24 max-w-7xl mx-auto px-6">
        <RoiCalculator />
      </section>

      {/* 8. WHAT WE ARE BUILDING NEXT (ROADMAP) */}
      <section id="roadmap" className="py-24 bg-[#091B36] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#DAC0A3] bg-[#DAC0A3]/10 px-3 py-1 rounded-full inline-block">
              Coming Soon
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              What We Are Building Next
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We started with Gujarat, but we are expanding to protect land buyers all across India.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* 1 */}
            <div className="bg-[#07152B] border border-slate-800 p-6 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mb-2"></div>
              <span className="text-[10px] font-mono uppercase text-[#DAC0A3] font-bold block">
                Next States
              </span>
              <h3 className="text-base font-bold text-white">More States in India</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adding instant land checks for <strong>Maharashtra</strong> (MahaBhumi), <strong>Karnataka</strong> (Bhoomi), <strong>Telangana</strong> (Dharani), and <strong>Uttar Pradesh</strong> (Bhulekh).
              </p>
            </div>

            {/* 2 */}
            <div className="bg-[#07152B] border border-slate-800 p-6 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mb-2"></div>
              <span className="text-[10px] font-mono uppercase text-[#DAC0A3] font-bold block">
                Maps & Satellites
              </span>
              <h3 className="text-base font-bold text-white">Satellite Encroachment Check</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Check government maps against high-resolution satellite imagery to see if neighbors or roads have encroached inside your land boundaries.
              </p>
            </div>

            {/* 3 */}
            <div className="bg-[#07152B] border border-slate-800 p-6 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-amber-400 mb-2"></div>
              <span className="text-[10px] font-mono uppercase text-[#DAC0A3] font-bold block">
                Full Protection
              </span>
              <h3 className="text-base font-bold text-white">Instant Title Insurance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Partnering with major insurance companies to insure your land purchase against future fraud or sudden court cases.
              </p>
            </div>

            {/* 4 */}
            <div className="bg-[#07152B] border border-slate-800 p-6 rounded-2xl space-y-4 relative overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-purple-400 mb-2"></div>
              <span className="text-[10px] font-mono uppercase text-[#DAC0A3] font-bold block">
                For Banks
              </span>
              <h3 className="text-base font-bold text-white">Fast Bank Loan Clearances</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Helping leading banks clear home loan and plot mortgage title papers in under 60 seconds instead of weeks.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Ready to Check Land Safely and Easily?
          </h2>
          <p className="text-base text-slate-300 max-w-2xl mx-auto">
            Try TitleNode today. See our live Lawyer and Builder workspaces, or view our sample verified land report.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/advocate"
              className="bg-[#DAC0A3] hover:bg-[#e4cdb3] text-[#0F2C59] text-sm font-extrabold uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl transition-all"
            >
              For Lawyers: Try Advocate OS
            </Link>
            <Link
              href="/developer"
              className="bg-[#0F2C59] hover:bg-[#153a73] text-white border border-[#DAC0A3]/40 text-sm font-extrabold uppercase tracking-wider px-8 py-4 rounded-xl shadow-xl transition-all"
            >
              For Builders: Try Developer OS
            </Link>
            <Link
              href="/advocate/dossier/2"
              className="text-sm font-bold text-[#DAC0A3] hover:underline px-4 py-3"
            >
              View Sample Land Report (A4 Print) →
            </Link>
          </div>
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="border-t border-slate-800/80 bg-[#050F1E] py-16 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          <div className="space-y-4 md:col-span-1">
            <TitleNodeLogo mode="reversed" variant="horizontal" size="sm" />
            <p className="text-xs text-slate-400 leading-relaxed">
              TitleNode makes checking government land records easy, safe, and fast for everyone.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Workspaces</h4>
            <ul className="space-y-2.5">
              <li><Link href="/advocate" className="hover:text-[#DAC0A3] transition-colors">Lawyer Review Screen</Link></li>
              <li><Link href="/advocate/tree/2" className="hover:text-[#DAC0A3] transition-colors">Family Ownership Tree</Link></li>
              <li><Link href="/developer" className="hover:text-[#DAC0A3] transition-colors">Builder Village Summary</Link></li>
              <li><Link href="/advocate/dossier/2" className="hover:text-[#DAC0A3] transition-colors">Printable Land Report</Link></li>
              <li><Link href="/shared/2" className="hover:text-[#DAC0A3] transition-colors">WhatsApp Summary</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">How It Helps</h4>
            <ul className="space-y-2.5">
              <li><a href="#how-it-works" className="hover:text-[#DAC0A3] transition-colors">Reads Old Handwriting</a></li>
              <li><a href="#how-it-works" className="hover:text-[#DAC0A3] transition-colors">4-Point Safety Signals</a></li>
              <li><a href="#how-it-works" className="hover:text-[#DAC0A3] transition-colors">70-Year Ownership Chain</a></li>
              <li><a href="#savings" className="hover:text-[#DAC0A3] transition-colors">Savings Calculator</a></li>
              <li><a href="#roadmap" className="hover:text-[#DAC0A3] transition-colors">Next States</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Contact Us</h4>
            <p className="text-xs text-slate-400 mb-3">
              Want to check land for your project or company?
            </p>
            <a 
              href="mailto:contact@titlenode.com"
              className="inline-block bg-[#0F2C59] border border-[#DAC0A3]/30 text-[#DAC0A3] font-bold text-xs uppercase px-4 py-2 rounded hover:bg-[#1a407e] transition-colors"
            >
              Talk to Our Team
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 TitleNode Technologies Inc. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Information provided for intelligence purposes. Certified Title Clearance Certificates require review by a registered advocate.
          </p>
        </div>
      </footer>

      {/* 11. QUICK WORKSPACE ACCESS MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#091B36] border border-[#DAC0A3]/30 rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <TitleNodeLogo mode="reversed" variant="full" size="md" />
              <h3 className="text-base font-bold text-white mt-4">Select Your Workspace</h3>
              <p className="text-xs text-slate-400 mt-1">Choose your role to get started</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleQuickLogin("advocate")}
                className="w-full bg-[#0F2C59] hover:bg-[#153a73] border border-[#DAC0A3]/40 p-4 rounded-xl text-left flex items-center justify-between group transition-all"
              >
                <div>
                  <span className="text-xs font-mono uppercase text-[#DAC0A3] font-bold block mb-1">
                    For Advocates & Legal Counsel
                  </span>
                  <span className="text-sm font-bold text-white block">Lawyer Workspace</span>
                  <span className="text-[11px] text-slate-400">Review Old Deeds • Ownership Tree • Printable Report</span>
                </div>
                <ArrowRight className="w-5 h-5 text-[#DAC0A3] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleQuickLogin("developer")}
                className="w-full bg-[#0F2C59] hover:bg-[#153a73] border border-[#DAC0A3]/40 p-4 rounded-xl text-left flex items-center justify-between group transition-all"
              >
                <div>
                  <span className="text-xs font-mono uppercase text-[#DAC0A3] font-bold block mb-1">
                    For Builders & Land Buyers
                  </span>
                  <span className="text-sm font-bold text-white block">Builder Workspace</span>
                  <span className="text-[11px] text-slate-400">Check Multiple Plots • Village Summary • WhatsApp Briefs</span>
                </div>
                <ArrowRight className="w-5 h-5 text-[#DAC0A3] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Secure & Private • Powered by TitleNode
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}