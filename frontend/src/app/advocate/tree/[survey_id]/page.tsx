"use client";
import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactFlow, { 
  Background, Controls, MiniMap, applyNodeChanges, applyEdgeChanges,
  Node, Edge, NodeChange, EdgeChange
} from "reactflow";
import "reactflow/dist/style.css";
import TitleNodeLogo from "@/components/TitleNodeLogo";
import { getSurveyTimeline, reopenMutation, BACKEND_HOST } from "@/lib/api";

export default function TreeEditor() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.survey_id as string;
  
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const loadTreeData = async () => {
    setLoading(true);
    try {
      const res = await getSurveyTimeline(surveyId, true);
      const entries = res?.data || [];
      setTimeline(entries);

      if (entries.length === 0) {
        setNodes([{
          id: "root",
          position: { x: 250, y: 50 },
          data: { label: `Survey ${surveyId}\nAwaiting verified entries` },
          style: { backgroundColor: "#0F2C59", color: "#F8F0E5", borderRadius: "4px", padding: "12px", width: 280, textAlign: "center" }
        }]);
        setEdges([]);
      } else {
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        
        // Root Node
        newNodes.push({
          id: "root",
          position: { x: 250, y: 30 },
          data: { label: `Root Origin: Survey ${surveyId}` },
          type: "input",
          style: { backgroundColor: "#0F2C59", color: "#F8F0E5", border: "none", borderRadius: "3px", padding: "10px", fontWeight: "bold", width: 280, textAlign: "center", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px" }
        });

        let prevNodeId = "root";
        entries.forEach((item: any, idx: number) => {
          const nodeId = `node-${item.id}`;
          const d = item.final_verified_data || item.ai_draft_data || {};
          const owners = (d.new_owners && d.new_owners.length > 0) ? d.new_owners.join(", ") : "Transferees";
          const transType = d.transaction_type || "Mutation";
          const isLast = idx === entries.length - 1;

          newNodes.push({
            id: nodeId,
            position: { x: 250, y: 120 + idx * 115 },
            data: { 
              label: `Entry #${item.entry_number} • ${d.entry_date || "Date N/A"}\n${transType}\nOwners: ${owners}` 
            },
            type: isLast ? "output" : "default",
            style: {
              backgroundColor: isLast ? "#DAC0A3" : "#FFFFFF",
              color: "#0F2C59",
              border: item.is_verified ? "2px solid #0F2C59" : "2px dashed #B45309",
              borderRadius: "3px",
              padding: "10px",
              fontSize: "11px",
              fontWeight: "600",
              width: 280,
              textAlign: "center",
              whiteSpace: "pre-line",
              boxShadow: "0 2px 4px rgba(0,0,0,0.06)"
            }
          });

          newEdges.push({
            id: `edge-${prevNodeId}-${nodeId}`,
            source: prevNodeId,
            target: nodeId,
            animated: !item.is_verified,
            style: { stroke: "#0F2C59", strokeWidth: 2 }
          });

          prevNodeId = nodeId;
        });

        setNodes(newNodes);
        setEdges(newEdges);
      }
    } catch (err) {
      console.error("Error loading survey timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTreeData();
  }, [surveyId]);

  const handleReopen = async (id: number) => {
    if (confirm("Send this record back to the active verification queue?")) {
      try {
        await reopenMutation(id);
        router.push(`/advocate/review/${surveyId}`);
      } catch (err) {
        console.error("Error reopening mutation:", err);
        alert("Failed to reopen mutation.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F0E5] font-sans flex-col overflow-hidden print:bg-white print:h-auto">
      
      {/* HEADER */}
      <div className="bg-[#0F2C59] text-[#F8F0E5] p-4 flex justify-between items-center shadow-md z-10 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/advocate" className="text-[#DAC0A3] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div className="border-l border-[#F8F0E5]/20 pl-4">
            <TitleNodeLogo mode="reversed" variant="horizontal" size="sm" badge={`Survey ${surveyId}`} />
          </div>
        </div>
        <Link href={`/advocate/dossier/${surveyId}`} className="bg-[#F8F0E5] text-[#0F2C59] hover:bg-white font-bold py-2 px-6 rounded-sm shadow-sm transition-colors text-xs uppercase tracking-widest flex items-center gap-2">
          Preview & Export Dossier →
        </Link>
      </div>

      <div className="flex-1 flex overflow-hidden print:overflow-visible print:block min-h-0">
        
        {/* LEFT SIDE: TIMELINE */}
        <div className="w-1/3 bg-white border-r border-[#0F2C59]/10 p-6 overflow-y-auto shadow-inner print:w-full print:border-none print:shadow-none">
          <div className="flex justify-between items-center mb-6 border-b-2 border-[#0F2C59]/10 pb-2">
             <h2 className="text-[#0F2C59] font-bold uppercase tracking-widest text-sm">Verified Timeline ({timeline.length} Entries)</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-10 text-[#0F2C59] font-bold text-sm">Loading lineage from database...</div>
          ) : timeline.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">No entries recorded for this survey yet.</div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-[#0F2C59]/10">
              {timeline.map((node, index) => {
                const data = node.final_verified_data || node.ai_draft_data;
                const sourceUrl = node.source_image_url 
                  ? (node.source_image_url.startsWith("http") ? node.source_image_url : `${BACKEND_HOST}${node.source_image_url}`)
                  : null;

                return (
                  <div key={node.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-[#0F2C59] text-[#DAC0A3] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-xs">
                      {index + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 border border-[#0F2C59]/20 p-4 rounded-sm shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A5C2E] bg-[#DAC0A3]/20 px-2 py-1 rounded-sm">Entry {node.entry_number}</span>
                        <time className="text-xs font-bold text-[#0F2C59] opacity-60">{data?.entry_date}</time>
                      </div>
                      <h3 className="font-bold text-[#0F2C59] text-sm mb-2">{data?.transaction_type}</h3>
                      <div className="text-xs text-[#0F2C59] mb-3 opacity-90 leading-relaxed">
                        {data?.remarks_summary}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#0F2C59]/10 print:hidden">
                        {sourceUrl && (
                          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-[#0F2C59] hover:bg-[#0F2C59]/10 border border-[#0F2C59]/20 px-2 py-1 uppercase tracking-widest transition-colors rounded-sm flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Source Scan
                          </a>
                        )}
                        <button onClick={() => handleReopen(node.id)} className="text-[10px] font-bold text-red-700 hover:text-white hover:bg-red-700 border border-red-700 px-2 py-1 uppercase tracking-widest transition-colors rounded-sm">
                          Edit
                        </button>
                      </div>
                      
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT SIDE: INTERACTIVE CANVAS & TRAFFIC LIGHTS */}
        <div className="w-2/3 bg-[#F8F0E5] relative print:hidden h-full min-h-[600px] flex flex-col min-h-0">
          
          <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
            <h2 className="text-[#0F2C59] font-bold uppercase tracking-widest bg-white/90 px-4 py-2 rounded-sm border border-[#0F2C59]/10 backdrop-blur-sm shadow-sm pointer-events-auto inline-block text-xs">
              Lineage Dependency Graph
            </h2>
          </div>
          
          {/* React Flow Canvas */}
          <div className="w-full flex-1 border-l border-[#0F2C59]/10 relative h-[calc(100vh-70px)] min-h-[600px]" style={{ width: '100%', height: 'calc(100vh - 70px)', minHeight: '600px' }}>
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView attributionPosition="bottom-right">
              <Background color="#DAC0A3" gap={16} size={1} />
              <Controls className="bg-white border-[#0F2C59]/20 fill-[#0F2C59] mb-4 mr-4" />
              <MiniMap nodeColor="#0F2C59" maskColor="rgba(248, 240, 229, 0.8)" className="bg-white border border-[#0F2C59]/20" />
            </ReactFlow>
          </div>
        </div>

      </div>
    </div>
  );
}