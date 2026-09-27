import aiofiles
from pathlib import Path
from app.core.config import settings
from app.core.logging import logger

class StorageService:
    @staticmethod
    def _generate_deterministic_filename(
        district: str, taluka: str, village: str, survey: str, extension: str
    ) -> str:
        safe_survey = survey.replace("/", "_").replace("\\", "_")
        return f"dist_{district}_tal_{taluka}_vil_{village}_sur_{safe_survey}.{extension}"

    async def save_pdf(
        self, district: str, taluka: str, village: str, survey: str, content: bytes
    ) -> Path:
        filename = self._generate_deterministic_filename(district, taluka, village, survey, "pdf")
        target_path = settings.pdf_storage_dir / filename
        
        async with aiofiles.open(target_path, "wb") as f:
            await f.write(content)
            
        logger.info("PDF saved successfully", path=str(target_path))
        return target_path

    async def save_html(
        self, district: str, taluka: str, village: str, survey: str, content: str
    ) -> Path:
        filename = self._generate_deterministic_filename(district, taluka, village, survey, "html")
        target_path = settings.html_storage_dir / filename
        
        async with aiofiles.open(target_path, "w", encoding="utf-8") as f:
            await f.write(content)
            
        logger.info("Raw HTML saved successfully", path=str(target_path))
        return target_path

storage_service = StorageService()