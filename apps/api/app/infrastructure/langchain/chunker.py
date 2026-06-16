import uuid
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.core.config import get_settings


def chunk_document(
    text: str,
    document_id: str,
    document_title: str,
    file_type: str,
    page_count: int | None = None,
) -> list[dict]:
    settings = get_settings()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ". ", " ", ""],
        length_function=len,
    )

    raw_chunks = splitter.split_text(text)

    return [
        {
            "id": f"{document_id}_{i}",
            "content": chunk,
            "metadata": {
                "document_id": document_id,
                "document_title": document_title,
                "file_type": file_type,
                "chunk_index": i,
                "total_chunks": len(raw_chunks),
                "page_count": page_count,
            },
        }
        for i, chunk in enumerate(raw_chunks)
    ]
