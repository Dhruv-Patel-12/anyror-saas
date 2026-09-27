from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import Dict, Any

from app.db.session import get_db
from app.db.models import MutationEntry, LandRecord

from datetime import datetime

router = APIRouter()

# 1. Fetch Next Unverified Node (Supports filtering by Survey No)
@router.get("/unverified")
async def get_unverified_mutation(survey_no: str = None, db: AsyncSession = Depends(get_db)):
    query = select(MutationEntry, LandRecord.survey_no).join(LandRecord).filter(MutationEntry.is_verified == False)
    
    if survey_no:
        query = query.filter(LandRecord.survey_no == str(survey_no))

    # Mathematically force OCR Images to load before Digital HTML Text
    query = query.order_by(MutationEntry.image_file_path.is_(None), MutationEntry.id.asc())

    result = await db.execute(query)
    row = result.first()
    
    if not row:
        return {"data": None}
        
    entry, s_no = row
    return {
        "data": {
            "id": entry.id,
            "land_record_id": entry.land_record_id,
            "survey_no": s_no,
            "entry_number": entry.entry_number,
            "image_file_path": entry.image_file_path,
            "scraped_html_text": entry.scraped_html_text,
            "ai_draft_data": entry.ai_draft_data,
            "final_verified_data": entry.final_verified_data,
            "is_verified": entry.is_verified
        }
    }

# 2. Commit Resolution (Verify)
@router.patch("/{entry_id}/verify")
async def verify_mutation(entry_id: int, payload: Dict[str, Any], db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MutationEntry).filter(MutationEntry.id == entry_id))
    entry = result.scalars().first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
        
    entry.is_verified = True
    entry.verified_at = datetime.utcnow()
    entry.final_verified_data = payload.get("final_verified_data", {})
    await db.commit()
    return {"status": "success", "id": entry.id}

# 3. Reopen Node (Send back to queue for re-editing)
@router.patch("/{entry_id}/reopen")
async def reopen_mutation(entry_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MutationEntry).filter(MutationEntry.id == entry_id))
    entry = result.scalars().first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
        
    entry.is_verified = False # Kicks it back to the Advocate queue!
    entry.verified_at = None
    await db.commit()
    return {"status": "reopened", "id": entry.id}

# 4. Fetch Timeline for Final Report & Graph
@router.get("/survey/{survey_no}/timeline")
async def get_survey_timeline(survey_no: str, include_unverified: bool = False, db: AsyncSession = Depends(get_db)):
    query = select(MutationEntry).join(LandRecord).filter(
        LandRecord.survey_no == str(survey_no)
    )
    if not include_unverified:
        query = query.filter(MutationEntry.is_verified == True)
        
    query = query.order_by(MutationEntry.id.asc())
    
    result = await db.execute(query)
    entries = result.scalars().all()
    
    formatted = []
    for e in entries:
        formatted.append({
            "id": e.id,
            "land_record_id": e.land_record_id,
            "entry_number": e.entry_number,
            "source_image_url": e.image_file_path,
            "scraped_html_text": e.scraped_html_text,
            "ai_draft_data": e.ai_draft_data,
            "final_verified_data": e.final_verified_data or e.ai_draft_data,
            "is_verified": e.is_verified,
            "verified_at": e.verified_at.isoformat() if e.verified_at else None
        })
        
    return {"data": formatted}

# 5. 🚨 NEW: Advocate Dashboard Stats (Real Live Data)
@router.get("/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    # Get all mutations with their parent LandRecord
    query = select(MutationEntry, LandRecord).join(LandRecord)
    result = await db.execute(query)
    rows = result.all()
    
    active_cases = {}
    closed_cases = {}
    total_verified = 0
    
    # Process the raw data into Dashboard metrics
    for mutation, record in rows:
        survey = record.survey_no
        
        if mutation.is_verified:
            total_verified += 1
            if survey not in active_cases:
                closed_cases[survey] = closed_cases.get(survey, 0) + 1
        else:
            # If even one node is unverified, it moves to Active Cases
            if survey in closed_cases:
                del closed_cases[survey]
            active_cases[survey] = active_cases.get(survey, 0) + 1
            
    return {
        "total_verified_nodes": total_verified,
        "active_cases": [{"survey_no": k, "pending_nodes": v} for k, v in active_cases.items()],
        "closed_cases": [{"survey_no": k, "verified_nodes": v} for k, v in closed_cases.items()]
    }