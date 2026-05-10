from playwright.async_api import async_playwright


async def generate_pdf(html_content: str, output_path: str) -> str:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html_content)
        await page.pdf(path=output_path, format="A4")
        await browser.close()
    return output_path
