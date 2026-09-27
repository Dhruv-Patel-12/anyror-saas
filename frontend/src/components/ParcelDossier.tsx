"use client";

export default function ParcelDossier({ data }: { data: any }) {
  const riskFlags = data["Risk_Flags"] || {};
  const dues = data["Outstanding_Dues"] || {};

  return (
    <div className="mt-12 animate-fade-in pb-20">
      
      {/* DOSSIER HEADER */}
      <div className="mb-8 border-b-2 border-[#0F2C59]/10 pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-[#0F2C59] tracking-tight">Parcel Dossier</h2>
          <p className="text-[#7A5C2E] font-medium mt-1">Verified Structural Intelligence Report</p>
        </div>
        <button className="text-[#0F2C59] border border-[#0F2C59]/20 hover:bg-[#0F2C59] hover:text-[#F8F0E5] px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          Share Report
        </button>
      </div>

      {/* SECTION 1: MASTER TRAFFIC LIGHTS */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-[#0F2C59] uppercase tracking-wider mb-4">Core Risk Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Object.entries(riskFlags)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) // Force A, B, C, D order
            .map(([flagKey, flagData]: [string, any]) => {
              
              // Map your backend colors to the enterprise UI
              const themeMap: Record<string, string> = {
                green: "bg-emerald-50 border-emerald-200 text-emerald-900",
                yellow: "bg-amber-50 border-amber-200 text-amber-900",
                red: "bg-rose-50 border-rose-200 text-rose-900",
                gray: "bg-slate-50 border-slate-200 text-slate-800"
              };
              const theme = themeMap[flagData.color] || themeMap.gray;

              return (
                <div key={flagKey} className={`p-5 rounded-sm border shadow-sm ${theme}`}>
                  <span className="block text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                    {flagKey.replace(/_/g, ' ')}
                  </span>
                  <span className="block text-xl font-bold mb-1 tracking-tight">
                    {flagData.status}
                  </span>
                  <span className="block text-sm opacity-80 leading-snug mt-2">
                    {flagData.reason}
                  </span>
                </div>
              );
          })}
        </div>
      </div>

      {/* SECTION 2: MUNICIPAL DUES */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-[#0F2C59] uppercase tracking-wider mb-4">Municipal & Utility Dues</h3>
        <div className="bg-white border border-[#0F2C59]/10 rounded-sm shadow-sm p-2 w-full md:w-1/2">
          {Object.entries(dues).map(([dueKey, dueData]: [string, any]) => (
            <div key={dueKey} className="flex justify-between items-center border-b border-[#0F2C59]/5 last:border-0 p-3">
              <span className="font-semibold text-[#0F2C59]">{dueKey}</span>
              <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${dueData.color}`}>
                {dueData.icon} {dueData.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: MUTATION TIMELINE (Coming Next) */}
      <div>
        <h3 className="text-lg font-bold text-[#0F2C59] uppercase tracking-wider mb-4 border-b border-[#0F2C59]/10 pb-2">Verified Chain of Title</h3>
        <div className="bg-slate-50 border border-dashed border-slate-300 p-8 text-center rounded-sm">
          <p className="text-slate-500 font-medium">Timeline module goes here. Awaiting API connection...</p>
        </div>
      </div>

    </div>
  );
}