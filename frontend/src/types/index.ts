export interface ExtractedData {
    [tableKey: string]: {
        [rowKey: string]: string;
    };
}

export interface LandRecord {
    id: number;
    district: string;
    taluka: string;
    village: string;
    survey_no: string;
    extracted_data: ExtractedData;
    pdf_path: string | null;
    fetched_at: string;
}

export interface ApiResponse {
    success: boolean;
    data: LandRecord;
}

export interface ApiError {
    detail: string;
}