import asyncio
from pathlib import Path
from datetime import datetime
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import (
    AnyRORError,
    AnyRoROfflineError,
    AnyRoRBlockedError,
    ScrapingTimeoutError,
    CaptchaSolveError
)
from app.db.models import LandRecord, MutationEntry
from app.scraper.browser import browser_manager
from app.scraper.client import AnyRORIntegratedClient
from app.utils.risk_engine import calculate_risk_flags, calculate_outstanding_dues
from app.services.ocr_engine import extract_mutation_data


async def scrape_and_save_record(
    db: AsyncSession,
    district: str,
    taluka: str,
    village: str,
    survey: str,
    cached_record: LandRecord | None = None
) -> tuple[LandRecord, bool]:
    """
    Orchestrates the land record extraction pipeline:
    1. Obtains clean browser page from BrowserManager (stealth args, anti-detection, Gujarati locale).
    2. Runs AnyRORIntegratedClient to navigate, cascade dropdowns, solve CAPTCHA, and extract data.
    3. Handles date-based caching check.
    4. Computes risk flags and outstanding dues.
    5. Saves parent LandRecord and processes historical scans via AI OCR & digital mutations.
    6. Gracefully serves verified database records if AnyRoR is temporarily offline or rate-limiting.
    """
    logger.info(
        f"Triggered extraction for Survey {survey} (District: {district}, Taluka: {taluka}, Village: {village})"
    )

    output_dir = Path(f"output/survey_{survey}")
    output_dir.mkdir(parents=True, exist_ok=True)

    # Extract existing processing date from DB if record exists
    cached_date = None
    if cached_record and cached_record.extracted_data:
        basic_old = cached_record.extracted_data.get("Basic Details", cached_record.extracted_data.get("Basic_Details", {}))
        cached_date = str(basic_old.get("PROCESSING DATE", basic_old.get("Processing Date", ""))).strip()

    try:
        # Launch browser page through BrowserManager
        async with browser_manager.get_page() as page:
            client = AnyRORIntegratedClient(page)
            parsed_result, html_content, pdf_path_str, downloaded_images, is_unchanged = await client.fetch_integrated_record(
                district=district,
                taluka=taluka,
                village=village,
                survey=survey,
                output_dir=output_dir,
                cached_processing_date=cached_date
            )

        # FAST CACHE RETURN: If portal date matches database, skip downloading & parsing
        if is_unchanged and cached_record:
            logger.info(f"[CACHE HIT] Portal processing date matches database for Survey {survey}. Returning cached verified record.")
            return cached_record, True

        final_extracted_data = parsed_result.extracted_data

        # Clean crop details & enrich with risk flags and outstanding dues
        final_extracted_data.pop("Crop Details", None)
        final_extracted_data.pop("Crop_Details", None)
        final_extracted_data["Risk_Flags"] = calculate_risk_flags(final_extracted_data)
        final_extracted_data["Outstanding_Dues"] = calculate_outstanding_dues(final_extracted_data)

        # 1. Save Parent LandRecord
        db_record = LandRecord(
            district_code=district,
            taluka_code=taluka,
            village_code=village,
            survey_no=str(survey),
            extracted_data=final_extracted_data,
            pdf_file_path=pdf_path_str,
            mutation_images_dir=str(output_dir),
            is_successful=True,
            scraped_at=datetime.utcnow()
        )
        db.add(db_record)
        await db.flush()

        # 2. Process Downloaded Mutation Scans via AI OCR
        if downloaded_images:
            logger.info(f"Processing {len(downloaded_images)} scanned handwritten mutation images with AI OCR...")
            for i, img_path in enumerate(downloaded_images):
                img_name = Path(img_path).name
                client_img_url = f"/static/images/survey_{survey}/{img_name}"

                ocr_result = await extract_mutation_data(img_path)
                entries = ocr_result.get("entries", [])

                if entries:
                    for entry_data in entries:
                        mutation_db_entry = MutationEntry(
                            land_record_id=db_record.id,
                            entry_number=str(entry_data.get("mutation_entry_number") or img_name.replace("mutation_entry_", "").replace(".jpg", "")),
                            image_file_path=client_img_url,
                            scraped_html_text=None,
                            ai_draft_data=entry_data
                        )
                        db.add(mutation_db_entry)
                else:
                    extracted_num = img_name.replace("mutation_entry_", "").replace(".jpg", "")
                    fallback_draft = {
                        "mutation_entry_number": extracted_num,
                        "entry_date": "",
                        "transaction_type": "Historical Handwritten Entry",
                        "survey_numbers": str(survey),
                        "previous_owners": [],
                        "new_owners": [],
                        "remarks_summary": f"Scanned VF-6 entry #{extracted_num}. Requires advocate review.",
                        "low_confidence_flags": ["Handwritten scan requiring manual verification"]
                    }
                    fallback_entry = MutationEntry(
                        land_record_id=db_record.id,
                        entry_number=extracted_num,
                        image_file_path=client_img_url,
                        scraped_html_text=None,
                        ai_draft_data=fallback_draft
                    )
                    db.add(fallback_entry)

                if i < len(downloaded_images) - 1:
                    await asyncio.sleep(0.5)

        # 3. Process Modern Digital HTML Entries
        entry_details = (
            final_extracted_data.get("Mutation_Entries") or
            final_extracted_data.get("Entry Details") or
            final_extracted_data.get("Entry_Details") or
            []
        )
        if isinstance(entry_details, list) and len(entry_details) > 0:
            for row in entry_details:
                if not isinstance(row, dict):
                    continue
                entry_no = (
                    row.get("Entry Number") or
                    row.get("નોંધ નંબર") or
                    row.get("Column_0") or
                    "Digital"
                )
                entry_date = (
                    row.get("Date") or
                    row.get("તારીખ") or
                    row.get("Column_1") or
                    ""
                )
                details_snippet = (
                    row.get("Details") or
                    row.get("વિગત") or
                    row.get("Column_2") or
                    ""
                )
                raw_draft = {
                    "mutation_entry_number": str(entry_no),
                    "entry_date": str(entry_date),
                    "transaction_type": "Requires Advocate Review",
                    "survey_numbers": str(survey),
                    "previous_owners": [],
                    "new_owners": [],
                    "remarks_summary": str(details_snippet)[:250]
                }
                text_db_entry = MutationEntry(
                    land_record_id=db_record.id,
                    entry_number=str(entry_no),
                    image_file_path=None,
                    scraped_html_text=row,
                    ai_draft_data=raw_draft
                )
                db.add(text_db_entry)

        await db.commit()
        await db.refresh(db_record)
        return db_record, False

    except (AnyRoRBlockedError, AnyRoROfflineError) as conn_err:
        logger.warning(
            f"Government AnyRoR portal connection issue: {conn_err}. Checking database repository for Survey {survey}..."
        )
        if cached_record:
            return cached_record, True
        raise

    except Exception as scrape_err:
        logger.error(f"Scraper execution error: {scrape_err}")
        if cached_record:
            return cached_record, True
        raise