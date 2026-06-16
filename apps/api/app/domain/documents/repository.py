from datetime import datetime
from app.domain.documents.models import Document, DocumentStatus


_store: dict[str, Document] = {}


class DocumentRepository:
    def save(self, document: Document) -> Document:
        _store[document.id] = document
        return document

    def find_by_id(self, document_id: str) -> Document | None:
        return _store.get(document_id)

    def find_all(self) -> list[Document]:
        return sorted(_store.values(), key=lambda d: d.created_at, reverse=True)

    def update_status(
        self,
        document_id: str,
        status: DocumentStatus,
        chunk_count: int | None = None,
        error_message: str | None = None,
    ) -> Document | None:
        doc = _store.get(document_id)
        if not doc:
            return None
        doc.status = status
        doc.updated_at = datetime.utcnow()
        if chunk_count is not None:
            doc.metadata.chunk_count = chunk_count
        if error_message is not None:
            doc.error_message = error_message
        _store[document_id] = doc
        return doc

    def delete(self, document_id: str) -> bool:
        if document_id in _store:
            del _store[document_id]
            return True
        return False
