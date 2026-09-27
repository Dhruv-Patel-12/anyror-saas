from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from playwright.async_api import async_playwright, Browser, BrowserContext, Page
from app.core.config import settings
from app.core.logging import logger

class BrowserManager:
    def __init__(self):
        self._playwright = None
        self._browser: Browser | None = None

    async def initialize(self) -> None:
        if self._playwright is None:
            self._playwright = await async_playwright().start()
        if self._browser is None or not self._browser.is_connected():
            self._browser = await self._playwright.chromium.launch(
                headless=settings.HEADLESS,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--disable-dev-shm-usage",
                    "--no-sandbox"
                ]
            )
            logger.info("Playwright Chromium browser initialized.", headless=settings.HEADLESS)

    async def shutdown(self) -> None:
        if self._browser:
            await self._browser.close()
            self._browser = None
        if self._playwright:
            await self._playwright.stop()
            self._playwright = None
        logger.info("Playwright Browser shut down.")

    @asynccontextmanager
    async def get_page(self) -> AsyncIterator[Page]:
        if not self._browser:
            await self.initialize()

        context: BrowserContext = await self._browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0 Safari/537.36",
            viewport={"width": 1366, "height": 768},
            locale="gu-IN",
            timezone_id="Asia/Kolkata"
        )
        await context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined});")
        page = await context.new_page()

        try:
            yield page
        finally:
            await page.close()
            await context.close()

browser_manager = BrowserManager()