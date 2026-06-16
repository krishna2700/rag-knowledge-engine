from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field
import uuid


class DocumentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class DocumentMetadata(BaseModel):
    file_name: str
    file_type: str
    file_size_bytes: int
    chunk_count: int = 0
    page_count: int | None = None


class Document(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    status: DocumentStatus = DocumentStatus.PENDING
    metadata: DocumentMetadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    error_message: str | None = None
