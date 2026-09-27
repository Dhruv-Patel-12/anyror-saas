import asyncio
import random
import json
from pathlib import Path
from playwright.async_api import async_playwright

# Import your existing AI CAPTCHA solver and Parser
from app.scraper.captcha import captcha_solver
from app.scraper.parser import IntegratedParser

async def human_delay(min_sec=0.5, max_sec=1.5):
    """Simulates a human pausing to read the screen."""
    await asyncio.sleep(random.uniform(min_sec, max_sec))

async def main():
    print("🚀 Starting Local Human-Like Scraper...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=False,
            args=["--disable-blink-features=AutomationControlled"]
        )
        
        context = await browser.new_context(
            viewport={"width": 1366, "height": 768},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
        )
        
        await context.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined});")
        page = await context.new_page()
        
        # 🚨 SMART DIALOG HANDLER
        dialog_state = {"message": ""}
        async def handle_dialog(dialog):
            dialog_state["message"] = dialog.message.lower()
            print(f"⚠️ Website Popup Alert: {dialog.message}")
            await dialog.accept()
            
        page.on("dialog", handle_dialog)

        print("🌐 Navigating to AnyROR...")
        await page.goto("https://anyror.gujarat.gov.in/LandRecordRural.aspx", wait_until="domcontentloaded", timeout=60000)
        
        async def select_dropdown(selector, value, name):
            print(f"👉 Selecting {name}...")
            await page.wait_for_selector(selector, timeout=15000)
            await human_delay(0.5, 1.2)
            await page.select_option(selector, value=value)
            try:
                await page.wait_for_load_state("networkidle", timeout=5000)
            except Exception:
                pass 
            await human_delay(0.5, 1.0)

        # Target: Kutch (01) -> Lakhpat (01) -> Akri (040) -> Survey (3)
        await select_dropdown("#ContentPlaceHolder1_drpLandRecord", "8", "Integrated Record")
        await select_dropdown("#ContentPlaceHolder1_ddlDistrict", "01", "District")
        await select_dropdown("#ContentPlaceHolder1_ddlTaluka", "01", "Taluka")
        await select_dropdown("#ContentPlaceHolder1_ddlVillage", "040", "Village")
        await select_dropdown("#ContentPlaceHolder1_ddlSurveyNo", "3", "Survey No")

        # --- CAPTCHA LOOP ---
        for attempt in range(1, 10): 
            print(f"\n🤖 Solving CAPTCHA (Attempt {attempt})...")
            dialog_state["message"] = "" 
            
            captcha_elem = await page.wait_for_selector("#ContentPlaceHolder1_i_captcha_1", timeout=15000)
            
            img_bytes = await captcha_elem.screenshot()
            predicted_text = await captcha_solver.solve(img_bytes)
            print(f"🧠 AI Predicted: {predicted_text}")

            print("⌨️ Typing CAPTCHA like a human...")
            await page.type("#ContentPlaceHolder1_txt_captcha_1", predicted_text, delay=150) 
            
            await human_delay(0.8, 1.5)
            print("🖱️ Clicking Submit...")
            await page.evaluate("document.getElementById('ContentPlaceHolder1_btnGo').click()")
            
            print("⏳ Waiting for AnyROR servers to process...")
            
            is_success = False
            for _ in range(15):
                await asyncio.sleep(1.0)
                
                if "verification" in dialog_state["message"] or "captcha" in dialog_state["message"] or "invalid" in dialog_state["message"] or "match" in dialog_state["message"]:
                    print("❌ Server rejected CAPTCHA via popup alert!")
                    break 
                    
                if await page.locator("#ContentPlaceHolder1_lblDistrict").count() > 0:
                    is_success = True
                    break

            if not is_success:
                print("🔄 Refreshing CAPTCHA and trying again...")
                try:
                    await page.click("#ContentPlaceHolder1_lb_refresh_1")
                    await page.wait_for_load_state("networkidle", timeout=5000)
                except Exception:
                    pass
                continue 
            
            print("✅ Results fully loaded on screen! Extracting data...")
            
            html_content = await page.content()
            parsed_result = IntegratedParser.parse_response(html_content)
            
            output_dir = Path("output")
            output_dir.mkdir(exist_ok=True)
            
            with open(output_dir / "record.json", "w", encoding="utf-8") as f:
                json.dump(parsed_result.extracted_data, f, ensure_ascii=False, indent=4)
            print(f"📄 Data saved to: output/record.json")
            
            if parsed_result.pdf_postback_value:
                print("📥 Downloading PDF...")
                await page.locator(f'a[href="{parsed_result.pdf_postback_value}"]').click()
                object_elem = await page.wait_for_selector('object.literal_pdf', state='visible', timeout=15000)
                pdf_url = await object_elem.get_attribute("data")
                if pdf_url and pdf_url.startswith("/"):
                    pdf_url = "https://anyror.gujarat.gov.in" + pdf_url
                if pdf_url:
                    response = await page.context.request.get(pdf_url)
                    pdf_bytes = await response.body()
                    with open(output_dir / "record.pdf", "wb") as f:
                        f.write(pdf_bytes)
                    print(f"📄 PDF saved to: output/record.pdf")
            
            # --- THE NEW RAW IMAGE MUTATION SCANNER ---
            print("📸 Hunting for handwritten mutation entries...")
            entry_table = page.locator("#ContentPlaceHolder1_gvEntryResult")
            
            if await entry_table.count() > 0:
                entry_links = entry_table.locator("a")
                link_count = await entry_links.count()
                print(f"🔍 Found {link_count} total mutation entries to check.")

                for i in range(link_count):
                    link = entry_links.nth(i)
                    entry_text = await link.inner_text()
                    print(f"\n👉 Checking Entry Number: {entry_text}...")
                    
                    await link.click()
                    await asyncio.sleep(2.5) # Wait for ASP.NET postback
                    
                    try:
                        await page.wait_for_load_state("networkidle", timeout=5000)
                    except Exception:
                        pass
                    
                    # 🚨 Check if it's an Image or just Text
                    img_locator = page.locator("#ContentPlaceHolder1_gvImages_ientryimage_0")
                    
                    if await img_locator.count() > 0:
                        # It is a scanned historical document!
                        raw_src = await img_locator.get_attribute("src")
                        
                        if raw_src:
                            # Clean up the relative URL to make it absolute
                            if raw_src.startswith("../"):
                                absolute_url = raw_src.replace("../", "https://anyror.gujarat.gov.in/")
                            elif raw_src.startswith("/"):
                                absolute_url = "https://anyror.gujarat.gov.in" + raw_src
                            else:
                                absolute_url = "https://anyror.gujarat.gov.in/" + raw_src
                                
                            print(f"🔗 Downloading raw image from: {absolute_url}")
                            
                            # Download the actual image file directly from the server
                            response = await page.context.request.get(absolute_url)
                            img_bytes = await response.body()
                            
                            image_path = output_dir / f"mutation_entry_{entry_text.strip()}.jpg"
                            with open(image_path, "wb") as f:
                                f.write(img_bytes)
                                
                            print(f"✅ Saved high-res image: {image_path.name}")
                    else:
                        # It is a modern text table (Blue Link)
                        print(f"📝 Entry {entry_text.strip()} is a computerized text record. (Text already captured in record.json). Skipping image download.")
                    
            else:
                print("ℹ️ No clickable mutation entries found for this record.")

            break 

        else:
            print("❌ Failed to solve CAPTCHA after 10 attempts.")

        await human_delay(2.0, 3.0)
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())