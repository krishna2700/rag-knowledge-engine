import os
import aiofiles
from pathlib import Path
from fastapi import UploadFile
from app.core.config import get_settings
from app.core.logging import get_logger
from app.domain.documents.models import Document, DocumentMetadata, DocumentStatus
from app.domain.documents.repository import DocumentRepository
from app.infrastructure.langchain.parsers import parse_document
from app.infrastructure.langchain.chunker import chunk_document
from app.infrastructure.pinecone.vector_store import upsert_chunks, delete_document_vectors
from app.shared.exceptions import UnsupportedFileTypeError, FileTooLargeError, IngestionError

logger = get_logger(__name__)


class DocumentService:
    def __init__(self, repository: DocumentRepository) -> None:
        self._repo = repository
        self._settings = get_settings()

    async def ingest(self, file: UploadFile) -> Document:
        ext = Path(file.filename or "").suffix.lstrip(".").lower()
        if ext not in self._settings.allowed_extensions:
            raise UnsupportedFileTypeError(ext)

        content = await file.read()
        size_mb = len(content) / (1024 * 1024)
        if size_mb > self._settings.max_upload_size_mb:
            raise FileTooLargeError(self._settings.max_upload_size_mb)

        doc = Document(
            title=file.filename or "Untitled",
            metadata=DocumentMetadata(
                file_name=file.filename or "untitled",
                file_type=ext,
                file_size_bytes=len(content),
            ),
        )
        self._repo.save(doc)
        self._repo.update_status(doc.id, DocumentStatus.PROCESSING)

        os.makedirs(self._settings.upload_dir, exist_ok=True)
        file_path = os.path.join(self._settings.upload_dir, f"{doc.id}.{ext}")

        async with aiofiles.open(file_path, "wb") as f:
            await f.write(content)

        try:
            text, page_count = parse_document(file_path)
            chunks = chunk_document(
                text=text,
                document_id=doc.id,
                document_title=doc.title,
                file_type=ext,
                page_count=page_count,
            )
            await upsert_chunks(chunks)
            self._repo.update_status(doc.id, DocumentStatus.READY, chunk_count=len(chunks))
            logger.info("document_ingested", document_id=doc.id, chunks=len(chunks))
        except Exception as exc:
            logger.error("ingestion_failed", document_id=doc.id, error=str(exc))
            self._repo.update_status(doc.id, DocumentStatus.FAILED, error_message=str(exc))
            raise IngestionError(str(exc))
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

        return self._repo.find_by_id(doc.id)  # type: ignore

    def list_documents(self) -> list[Document]:
        return self._repo.find_all()

    def get_document(self, document_id: str) -> Document | None:
        return self._repo.find_by_id(document_id)

    async def delete_document(self, document_id: str) -> bool:
        await delete_document_vectors(document_id)
        return self._repo.delete(document_id)
