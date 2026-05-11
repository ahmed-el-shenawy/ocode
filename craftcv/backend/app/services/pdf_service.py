from pathlib import Path

from jinja2 import Environment, FileSystemLoader
from playwright.async_api import async_playwright

from app.models.resume import Resume

_TEMPLATE_DIR = Path(__file__).parent.parent / "templates"
_env = Environment(loader=FileSystemLoader(str(_TEMPLATE_DIR)))


def _render_html(resume: Resume) -> str:
    template = _env.get_template("resume.html")
    content = resume.content or {}
    styles = resume.styles or {}
    return template.render(
        title=resume.title,
        sections=content.get("sections", []),
        styles=styles,
    )


async def generate_pdf_bytes(resume: Resume) -> bytes:
    html = _render_html(resume)
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.set_content(html, wait_until="networkidle")
        pdf_bytes = await page.pdf(format="A4", margin={"top": "0.5in", "bottom": "0.5in", "left": "0.75in", "right": "0.75in"})
        await browser.close()
    return pdf_bytes
