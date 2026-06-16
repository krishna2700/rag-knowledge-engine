from functools import lru_cache
from app.domain.documents.repository import DocumentRepository
from app.domain.documents.service import DocumentService
from app.domain.query.service import QueryService


@lru_cache
def get_document_repository() -> DocumentRepository:
    return DocumentRepository()


def get_document_service() -> DocumentService:
    return DocumentService(repository=get_document_repository())


def get_query_service() -> QueryService:
    return QueryService()
