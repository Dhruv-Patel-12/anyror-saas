import os
from pathlib import Path
from google import genai
from google.genai import types 
from dotenv import load_dotenv

# 🚨 UPDATED: Import PageExtraction instead of MutationEntryExtraction
from app.schemas.mutation_schema import PageExtraction 

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")
client = None
if api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as init_err:
        print(f"Warning: Could not initialize Gemini client: {init_err}")

async def extract_mutation_data(image_path: str) -> dict:
    if not client:
        print(f"Notice: GEMINI_API_KEY not set or client unavailable. Skipping AI OCR for {image_path}")
        return {"entries": [], "warning": "AI OCR skipped (no API key)"}

    prompt = """
    You are an expert legal data extraction engine specializing in historical Gujarati land records (AnyRoR mutation entries). 
    Your sole function is to read the provided image of a handwritten land mutation page and extract all facts into a strict JSON format.

    CRITICAL RULES:
    1. LIST FORMATTING (MANDATORY): You MUST separate multiple names and multiple survey numbers with a comma and a space. DO NOT merge names together. Example: "રતુભાઈ, જેસંગભાઈ, ગોપાલભાઈ".
    2. GUJARATI DIGITS: Be extremely careful reading handwritten Gujarati numbers. Pay close attention to the difference between ૬ (6), ૯ (9), ૭ (7), and ૧ (1).
    3. TRANSLITERATION: Keep all names, survey numbers, and locations in native Gujarati script.
    4. NO HALLUCINATIONS: If a field is unreadable due to faded ink, output null for that field and flag it in 'low_confidence_flags'.
    5. TRANSACTION TYPE: Identify the core legal event (e.g., વારસાઈ, વેચાણ, બોજો, ગણોતિયા).
    6. NODE EXTRACTION: 'previous_owners' are the people giving up rights (sellers, deceased). 'new_owners' are the entities gaining rights (buyers, heirs, banks).
    7. REMARKS: Provide a single sentence in English summarizing the legal event.
    
    Focus on extracting all mutation entries visible on the page.
    """
    
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    try:
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
        response = await client.aio.models.generate_content(
            model=model_name,
            contents=[
                prompt, 
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg") 
            ],
            config={
                "response_mime_type": "application/json",
                "response_schema": PageExtraction,
                "temperature": 0.1, 
            }
        )
        
        return response.parsed.model_dump()
        
    except Exception as e:
        print(f"OCR Failed for {image_path}: {e}")
        return {"entries": [], "error": "OCR extraction failed", "details": str(e)}