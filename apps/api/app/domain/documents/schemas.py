from pydantic import BaseModel
from app.domain.documents.models import Document, DocumentStatus


class DocumentUploadResponse(BaseModel):
    document: Document
    message: str


class DocumentListResponse(BaseModel):
    documents: list[Document]
    total: int


class DocumentStatusUpdate(BaseModel):
    status: DocumentStatus
    chunk_count: int | None = None
    error_message: str | None = None
