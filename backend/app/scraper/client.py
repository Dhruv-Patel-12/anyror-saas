import asyncio
import random
from pathlib import Path
from playwright.async_api import Page, TimeoutError as PlaywrightTimeoutError
from app.core.config import settings
from app.core.exceptions import (
    ScrapingTimeoutError,
    CaptchaSolveError,
    AnyRoROfflineError,
    AnyRoRBlockedError
)
from app.core.logging import logger
from app.scraper.captcha import captcha_solver
from app.scraper.parser import IntegratedParser, ParsedRecordResult


class AnyRORIntegratedClient:
    """
    High-fidelity Playwright automation client for Gujarat AnyRoR Revenue Portal.
    Implements humanized pauses, anti-detection evasions, UpdatePanel cascade synchronization,
    AI CAPTCHA solving with retry loops, PDF streaming, and historical handwritten deed retrieval.
    """
    def __init__(self, page: Page):
        self.page = page

    async def _select_dropdown(self, selector: str, value: str, description: str) -> None:
        """
        Selects an ASP.NET dropdown option and pauses for ASP.NET partial postback to settle.
        """
        logger.info(f"Selecting {description}", value=value)
        await self.page.wait_for_selector(selector, timeout=20000)
        
        # Human hesitation before clicking
        await asyncio.sleep(random.uniform(0.5, 1.2))
        await self.page.select_option(selector, value=value)
        
        # Wait for ASP.NET UpdatePanel postback
        try:
            await self.page.wait_for_load_state("networkidle", timeout=5000)
        except Exception:
            pass
        await asyncio.sleep(random.uniform(0.5, 1.0))

    async def fetch_integrated_record(
        self,
        district: str,
        taluka: str,
        village: str,
        survey: str,
        output_dir: Path | None = None,
        cached_processing_date: str | None = None
    ) -> tuple[ParsedRecordResult, str, str | None, list[str], bool]:
        """
        Executes full AnyRoR land record extraction pipeline.
        Returns:
            (parsed_result, html_content, pdf_path, downloaded_mutation_images, is_unchanged)
        """
        if output_dir is None:
            output_dir = Path(f"output/survey_{survey}")
        output_dir.mkdir(parents=True, exist_ok=True)

        dialog_state = {"message": ""}

        async def handle_dialog(dialog):
            dialog_state["message"] = dialog.message.lower()
            logger.info(f"AnyRoR Dialog Alert: {dialog.message}")
            await dialog.accept()

        self.page.on("dialog", handle_dialog)

        # 1. Navigate to AnyRoR Rural Portal
        try:
            logger.info("Navigating to AnyROR Rural Portal...", url=settings.BASE_URL)
            await self.page.goto(
                settings.BASE_URL,
                wait_until="domcontentloaded",
                timeout=settings.NAVIGATION_TIMEOUT_MS
            )
        except Exception as nav_err:
            err_str = str(nav_err).lower()
            if "err_connection_closed" in err_str or "connection reset" in err_str or "err_connection_refused" in err_str:
                logger.error("AnyRoR connection actively closed by government server (suspected IP block/rate-limit).", error=str(nav_err))
                raise AnyRoRBlockedError(f"AnyRoR server actively closed connection: {nav_err}") from nav_err
            elif "timeout" in err_str:
                logger.error("Navigation timed out reaching AnyRoR portal.", error=str(nav_err))
                raise ScrapingTimeoutError(f"Navigation timed out: {nav_err}") from nav_err
            else:
                logger.error("Failed to connect to AnyRoR portal.", error=str(nav_err))
                raise AnyRoROfflineError(f"Portal unreachable: {nav_err}") from nav_err

        # Check for government maintenance notice
        page_html = await self.page.content()
        if "This Application is currently offline" in page_html or "ઓફલાઇન (બંધ) છે" in page_html:
            logger.warning("AnyRoR portal is currently offline for scheduled maintenance.")
            raise AnyRoROfflineError("AnyRoR portal is offline for scheduled maintenance.")

        # 2. Fill cascading dropdowns
        try:
            # Dropdown 1: Integrated Record (Value '8')
            await self._select_dropdown(
                settings.SELECTORS["record_type"],
                settings.INTEGRATED_RECORD_TYPE_VALUE,
                "Integrated Record Type"
            )
            # Dropdown 2: District
            await self._select_dropdown(settings.SELECTORS["district"], district, "District")
            # Dropdown 3: Taluka
            await self._select_dropdown(settings.SELECTORS["taluka"], taluka, "Taluka")
            # Dropdown 4: Village
            await self._select_dropdown(settings.SELECTORS["village"], village, "Village")
            # Dropdown 5: Survey No
            await self._select_dropdown(settings.SELECTORS["survey_no"], survey, "Survey Number")
        except Exception as drop_err:
            logger.error("Failed during cascading dropdown sequence", error=str(drop_err))
            raise ScrapingTimeoutError(f"Dropdown cascade failed: {drop_err}") from drop_err

        # 3. CAPTCHA Solving Loop (up to 10 attempts)
        max_attempts = max(settings.MAX_CAPTCHA_RETRIES, 10)
        is_success = False

        for attempt in range(1, max_attempts + 1):
            logger.info("Solving CAPTCHA", attempt=attempt)
            dialog_state["message"] = ""

            try:
                captcha_elem = await self.page.wait_for_selector(
                    settings.SELECTORS["captcha_img"], timeout=15000
                )
                if not captcha_elem:
                    raise ScrapingTimeoutError("CAPTCHA element not found.")

                img_bytes = await captcha_elem.screenshot()
                predicted_text = await captcha_solver.solve(img_bytes)
                logger.info("CAPTCHA solved via CNN", predicted=predicted_text)

                # Type like human (150ms delay per key)
                await self.page.type(settings.SELECTORS["captcha_input"], predicted_text, delay=150)
                await asyncio.sleep(random.uniform(0.8, 1.5))

                # Submit form via DOM click to trigger ASP.NET validation correctly
                await self.page.evaluate("document.getElementById('ContentPlaceHolder1_btnGo').click()")

                # Poll for result or alert popup
                for _ in range(15):
                    await asyncio.sleep(1.0)
                    msg = dialog_state["message"]
                    if "verification" in msg or "captcha" in msg or "invalid" in msg or "match" in msg:
                        logger.warning("Server rejected CAPTCHA via popup alert.", message=msg)
                        break

                    if await self.page.locator("#ContentPlaceHolder1_lblDistrict").count() > 0:
                        is_success = True
                        break

                if not is_success:
                    logger.info("Refreshing CAPTCHA for retry...")
                    try:
                        await self.page.click(settings.SELECTORS["refresh_btn"])
                        await self.page.wait_for_load_state("networkidle", timeout=5000)
                    except Exception:
                        pass
                    continue
                else:
                    logger.info("CAPTCHA accepted. Land records loaded successfully.")
                    break

            except Exception as cap_err:
                logger.warning(f"Error during CAPTCHA attempt {attempt}: {cap_err}")
                continue

        if not is_success:
            raise CaptchaSolveError(f"Exhausted {max_attempts} CAPTCHA attempts without success.")

        # 4. Extract Structured Data
        html_content = await self.page.content()
        parsed_result = IntegratedParser.parse_response(html_content)

        # Smart Caching Check: Compare Portal Processing Date with Database
        basic_new = parsed_result.extracted_data.get("Basic_Details", {})
        new_date = str(basic_new.get("Processing Date", "")).strip()
        if cached_processing_date and new_date:
            clean_new = new_date.replace("તા.", "").replace("*", "").replace("ની સ્થિતિએ", "").strip()
            clean_old = str(cached_processing_date).replace("તા.", "").replace("*", "").replace("ની સ્થિતિએ", "").strip()
            if clean_new and clean_old and clean_new == clean_old:
                logger.info(
                    f"[CACHE HIT] AnyRoR Processing Date match ({new_date}). Record unchanged on portal. Skipping document downloads.",
                    survey=survey
                )
                return parsed_result, html_content, None, [], True

        # 5. Download Official PDF if available
        pdf_path_str: str | None = None
        if parsed_result.pdf_postback_value:
            try:
                logger.info("Triggering PDF modal download...")
                await self.page.locator(f'a[href="{parsed_result.pdf_postback_value}"]').click()
                object_elem = await self.page.wait_for_selector('object.literal_pdf', state='visible', timeout=15000)
                pdf_url = await object_elem.get_attribute("data")
                if pdf_url:
                    if pdf_url.startswith("/"):
                        pdf_url = "https://anyror.gujarat.gov.in" + pdf_url
                    response = await self.page.context.request.get(pdf_url)
                    pdf_bytes = await response.body()
                    pdf_file = output_dir / f"record_{survey}.pdf"
                    with open(pdf_file, "wb") as f:
                        f.write(pdf_bytes)
                    pdf_path_str = str(pdf_file)
                    logger.info("PDF saved successfully", path=pdf_path_str)
            except Exception as pdf_err:
                logger.warning(f"PDF extraction failed: {pdf_err}")

        # 6. Extract Scanned Handwritten Mutation Deeds
        downloaded_images: list[str] = []
        try:
            entry_table = self.page.locator("#ContentPlaceHolder1_gvEntryResult")
            if await entry_table.count() > 0:
                entry_links = entry_table.locator("a")
                link_count = await entry_links.count()
                logger.info(f"Found {link_count} mutation entries to scan.")

                for i in range(link_count):
                    link = entry_links.nth(i)
                    entry_text = await link.inner_text()
                    await link.click()
                    await asyncio.sleep(2.5)  # ASP.NET postback settle

                    try:
                        await self.page.wait_for_load_state("networkidle", timeout=5000)
                    except Exception:
                        pass

                    img_locator = self.page.locator("#ContentPlaceHolder1_gvImages_ientryimage_0")
                    if await img_locator.count() > 0:
                        raw_src = await img_locator.get_attribute("src")
                        if raw_src:
                            if raw_src.startswith("../"):
                                absolute_url = raw_src.replace("../", "https://anyror.gujarat.gov.in/")
                            elif raw_src.startswith("/"):
                                absolute_url = "https://anyror.gujarat.gov.in" + raw_src
                            else:
                                absolute_url = "https://anyror.gujarat.gov.in/" + raw_src

                            response = await self.page.context.request.get(absolute_url)
                            img_bytes = await response.body()
                            img_path = output_dir / f"mutation_entry_{entry_text.strip()}.jpg"

                            with open(img_path, "wb") as f:
                                f.write(img_bytes)

                            downloaded_images.append(str(img_path))
                            logger.info(f"Downloaded handwritten scan for Entry #{entry_text.strip()}", file=img_path.name)
        except Exception as img_scan_err:
            logger.warning(f"Error during mutation scans extraction: {img_scan_err}")

        return parsed_result, html_content, pdf_path_str, downloaded_images, False