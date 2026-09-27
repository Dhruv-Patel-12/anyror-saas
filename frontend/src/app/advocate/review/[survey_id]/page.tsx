"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TitleNodeLogo from "@/components/TitleNodeLogo";

import { getUnverifiedMutation, verifyMutation, BACKEND_HOST } from "@/lib/api";

export default function ReviewPipeline() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.survey_id as string;
  
  const [task, setTask] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Advanced Pan & Zoom Canvas State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<"official" | "raw">("official");
  const containerRef = useRef<HTMLDivElement>(null);

  // Load real unverified task from PostgreSQL
  const loadNextTask = async () => {
    setLoading(true);
    try {
      const res = await getUnverifiedMutation(surveyId);
      if (res && res.data) {
        setTask(res.data);
        const draft = res.data.final_verified_data || res.data.ai_draft_data || {};
        
        // Explicitly lock survey number default to current searched survey
        const cleanSurveyNo = draft.survey_numbers ? String(draft.survey_numbers) : surveyId;
        const targetSurvey = cleanSurveyNo.includes(surveyId) ? surveyId : (cleanSurveyNo || surveyId);

        setFormData({
          ...draft,
          survey_numbers: targetSurvey
        });
        setZoomLevel(1);
        setPan({ x: 0, y: 0 });
      } else {
        setTask(null); // Triggers Queue Cleared / Completed screen
      }
    } catch (err) {
      console.error("Error fetching unverified mutation:", err);
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNextTask();
  }, [surveyId]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleApprove = async () => {
    if (!task) return;
    setSaving(true);
    try {
      const payloadToSave = {
        ...formData,
        survey_numbers: formData.survey_numbers || surveyId
      };
      await verifyMutation(task.id, payloadToSave);
      await loadNextTask();
    } catch (err) {
      console.error("Error committing mutation verification:", err);
      alert("Failed to commit verification to database.");
    } finally {
      setSaving(false);
    }
  };

  // Zoom & Pan Handlers
  const zoomIn = () => setZoomLevel(prev => Math.min(Number((prev + 0.25).toFixed(2)), 4));
  const zoomOut = () => setZoomLevel(prev => Math.max(Number((prev - 0.25).toFixed(2)), 0.5));
  const resetZoom = () => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  };
  const fitWidth = () => {
    setZoomLevel(1.5);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoomLevel(prev => Math.min(Math.max(0.5, Number((prev + delta).toFixed(2))), 4.0));
  };

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#F8F0E5]">
      <svg className="animate-spin h-8 w-8 text-[#0F2C59] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      <div className="text-[#0F2C59] font-bold tracking-widest uppercase text-sm">Fetching Next Node...</div>
    </div>
  );
  
  if (!task) return (
    <div className="flex flex-col h-screen items-center justify-center gap-6 bg-[#F8F0E5]">
      <div className="w-20 h-20 bg-[#0F2C59] rotate-90 rounded-sm flex items-center justify-center text-[#DAC0A3] shadow-lg">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#0F2C59] mb-2">Data Structured</h2>
        <p className="text-[#7A5C2E] font-medium mb-8">All raw nodes for Survey {surveyId} have been successfully verified.</p>
        <Link 
          href={`/advocate/tree/${surveyId}`}
          className="bg-[#0F2C59] hover:bg-[#1a407e] text-[#F8F0E5] font-bold py-4 px-10 shadow-xl transition-all uppercase tracking-widest text-sm rounded-sm inline-block"
        >
          Compile Final Report & Tree →
        </Link>
      </div>
    </div>
  );

  // Extract raw details from scraped HTML text
  const rawHtml = task.scraped_html_text;
  const rawDetails = rawHtml?.Details || rawHtml?.["વિગત"] || rawHtml?.["નોંધની વિગત"] || 
    (typeof rawHtml === "string" ? rawHtml : "") || 
    task.ai_draft_data?.remarks_summary || 
    "મહેસૂલી ખાતા સુધારણા અને ઇ-ધરા પોર્ટલ ડિજિટલ અપડેટ નોંધ";

  const rawEntryNo = rawHtml?.["Entry Number"] || rawHtml?.["નોંધ નંબર"] || task.entry_number;
  const rawDate = rawHtml?.Date || rawHtml?.["તારીખ"] || rawHtml?.["નોંધની તારીખ"] || formData.entry_date || "૨૦/૧૧/૨૦૨૩";
  const rawType = rawHtml?.Type || rawHtml?.["ફેરફારનો પ્રકાર"] || formData.transaction_type || "હુકમથી / ડિજિટલ";
  const rawStatus = rawHtml?.Status || rawHtml?.["નોંધની સ્થિતિ"] || "પ્રમાણિત";
  const rawOfficerRemarks = rawHtml?.["Officer Remarks"] || rawHtml?.["તપાસણી કરનાર અધિકારીનો શેરો"] || "નોટીસ બજી છે. હુકમ થી ખાત્રી કરી = પ્રમાણીત = ઇ-ધરા કેન્દ્ર બાવળા";

  return (
    <div className="flex h-screen bg-[#F8F0E5] overflow-hidden font-sans">
      
      {/* LEFT HALF: The Smart Source Viewer */}
      <div className="w-1/2 p-4 flex flex-col border-r border-[#0F2C59]/10 bg-[#0a192f] relative shadow-2xl z-10 select-none">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center text-[#F8F0E5] mb-3 px-2">
          <Link href="/advocate" className="text-[#DAC0A3] hover:text-white transition-colors mr-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            ← Exit
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <TitleNodeLogo mode="reversed" variant="icon-only" size={24} />
            <h2 className="font-bold text-lg tracking-tight">
              Survey <span className="text-[#DAC0A3]">{surveyId}</span> <span className="opacity-50 mx-2">|</span> Entry {task.entry_number}
            </h2>
          </div>
          <span className="bg-[#DAC0A3] text-[#0F2C59] px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm shadow-sm">
            {task.image_file_path ? "Historical Scan (VF-6)" : "Digital Portal Record"}
          </span>
        </div>
        
        {task.image_file_path ? (
          <>
            {/* Zoom & Pan Floating Controls Bar */}
            <div className="absolute top-16 right-8 z-20 flex items-center gap-1.5 bg-[#0F2C59]/95 px-3 py-1.5 rounded-sm backdrop-blur-md border border-[#DAC0A3]/30 shadow-2xl">
              <button 
                onClick={zoomOut} 
                title="Zoom Out"
                className="text-[#DAC0A3] hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
              </button>
              
              <button 
                onClick={resetZoom} 
                title="Reset to 100%"
                className="text-[#F8F0E5] text-xs font-mono font-bold px-2 py-1 rounded hover:bg-white/10 transition-colors"
              >
                {Math.round(zoomLevel * 100)}%
              </button>

              <button 
                onClick={zoomIn} 
                title="Zoom In"
                className="text-[#DAC0A3] hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>

              <div className="h-4 w-px bg-white/20 mx-1"></div>

              <button 
                onClick={fitWidth} 
                title="Fit to Width"
                className="text-xs text-[#DAC0A3] hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors uppercase font-bold"
              >
                Fit
              </button>
            </div>

            {/* Hint Badge */}
            <div className="absolute bottom-6 left-8 z-20 bg-black/70 text-[#DAC0A3] px-3 py-1 rounded text-[11px] font-mono backdrop-blur-sm pointer-events-none border border-white/10">
              ✋ Drag anywhere to pan • 🔍 Scroll wheel to zoom
            </div>

            {/* Infinite Drag & Pan Viewport */}
            <div 
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              className="flex-1 overflow-hidden bg-black/95 border border-[#0F2C59] rounded-sm relative flex items-center justify-center cursor-grab active:cursor-grabbing shadow-inner"
            >
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.08s ease-out"
                }}
                className="relative inline-block"
              >
                <img 
                  src={task.image_file_path.startsWith("http") ? task.image_file_path : `${BACKEND_HOST}${task.image_file_path}`} 
                  alt={`Mutation Entry ${task.entry_number}`} 
                  draggable={false}
                  className="max-w-none shadow-2xl rounded-sm pointer-events-none select-none"
                  style={{ maxHeight: "75vh" }}
                />
              </div>
            </div>
          </>
        ) : (
          /* DIGITAL RECORD: Official AnyRoR Government 4-Column Table View */
          <div className="flex-1 flex flex-col bg-[#112240] border border-[#233554] rounded-sm shadow-inner overflow-hidden">
            
            {/* Tab Selector */}
            <div className="bg-[#0a192f] border-b border-[#233554] px-4 py-2.5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#DAC0A3]">AnyRoR Verified Record</span>
              </div>
              <div className="flex gap-1 bg-[#1d2d50] p-1 rounded">
                <button
                  onClick={() => setViewMode("official")}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${viewMode === "official" ? "bg-[#0F2C59] text-white shadow" : "text-slate-300 hover:text-white"}`}
                >
                  🏛️ AnyRoR Government Table
                </button>
                <button
                  onClick={() => setViewMode("raw")}
                  className={`px-3 py-1 text-xs font-bold rounded transition-colors ${viewMode === "raw" ? "bg-[#0F2C59] text-white shadow" : "text-slate-300 hover:text-white"}`}
                >
                  {"{ }"} Raw JSON
                </button>
              </div>
            </div>

            {viewMode === "official" ? (
              <div className="flex-1 p-6 overflow-auto bg-[#e8ecf3]">
                {/* Government Header Banner */}
                <div className="mb-3 flex items-center justify-between text-[#0F2C59] pb-2 border-b border-[#0F2C59]/20">
                  <div className="text-xs font-bold uppercase tracking-wide">
                    મહેસૂલ વિભાગ, ગુજરાત સરકાર • AnyRoR ગ્રામ્ય મહેસૂલી નોંધ પત્રક
                  </div>
                  <div className="text-xs font-mono font-bold bg-white px-2 py-0.5 border border-[#0F2C59]/20 rounded">
                    સરવે નંબર: {surveyId}
                  </div>
                </div>

                {/* THE AUTHENTIC 4-COLUMN GOVERNMENT TABLE (Replicating AnyRoR grdcmputerentry) */}
                <div className="border-2 border-[#5c8cd6] shadow-md rounded-sm overflow-hidden bg-white text-slate-900">
                  
                  {/* Table Header Row (AnyRoR Classic Blue Gradient) */}
                  <div className="grid grid-cols-12 bg-gradient-to-b from-[#b9d5fd] to-[#92bcf4] border-b-2 border-[#5c8cd6] text-center text-[13px] font-bold text-[#072d63] leading-snug">
                    <div className="col-span-2 p-3 border-r border-[#5c8cd6] flex flex-col justify-center">
                      <span>નોંધ નંબર</span>
                      <span>નોંધની તારીખ</span>
                      <span>ફેરફારનો પ્રકાર</span>
                      <span>નોંધની સ્થિતિ</span>
                    </div>
                    <div className="col-span-6 p-3 border-r border-[#5c8cd6] flex items-center justify-center">
                      <span>નોંધની વિગત</span>
                    </div>
                    <div className="col-span-2 p-3 border-r border-[#5c8cd6] flex items-center justify-center">
                      <span>ફેરફારને સંબંધિત સરવે નંબર</span>
                    </div>
                    <div className="col-span-2 p-3 flex items-center justify-center">
                      <span>તપાસણી કરનાર અધિકારીનો શેરો</span>
                    </div>
                  </div>

                  {/* Table Content Row */}
                  <div className="grid grid-cols-12 bg-[#fdfbf2] text-[13px] leading-relaxed border-b border-[#5c8cd6]">
                    
                    {/* Col 1: Details / Status */}
                    <div className="col-span-2 p-3.5 border-r border-[#5c8cd6] space-y-1.5 font-medium">
                      <div className="text-base font-extrabold text-[#072d63] tracking-tight">
                        {rawEntryNo}
                      </div>
                      <div className="text-slate-800 font-mono text-xs">
                        {rawDate}
                      </div>
                      <div className="text-slate-700 text-xs font-semibold">
                        {rawType}
                      </div>
                      <div className="inline-block bg-emerald-100 text-emerald-900 text-[11px] font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                        {rawStatus}
                      </div>
                    </div>

                    {/* Col 2: Whole Narrative Text Message from AnyRoR */}
                    <div className="col-span-6 p-4 border-r border-[#5c8cd6] text-slate-900 text-[13.5px] leading-relaxed font-normal whitespace-pre-wrap">
                      {rawDetails}
                    </div>

                    {/* Col 3: Target Survey Number (Strictly clean surveyed number) */}
                    <div className="col-span-2 p-3.5 border-r border-[#5c8cd6] text-center font-bold text-[#072d63]">
                      <span className="inline-block bg-blue-50 border border-blue-200 px-2.5 py-1 rounded text-xs">
                        સરવે નં. {surveyId}
                      </span>
                    </div>

                    {/* Col 4: Officer Remarks */}
                    <div className="col-span-2 p-3 text-xs text-slate-700 leading-relaxed font-medium">
                      {rawOfficerRemarks}
                    </div>
                  </div>
                </div>

                {/* Government Watermark / Disclaimer Footer */}
                <div className="mt-3 text-center text-[11px] text-slate-500 font-serif italic">
                  * આ વિગતો માત્ર ઓનલાઇન ચકાસણી હેતુ માટે છે. કોઈપણ કોર્ટ અથવા કાનૂની વિવાદ માટે પ્રમાણિત નકલ મેળવવી આવશ્યક છે.
                </div>
              </div>
            ) : (
              <div className="flex-1 p-6 overflow-auto bg-[#0a192f] text-slate-200 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {rawHtml ? JSON.stringify(rawHtml, null, 2) : "No raw JSON payload available."}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RIGHT HALF: Advocate Resolution Editor */}
      <div className="w-1/2 p-8 overflow-y-auto bg-[#F8F0E5] flex flex-col">
        <div className="mb-6 pb-4 border-b border-[#0F2C59]/10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#0F2C59] tracking-tight">Node Resolution</h1>
            <p className="text-sm text-[#7A5C2E] mt-1 font-medium">
              Verify title integrity for <strong className="text-[#0F2C59]">Survey {surveyId}</strong> before committing to ledger.
            </p>
          </div>
          <div className={`px-3 py-1 rounded-sm text-[11px] font-bold uppercase tracking-widest border shadow-sm ${task.image_file_path ? 'bg-indigo-50 text-indigo-800 border-indigo-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
            {task.image_file_path ? 'Phase 1: Historical OCR' : 'Phase 2: Digital Entry'}
          </div>
        </div>

        <div className="space-y-5 flex-1">
          {/* Survey Number and Entry Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
                Survey Number (સરવે નંબર)
              </label>
              <input 
                type="text" 
                value={formData.survey_numbers || surveyId} 
                onChange={(e) => handleChange("survey_numbers", e.target.value)} 
                className="w-full border-b-2 border-[#0F2C59]/20 px-4 py-2.5 bg-white outline-none focus:border-[#0F2C59] text-[#0F2C59] font-bold shadow-sm transition-colors" 
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Targeted to active searched parcel</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
                Entry Date (નોંધ તારીખ)
              </label>
              <input 
                type="text" 
                value={formData.entry_date || ""} 
                onChange={(e) => handleChange("entry_date", e.target.value)} 
                placeholder="DD/MM/YYYY"
                className="w-full border-b-2 border-[#0F2C59]/20 px-4 py-2.5 bg-white outline-none focus:border-[#0F2C59] text-[#0F2C59] font-medium shadow-sm transition-colors" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
              Transaction Type (ફેરફારનો પ્રકાર)
            </label>
            <input 
              type="text" 
              value={formData.transaction_type || ""} 
              onChange={(e) => handleChange("transaction_type", e.target.value)} 
              className="w-full border-b-2 border-[#0F2C59]/20 px-4 py-2.5 bg-white outline-none focus:border-[#0F2C59] text-[#0F2C59] font-medium shadow-sm transition-colors" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#7A5C2E] uppercase tracking-wider mb-2">
              Previous Owners / Relinquishing Parties (હક જતો કરનાર)
            </label>
            <textarea 
              rows={2} 
              value={Array.isArray(formData.previous_owners) ? formData.previous_owners.join(", ") : (formData.previous_owners || "")} 
              onChange={(e) => handleChange("previous_owners", e.target.value.split(",").map((s: string) => s.trim()))} 
              className="w-full border-l-4 border-[#7A5C2E] px-4 py-2.5 bg-white outline-none focus:ring-1 focus:ring-[#7A5C2E] text-[#0F2C59] shadow-sm resize-none transition-shadow" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-green-700 uppercase tracking-wider mb-2">
              New Owners / Acquiring Parties (હક મેળવનાર)
            </label>
            <textarea 
              rows={2} 
              value={Array.isArray(formData.new_owners) ? formData.new_owners.join(", ") : (formData.new_owners || "")} 
              onChange={(e) => handleChange("new_owners", e.target.value.split(",").map((s: string) => s.trim()))} 
              className="w-full border-l-4 border-green-700 px-4 py-2.5 bg-white outline-none focus:ring-1 focus:ring-green-700 text-[#0F2C59] shadow-sm resize-none transition-shadow" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">
              Summary & Legal Remarks (અધિકૃત વિગત)
            </label>
            <textarea 
              rows={3} 
              value={formData.remarks_summary || ""} 
              onChange={(e) => handleChange("remarks_summary", e.target.value)} 
              className="w-full border-b-2 border-[#0F2C59]/20 px-4 py-2.5 bg-white outline-none focus:border-[#0F2C59] text-[#0F2C59] font-medium shadow-sm resize-none transition-colors leading-relaxed" 
            />
          </div>
        </div>

        {/* Commitment Bar */}
        <div className="mt-6 pt-4 border-t border-[#0F2C59]/10 flex justify-between items-center">
          <span className="text-xs font-semibold text-[#7A5C2E]">
            Node {task.entry_number} for Survey {surveyId}
          </span>
          <button 
            onClick={handleApprove} 
            disabled={saving} 
            className="bg-[#0F2C59] hover:bg-[#1a407e] text-[#F8F0E5] font-bold py-3.5 px-8 shadow-lg disabled:opacity-50 flex items-center gap-3 uppercase tracking-widest text-sm rounded-sm transition-all"
          >
            {saving ? "Committing..." : "Commit Resolution"}
            {!saving && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
          </button>
        </div>
      </div>
    </div>
  );
}