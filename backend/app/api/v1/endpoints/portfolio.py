from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
import csv
import io
import asyncio
from typing import List

router = APIRouter()

from app.db.session import AsyncSessionLocal
from app.services.record_service import scrape_and_save_record

# The Background Worker
async def process_portfolio_batch(rows: List[dict]):
    """
    Quietly processes parcels in the background with human delays to avoid IP rate limits.
    """
    for row in rows:
        survey_no = row.get("Survey No.") or row.get("Survey No") or row.get("survey_no")
        village_code = row.get("Village Code") or row.get("village_code") or "001"
        dist = row.get("District") or row.get("district") or "07"
        tal = row.get("Taluka") or row.get("taluka") or "08"

        if not survey_no:
            continue

        print(f"Scraping Survey {survey_no} in Village {village_code}...")
        try:
            async with AsyncSessionLocal() as db:
                await scrape_and_save_record(
                    db=db,
                    district=dist,
                    taluka=tal,
                    village=village_code,
                    survey=str(survey_no)
                )
            print(f"✅ Successfully processed Survey {survey_no}")
        except Exception as err:
            print(f"⚠️ Error processing Survey {survey_no}: {err}")
            
        # Delay between scrapes to avoid triggering rate-limiting WAFs
        await asyncio.sleep(10)

@router.post("/upload-csv")
async def upload_portfolio_csv(
    background_tasks: BackgroundTasks, 
    file: UploadFile = File(...)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    
    # Read and parse the CSV in memory
    contents = await file.read()
    decoded = contents.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(decoded))
    
    rows = [row for row in csv_reader]
    
    if len(rows) > 500:
        raise HTTPException(status_code=400, detail="Batch limit exceeded. Max 500 parcels per upload.")

    # Hand the heavy lifting off to the background worker
    background_tasks.add_task(process_portfolio_batch, rows)
    
    return {
        "status": "success", 
        "message": f"Successfully queued {len(rows)} parcels for asynchronous processing.",
        "estimated_completion_time": f"{len(rows) * 12 / 60} minutes"
    }