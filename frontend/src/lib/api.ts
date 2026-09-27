export const BACKEND_HOST = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const BASE_URL = `${BACKEND_HOST}/api/v1`;

// 1. Live AnyRoR Scrape or Fast DB Retrieval
export async function scrapeLandRecord(district: string, taluka: string, village: string, survey: string) {
  const res = await fetch(`${BASE_URL}/records/scrape`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ district, taluka, village, survey }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.detail || "Scraping failed");
    } catch {
      throw new Error(errorText || "Failed to fetch land record");
    }
  }
  return res.json();
}

// 2. Fetch Parent Land Record by Survey Number
export async function getRecordBySurvey(surveyNo: string) {
  const res = await fetch(`${BASE_URL}/records/survey/${surveyNo}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch parcel details");
  }
  return res.json();
}

// 3. Fetch All Processed Parcels in a Village (for Developer Rollup Grid)
export async function getRecordsByVillage(villageCode: string) {
  const res = await fetch(`${BASE_URL}/records/village/${villageCode}`);
  if (!res.ok) throw new Error("Failed to fetch village rollup");
  return res.json();
}

// 4. Fetch Next Unverified Mutation Entry for Advocate Review
export async function getUnverifiedMutation(surveyNo?: string) {
  const url = surveyNo 
    ? `${BASE_URL}/mutations/unverified?survey_no=${surveyNo}` 
    : `${BASE_URL}/mutations/unverified`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch unverified mutation");
  return res.json();
}

// 5. Submit Advocate Verification & Corrections
export async function verifyMutation(id: number, finalData: any) {
  const res = await fetch(`${BASE_URL}/mutations/${id}/verify`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ final_verified_data: finalData }),
  });
  if (!res.ok) throw new Error("Failed to verify mutation");
  return res.json();
}

// 6. Fetch Live Dashboard Stats (Active Cases, Closed Cases, Verified Count)
export async function getDashboardStats() {
  const res = await fetch(`${BASE_URL}/mutations/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

// 7. Fetch Chronological Timeline for a Survey
export async function getSurveyTimeline(surveyNo: string, includeUnverified: boolean = false) {
  const url = `${BASE_URL}/mutations/survey/${surveyNo}/timeline${includeUnverified ? "?include_unverified=true" : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  return res.json();
}

// 8. Reopen a Verified Mutation (Sends it back to the Advocate Queue)
export async function reopenMutation(id: number) {
  const res = await fetch(`${BASE_URL}/mutations/${id}/reopen`, { 
    method: "PATCH" 
  });
  if (!res.ok) throw new Error("Failed to reopen mutation");
  return res.json();
}

// 9. Upload Portfolio Batch CSV
export async function uploadPortfolioCsv(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/portfolio/upload-csv`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "CSV upload failed");
  }
  return res.json();
}