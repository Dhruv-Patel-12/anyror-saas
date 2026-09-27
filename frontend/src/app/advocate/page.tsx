"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TitleNodeLogo from "@/components/TitleNodeLogo";

import { getDashboardStats, scrapeLandRecord } from "@/lib/api";

const BAVLA_VILLAGES = [
  { code: "007", name: "અમીપુરા - 007" }, { code: "045", name: "આદરોડા - 045" },
  { code: "001", name: "હસનનગર - 001" }
];
const HASANNAGAR_SURVEYS = ["2", "3", "4", "6", "7", "8", "9", "10", "11", "12", "14", "22", "45", "101"];

export default function AdvocateDashboard() {
  const router = useRouter();
  const [district, setDistrict] = useState("07");
  const [taluka, setTaluka] = useState("08");
  const [village, setVillage] = useState("001");
  const [survey, setSurvey] = useState("3");
  
  const [stats, setStats] = useState<any>({
    total_verified_nodes: 0,
    active_cases: [],
    closed_cases: []
  });
  const [activeTab, setActiveTab] = useState<"active" | "closed">("active");
  const [filterBySurvey, setFilterBySurvey] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [loadingText, setLoadingText] = useState("Establishing secure connection to Revenue Portal...");

  const selectedSurveyClean = survey && survey !== "-1" ? survey.trim() : "";

  const displayedActiveCases = (filterBySurvey && selectedSurveyClean)
    ? stats.active_cases.filter((c: any) => c.survey_no === selectedSurveyClean)
    : stats.active_cases;

  const displayedClosedCases = (filterBySurvey && selectedSurveyClean)
    ? stats.closed_cases.filter((c: any) => c.survey_no === selectedSurveyClean)
    : stats.closed_cases;

  // Load real stats from PostgreSQL on mount
  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        if (data) setStats(data);
      })
      .catch((err) => {
        console.error("Failed to load dashboard stats:", err);
      });
  }, []);

  useEffect(() => {
    if (!isScraping) return;
    const messages = [
      "Establishing secure connection to AnyRoR Revenue Portal...",
      "Resolving ASP.NET Session Tokens & Dropdown Hierarchy...",
      "Solving 6-digit dynamic CAPTCHA via PyTorch CNN...",
      "Extracting modern digital HTML table entries...",
      "Hunting & downloading historical VF-6 handwritten scans...",
      "Parsing mutation lineage into PostgreSQL review queue..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isScraping]);

  const handleStartReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSurvey = survey.trim();
    if (!cleanSurvey || cleanSurvey === "-1") return;

    setIsScraping(true);
    try {
      // Real API call to trigger scraper or retrieve cached record
      await scrapeLandRecord(district, taluka, village, cleanSurvey);
      router.push(`/advocate/review/${cleanSurvey}`);
    } catch (err: any) {
      console.warn("Live scrape notice:", err);
      // Route to review screen so existing records can be reviewed even if live server times out
      router.push(`/advocate/review/${cleanSurvey}`);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F0E5] font-sans p-8">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-[#0F2C59]/10 pb-6">
        <TitleNodeLogo mode="light" variant="horizontal" size="md" badge="Advocate OS" />
        <div className="flex items-center gap-6">
          <span className="text-xs font-bold text-[#0F2C59] uppercase tracking-widest bg-white px-3 py-1 border border-[#0F2C59]/10 shadow-sm rounded-sm">Collaborators: 1</span>
          <Link href="/" className="text-[#7A5C2E] hover:text-[#0F2C59] text-sm font-bold transition-colors">Sign Out</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN WORKSPACE */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white border border-[#0F2C59]/10 shadow-sm p-8 rounded-sm min-h-[220px]">
            {!isScraping ? (
              <>
                <h2 className="text-2xl font-bold text-[#0F2C59] mb-6">Initiate Verification Pipeline</h2>
                <form onSubmit={handleStartReview} className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[130px]">
                    <label className="block text-xs font-bold text-[#0F2C59] uppercase mb-2">District</label>
                    <select value={district} onChange={(e) => setDistrict(e.target.value)} className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-slate-50 focus:border-[#0F2C59] outline-none text-[#0F2C59]">
                      <option value="07">અમદાવાદ (Ahmedabad)</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[130px]">
                    <label className="block text-xs font-bold text-[#0F2C59] uppercase mb-2">Taluka</label>
                    <select value={taluka} onChange={(e) => setTaluka(e.target.value)} className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-slate-50 focus:border-[#0F2C59] outline-none text-[#0F2C59]">
                      <option value="08">બાવળા (Bavla)</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[130px]">
                    <label className="block text-xs font-bold text-[#0F2C59] uppercase mb-2">Village</label>
                    <select value={village} onChange={(e) => setVillage(e.target.value)} className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-slate-50 focus:border-[#0F2C59] outline-none text-[#0F2C59] cursor-pointer">
                      <option value="0">Select...</option>
                      {BAVLA_VILLAGES.map((v) => <option key={v.code} value={v.code}>{v.name}</option>)}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-xs font-bold text-[#0F2C59] uppercase mb-2">Survey No.</label>
                    {village === "001" ? (
                      <select value={survey} onChange={(e) => setSurvey(e.target.value)} className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-slate-50 focus:border-[#0F2C59] outline-none text-[#0F2C59] cursor-pointer">
                        <option value="-1">Select...</option>
                        {HASANNAGAR_SURVEYS.map((sno) => <option key={sno} value={sno}>{sno}</option>)}
                      </select>
                    ) : (
                      <input type="text" value={survey} onChange={(e) => setSurvey(e.target.value)} className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-slate-50 focus:border-[#0F2C59] outline-none text-[#0F2C59]" required />
                    )}
                  </div>
                  <button type="submit" className="bg-[#0F2C59] text-[#F8F0E5] font-bold py-2 px-8 uppercase text-sm rounded-sm h-[40px] hover:bg-[#1a407e] transition-colors">Launch</button>
                </form>
              </>
            ) : (
              <div className="w-full h-full flex flex-col justify-center animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-[#0F2C59]">System Processing: Survey {survey}</h2>
                  <span className="text-xs font-bold text-[#DAC0A3] uppercase tracking-widest flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-[#0F2C59]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Live
                  </span>
                </div>
                <p className="text-[#7A5C2E] font-mono text-sm mb-6 h-5 transition-all duration-300">&gt;&amp;_ {loadingText}</p>
                <div className="flex gap-4">
                  <div className="h-10 bg-slate-100 rounded-sm flex-1 border border-slate-200"></div>
                  <div className="h-10 bg-slate-100 rounded-sm flex-1 border border-slate-200"></div>
                  <div className="h-10 bg-slate-100 rounded-sm flex-1 border border-slate-200"></div>
                  <div className="h-10 bg-slate-100 rounded-sm w-32 border border-slate-200"></div>
                </div>
              </div>
            )}
          </div>

          {/* TICKETS */}
          <div className={`bg-white border border-[#0F2C59]/10 shadow-sm rounded-sm overflow-hidden transition-opacity duration-300 ${isScraping ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            <div className="flex border-b border-[#0F2C59]/10">
              <button onClick={() => setActiveTab("active")} className={`flex-1 py-4 font-bold transition-colors ${activeTab === "active" ? "text-[#0F2C59] border-b-4 border-[#DAC0A3] bg-slate-50" : "text-[#7A5C2E] hover:bg-slate-50"}`}>
                Active Cases ({displayedActiveCases.length})
              </button>
              <button onClick={() => setActiveTab("closed")} className={`flex-1 py-4 font-bold transition-colors ${activeTab === "closed" ? "text-[#0F2C59] border-b-4 border-[#DAC0A3] bg-slate-50" : "text-[#7A5C2E] hover:bg-slate-50"}`}>
                Closed & Compiled ({displayedClosedCases.length})
              </button>
            </div>

            {selectedSurveyClean && (
              <div className="bg-amber-50/70 border-b border-amber-200/60 px-6 py-2.5 flex justify-between items-center text-xs">
                <span className="text-[#0F2C59]">
                  {filterBySurvey ? (
                    <>Filtering strictly for <strong>Survey {selectedSurveyClean}</strong></>
                  ) : (
                    <>Showing all surveys</>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setFilterBySurvey(!filterBySurvey)}
                  className="text-[#7A5C2E] hover:text-[#0F2C59] font-bold underline cursor-pointer"
                >
                  {filterBySurvey ? "Show All Surveys" : `Show Only Survey ${selectedSurveyClean}`}
                </button>
              </div>
            )}
            
            <div className="max-h-96 overflow-y-auto">
              {activeTab === "active" && (
                displayedActiveCases.length > 0 ? (
                  displayedActiveCases.map((c: any) => (
                    <div key={c.survey_no} onClick={() => router.push(`/advocate/review/${c.survey_no}`)} className="flex justify-between items-center p-6 border-b border-[#0F2C59]/5 hover:bg-slate-50 cursor-pointer transition-colors group">
                      <div>
                        <h4 className="text-[#0F2C59] font-bold text-lg group-hover:underline">Survey No: {c.survey_no}</h4>
                        <p className="text-xs text-[#7A5C2E] mt-1">Pending verification</p>
                      </div>
                      <span className="bg-amber-100 text-amber-900 px-3 py-1 text-xs font-bold uppercase rounded-sm border border-amber-200">{c.pending_nodes} Nodes Pending</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    {filterBySurvey && selectedSurveyClean 
                      ? `No pending nodes found for Survey ${selectedSurveyClean}. Click Launch above to query AnyRoR or click "Show All Surveys".`
                      : "No active cases pending verification."}
                  </div>
                )
              )}

              {activeTab === "closed" && (
                displayedClosedCases.length > 0 ? (
                  displayedClosedCases.map((c: any) => (
                    <div key={c.survey_no} onClick={() => router.push(`/advocate/tree/${c.survey_no}`)} className="flex justify-between items-center p-6 border-b border-[#0F2C59]/5 hover:bg-slate-50 cursor-pointer transition-colors group">
                      <div>
                        <h4 className="text-[#0F2C59] font-bold text-lg group-hover:underline">Survey No: {c.survey_no}</h4>
                        <p className="text-xs text-[#7A5C2E] mt-1">Ready for export</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-900 px-3 py-1 text-xs font-bold uppercase rounded-sm border border-emerald-200">100% Verified ({c.verified_nodes})</span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    {filterBySurvey && selectedSurveyClean
                      ? `No closed cases for Survey ${selectedSurveyClean} yet.`
                      : "No closed cases found."}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className={`bg-[#0F2C59] text-[#F8F0E5] p-8 rounded-sm shadow-xl flex flex-col h-full transition-opacity duration-300 ${isScraping ? "opacity-90" : "opacity-100"}`}>
          <h3 className="text-[#DAC0A3] text-sm font-bold uppercase tracking-widest mb-6 border-b border-[#DAC0A3]/20 pb-3">Your Output Metrics</h3>
          <div className="space-y-8 flex-1">
            <div>
              <span className="block text-5xl font-bold mb-2">{stats.total_verified_nodes}</span>
              <span className="block text-sm opacity-70 uppercase tracking-widest">Total Nodes Verified</span>
            </div>
            <div>
              <span className="block text-5xl font-bold mb-2">{stats.closed_cases.length}</span>
              <span className="block text-sm opacity-70 uppercase tracking-widest">Dossiers Compiled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}