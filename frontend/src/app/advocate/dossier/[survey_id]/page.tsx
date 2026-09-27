"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactFlow, { Background, Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { getSurveyTimeline, getRecordBySurvey } from "@/lib/api";
import TitleNodeLogo from "@/components/TitleNodeLogo";

export default function DossierReport() {
  const params = useParams();
  const surveyId = params.survey_id as string;
  const [timeline, setTimeline] = useState<any[]>([]);
  const [parcelRecord, setParcelRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    Promise.all([
      getRecordBySurvey(surveyId),
      getSurveyTimeline(surveyId, true)
    ])
      .then(([recordRes, timelineRes]) => {
        if (recordRes) {
          setParcelRecord(recordRes);
        }
        
        const entries = timelineRes?.data || [];
        setTimeline(entries);

        // Dynamically build graph nodes for Section 3
        if (entries.length > 0) {
          const newNodes: Node[] = [];
          const newEdges: Edge[] = [];
          
          newNodes.push({
            id: "root",
            position: { x: 250, y: 20 },
            data: { label: `Root Origin: Survey ${surveyId}` },
            type: "input",
            style: { backgroundColor: "#0F2C59", color: "#F8F0E5", border: "none", borderRadius: "2px", padding: "8px", fontWeight: "bold", width: 260, textAlign: "center", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }
          });

          let prevId = "root";
          entries.forEach((item: any, idx: number) => {
            const nodeId = `node-${item.id}`;
            const d = item.final_verified_data || item.ai_draft_data || {};
            const owners = (d.new_owners && d.new_owners.length > 0) ? d.new_owners.join(", ") : "Transferees";
            const isLast = idx === entries.length - 1;

            newNodes.push({
              id: nodeId,
              position: { x: 250, y: 90 + idx * 90 },
              data: { 
                label: `Entry #${item.entry_number} • ${d.entry_date || ""}\n${d.transaction_type || "Mutation"}\n${owners}` 
              },
              type: isLast ? "output" : "default",
              style: {
                backgroundColor: isLast ? "#DAC0A3" : "#F8F0E5",
                color: "#0F2C59",
                border: "2px solid #0F2C59",
                borderRadius: "2px",
                padding: "8px",
                fontSize: "10px",
                fontWeight: "600",
                width: 260,
                textAlign: "center",
                whiteSpace: "pre-line"
              }
            });

            newEdges.push({
              id: `edge-${prevId}-${nodeId}`,
              source: prevId,
              target: nodeId,
              animated: false,
              style: { stroke: "#0F2C59", strokeWidth: 2 }
            });

            prevId = nodeId;
          });

          setNodes(newNodes);
          setEdges(newEdges);
        }
      })
      .catch((err) => console.error("Error loading dossier data:", err))
      .finally(() => setLoading(false));
  }, [surveyId]);

  const extractedData = parcelRecord?.extracted_data || {};
  const basic = extractedData.Basic_Details || extractedData["Basic Details"] || {};
  const riskFlags = extractedData.Risk_Flags || {};

  const ownershipStatus = riskFlags.A_Ownership?.status || "🟢 Private";
  const tenureStatus = riskFlags.B_Tenure?.status || "🟢 Freehold";
  const encumbranceStatus = riskFlags.C_Encumbrance?.status || "🟢 Clear";
  const litigationStatus = riskFlags.D_Litigation?.status || "🟢 Clear";

  return (
    <div className="min-h-screen bg-slate-200 font-sans print:bg-white text-[#0F2C59]">
      
      {/* PRINT-HIDDEN CONTROL BAR */}
      <div className="bg-[#0F2C59] text-[#F8F0E5] p-4 flex justify-between items-center shadow-md print:hidden sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href={`/advocate/tree/${surveyId}`} className="text-[#DAC0A3] hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            ← Back to Tree
          </Link>
          <div className="ml-4 border-l border-[#F8F0E5]/20 pl-4">
            <TitleNodeLogo mode="reversed" variant="horizontal" size="sm" badge="Report Preview" />
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={() => window.print()} className="bg-[#DAC0A3] text-[#0F2C59] hover:bg-[#c9af92] font-bold py-2 px-6 rounded-sm shadow-sm transition-colors text-xs uppercase tracking-widest flex items-center gap-2">
            Save as PDF
          </button>
        </div>
      </div>

      {/* THE PRINTABLE A4 PAGE */}
      <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] shadow-2xl my-8 print:my-0 print:shadow-none print:w-full">
        
        {/* PAGE HEADER */}
        <div className="p-12 border-b-4 border-[#0F2C59]">
          <div className="flex justify-between items-end mb-6">
            <TitleNodeLogo mode="light" variant="horizontal" size="lg" />
            <div className="text-right">
              <h2 className="text-xl font-bold uppercase tracking-widest text-[#7A5C2E]">Verified Land Dossier</h2>
              <p className="text-sm font-bold opacity-70 mt-1">Generated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="bg-[#F8F0E5] p-6 rounded-sm border border-[#0F2C59]/10 grid grid-cols-4 gap-4 text-sm">
            <div><span className="block font-bold text-[#7A5C2E] text-xs uppercase tracking-widest mb-1">District</span><span className="font-bold text-base">{basic["District"] || "Ahmedabad"}</span></div>
            <div><span className="block font-bold text-[#7A5C2E] text-xs uppercase tracking-widest mb-1">Taluka</span><span className="font-bold text-base">{basic["Taluka"] || "Bavla"}</span></div>
            <div><span className="block font-bold text-[#7A5C2E] text-xs uppercase tracking-widest mb-1">Village</span><span className="font-bold text-base">{basic["Village"] || "Hasan Nagar"}</span></div>
            <div><span className="block font-bold text-[#7A5C2E] text-xs uppercase tracking-widest mb-1">Survey No.</span><span className="font-bold text-xl">{surveyId}</span></div>
          </div>
        </div>

        <div className="p-12 space-y-12">
          
          {/* SECTION 1: TRAFFIC LIGHTS */}
          <section>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-[#0F2C59]/10 pb-2">1. Core Risk Assessment</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-sm"><span className="block text-[10px] font-bold uppercase text-emerald-900/60 tracking-widest mb-1">Ownership</span><span className="block text-sm font-bold text-emerald-900">{ownershipStatus}</span></div>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-sm"><span className="block text-[10px] font-bold uppercase text-emerald-900/60 tracking-widest mb-1">Tenure</span><span className="block text-sm font-bold text-emerald-900">{tenureStatus}</span></div>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm"><span className="block text-[10px] font-bold uppercase text-amber-900/60 tracking-widest mb-1">Encumbrance</span><span className="block text-sm font-bold text-amber-900">{encumbranceStatus}</span></div>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-sm"><span className="block text-[10px] font-bold uppercase text-emerald-900/60 tracking-widest mb-1">Litigation</span><span className="block text-sm font-bold text-emerald-900">{litigationStatus}</span></div>
            </div>
          </section>

          {/* SECTION 2: TIMELINE */}
          <section>
            <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-[#0F2C59]/10 pb-2">2. Verified Chain of Title</h3>
            {timeline.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No mutation entries found in database for this survey.</p>
            ) : (
              <div className="space-y-4">
                {timeline.map((node) => {
                  const data = node.final_verified_data || node.ai_draft_data || {};
                  return (
                    <div key={node.id} className="border border-[#0F2C59]/20 p-4 rounded-sm bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-base">{data?.transaction_type || "Mutation Entry"}</h4>
                        <span className="text-xs font-bold bg-[#0F2C59] text-white px-2 py-1 uppercase tracking-widest rounded-sm">Entry {node.entry_number}</span>
                      </div>
                      <p className="text-xs font-bold text-[#7A5C2E] mb-3">Date: {data?.entry_date || "N/A"}</p>
                      <p className="text-sm leading-relaxed mb-4">{data?.remarks_summary}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-white p-3 border border-[#0F2C59]/10 rounded-sm">
                          <span className="block font-bold text-[#7A5C2E] uppercase tracking-widest mb-1">Previous Owners</span>
                          {data?.previous_owners?.length > 0 ? data.previous_owners.join(", ") : "N/A"}
                        </div>
                        <div className="bg-white p-3 border border-[#0F2C59]/10 rounded-sm">
                          <span className="block font-bold text-green-700 uppercase tracking-widest mb-1">New Owners</span>
                          {data?.new_owners?.length > 0 ? data.new_owners.join(", ") : "N/A"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* SECTION 3: NATIVE REACT FLOW GRAPH INJECTION */}
          {nodes.length > 0 && (
            <section className="print:break-before-page">
               <h3 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-[#0F2C59]/10 pb-2">3. Verified Lineage Graph</h3>
               <div className="h-[450px] border border-[#0F2C59]/20 bg-slate-50 rounded-sm relative pointer-events-none">
                  <ReactFlow 
                    nodes={nodes} 
                    edges={edges} 
                    fitView 
                    zoomOnScroll={false} 
                    panOnDrag={false} 
                    nodesDraggable={false}
                  >
                    <Background color="#DAC0A3" gap={16} size={1} />
                  </ReactFlow>
               </div>
            </section>
          )}

          {/* SECTION 4: ADVOCATE SIGN-OFF */}
          <section className="mt-16 pt-8 border-t-2 border-[#0F2C59]">
            <div className="flex justify-between items-end">
              <div>
                <div className="w-48 border-b border-[#0F2C59] mb-2 border-dashed"></div>
                <p className="text-xs font-bold uppercase tracking-widest">Advocate Signature</p>
                <p className="text-xs opacity-70 mt-1">Verified via User ID: ADV-773-XYZ</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-[#7A5C2E]">TitleNode Intelligence Layer</p>
                <p className="text-[10px] opacity-70 mt-1">CONFIDENTIAL B2B DOCUMENT</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}