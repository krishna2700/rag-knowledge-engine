import os
from pathlib import Path
from bs4 import BeautifulSoup
import markdown as md_lib
from pypdf import PdfReader
from docx import Document as DocxDocument
from app.core.logging import get_logger

logger = get_logger(__name__)


def parse_pdf(file_path: str) -> tuple[str, int]:
    reader = PdfReader(file_path)
    pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            pages.append(text.strip())
    return "\n\n".join(pages), len(reader.pages)


def parse_docx(file_path: str) -> tuple[str, None]:
    doc = DocxDocument(file_path)
    paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
    return "\n\n".join(paragraphs), None


def parse_html(file_path: str) -> tuple[str, None]:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        raw = f.read()
    soup = BeautifulSoup(raw, "lxml")
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    return soup.get_text(separator="\n", strip=True), None


def parse_markdown(file_path: str) -> tuple[str, None]:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        raw = f.read()
    html = md_lib.markdown(raw)
    soup = BeautifulSoup(html, "lxml")
    return soup.get_text(separator="\n", strip=True), None


def parse_text(file_path: str) -> tuple[str, None]:
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read(), None


PARSER_MAP = {
    "pdf": parse_pdf,
    "docx": parse_docx,
    "html": parse_html,
    "htm": parse_html,
    "md": parse_markdown,
    "markdown": parse_markdown,
    "txt": parse_text,
}


def parse_document(file_path: str) -> tuple[str, int | None]:
    ext = Path(file_path).suffix.lstrip(".").lower()
    parser = PARSER_MAP.get(ext)
    if not parser:
        raise ValueError(f"No parser available for extension: {ext}")
    logger.info("parsing_document", file=file_path, ext=ext)
    return parser(file_path)
