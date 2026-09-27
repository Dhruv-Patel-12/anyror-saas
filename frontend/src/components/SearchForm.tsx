"use client";

import { useState } from "react";
import { scrapeLandRecord } from "../lib/api";
import Link from "next/link";
import ParcelDossier from "./ParcelDossier"; // 🚨 NEW IMPORT
import TitleNodeLogo from "./TitleNodeLogo";

// MVP Hardcoded Data from AnyROR HTML
const BAVLA_VILLAGES = [
  { code: "007", name: "અમીપુરા - 007" }, { code: "045", name: "આદરોડા - 045" },
  { code: "005", name: "કેરાલા - 005" }, { code: "023", name: "કલ્યાણગઢ - 023" },
  { code: "017", name: "કવલા - 017" }, { code: "032", name: "કેસરડી - 032" },
  { code: "015", name: "કાણોતર - 015" }, { code: "018", name: "કાલીવેજી - 018" },
  { code: "038", name: "કાવીઠા - 038" }, { code: "025", name: "કોચરીયા - 025" },
  { code: "003", name: "ગુંદાનાપરા - 003" }, { code: "042", name: "ગાંગડ - 042" },
  { code: "030", name: "ચિયાડા - 030" }, { code: "031", name: "છબાસર - 031" },
  { code: "021", name: "જુવાલ-રૂપાવટી - 021" }, { code: "006", name: "ઝેકડા - 006" },
  { code: "016", name: "ઢેઢાલ - 016" }, { code: "027", name: "દુમાલી - 027" },
  { code: "008", name: "દુર્ગી - 008" }, { code: "014", name: "દેવ ધોલેરા - 014" },
  { code: "026", name: "દેવડથલ - 026" }, { code: "033", name: "દહેગામડા - 033" },
  { code: "053", name: "ધનવાડા - 053" }, { code: "052", name: "ધીંગડા - 052" },
  { code: "041", name: "નાનોદરા - 041" }, { code: "040", name: "બગોદરા - 040" },
  { code: "013", name: "બલદાણા - 013" }, { code: "044", name: "બાવળા - 044" },
  { code: "024", name: "ભામસરા - 024" }, { code: "034", name: "ભાયલા - 034" },
  { code: "035", name: "મૈટાલ - 035" }, { code: "009", name: "મેણી - 009" },
  { code: "051", name: "મેમર - 051" }, { code: "039", name: "મીઠાપુર - 039" },
  { code: "037", name: "રજોડા - 037" }, { code: "029", name: "રુપાલ - 029" },
  { code: "019", name: "રાણેસર - 019" }, { code: "022", name: "રાશમ - 022" },
  { code: "036", name: "રોહિકા - 036" }, { code: "012", name: "લગદાણા - 012" },
  { code: "004", name: "વાસણા (ના) - 004" }, { code: "060", name: "વાસણા ઢેઢાલ - 060" },
  { code: "043", name: "શિયાળ - 043" }, { code: "002", name: "સરલા - 002" },
  { code: "028", name: "સાંકોડ - 028" }, { code: "020", name: "સાકોદરા - 020" },
  { code: "010", name: "સાલજડા - 010" }, { code: "001", name: "હસનનગર - 001" }
];

const HASANNAGAR_SURVEYS = [
  "2","3","4","6","7","8","9","10","11","12","13","14","15","16","17","19","20",
  "21","22","23","24","25","26","27","28","29","31","32","33","34","35","36","37",
  "38","39","40","41","42","43","44","45","46","47","48","49","50","51","52","53",
  "54","55","56","57","58","59","60","61","62","63","64","65","66","67","69","70",
  "71","72","73","74","75","76","77","78","79","80","81","82","83","84","85","86",
  "87","88","89","90","91","92","94","95","96","97","98","99","100","101","102",
  "103","104","105","106","107","108","109","110","111","112","113","114","116",
  "118","119","120","121","122","123","124","125","126","127","128","129","130",
  "131","132","133","134","135","136","137","138","139","140","141","142","143",
  "144","145","146","147","148","149","150","151","153","154","155","156","157",
  "158","159","160","161","162","163","164","165","166","167","168","169","170",
  "171","172","173","174","175","176","177","178","179","180","181","182","183",
  "184","185","186","187","188","189","190","191","192","193","194","195","196",
  "197","198","199","200","201","202","203","204","205","206","207","208","209",
  "210","211","212","213","214","215","216","217","218","219","221","222"
];

export default function SearchForm() {
  const [district, setDistrict] = useState("07");
  const [taluka, setTaluka] = useState("08");
  const [village, setVillage] = useState("001");
  const [survey, setSurvey] = useState("2");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecord(null);

    try {
      const data = await scrapeLandRecord(district, taluka, village, survey);
      setRecord(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while fetching the record.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F0E5] font-sans">
      <div className="max-w-7xl mx-auto p-4 md:p-8 relative">
        
        {/* Navigation Button to the Advocate Portal */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8">
          <Link 
            href="/advocate" 
            className="bg-white border border-[#0F2C59]/20 hover:border-[#0F2C59] text-[#0F2C59] font-bold py-2 px-4 rounded-sm shadow-sm flex items-center gap-2 transition-all uppercase tracking-widest text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="hidden sm:inline">Advocate Portal</span>
          </Link>
        </div>

        {/* HEADER - TitleNode Official Branding */}
        <div className="text-center mb-12 mt-12">
          <TitleNodeLogo mode="light" variant="full" size="lg" />
        </div>

        {/* SEARCH FORM */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#0F2C59]/10 rounded-sm shadow-sm p-6 mb-8 flex flex-wrap items-end gap-4">
          
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">District</label>
            <select 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-white focus:border-[#0F2C59] outline-none text-[#0F2C59] transition-colors shadow-sm"
            >
              <option value="07">અમદાવાદ (Ahmedabad)</option>
            </select>
          </div>
          
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">Taluka</label>
            <select 
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-white focus:border-[#0F2C59] outline-none text-[#0F2C59] transition-colors shadow-sm"
            >
              <option value="08">બાવળા (Bavla)</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">Village</label>
            <select 
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-white focus:border-[#0F2C59] outline-none text-[#0F2C59] transition-colors shadow-sm cursor-pointer"
            >
              <option value="0">Select...</option>
              {BAVLA_VILLAGES.map((v) => (
                <option key={v.code} value={v.code}>{v.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-[#0F2C59] uppercase tracking-wider mb-2">Survey No.</label>
            {village === "001" ? (
              <select 
                value={survey}
                onChange={(e) => setSurvey(e.target.value)}
                className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-white focus:border-[#0F2C59] outline-none text-[#0F2C59] transition-colors shadow-sm cursor-pointer"
              >
                <option value="-1">Select...</option>
                {HASANNAGAR_SURVEYS.map((sno) => (
                  <option key={sno} value={sno}>{sno}</option>
                ))}
              </select>
            ) : (
              <input 
                type="text" 
                value={survey}
                onChange={(e) => setSurvey(e.target.value)}
                className="w-full border-b-2 border-[#0F2C59]/20 px-3 py-2 bg-white focus:border-[#0F2C59] outline-none text-[#0F2C59] transition-colors shadow-sm"
                placeholder="e.g. 3"
                required
              />
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#0F2C59] hover:bg-[#1a407e] text-[#F8F0E5] font-bold py-2 px-8 rounded-sm shadow-md transition-all h-[42px] min-w-[160px] flex items-center justify-center disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-[#DAC0A3]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Querying...
              </span>
            ) : (
              "Generate Dossier"
            )}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-700 text-red-900 px-4 py-3 rounded-sm mb-8 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-sm">{error}</span>
          </div>
        )}

        {/* DOSSIER INJECTION ZONE */}
        {record && record.data && (
        <ParcelDossier data={record.data} />
      )}
      </div>
    </div>
  );
}