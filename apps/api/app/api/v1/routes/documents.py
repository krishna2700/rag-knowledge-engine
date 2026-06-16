from fastapi import APIRouter, Depends, UploadFile, File, status
from app.api.v1.dependencies import get_document_service
from app.domain.documents.models import Document
from app.domain.documents.service import DocumentService
from app.domain.documents.schemas import DocumentUploadResponse, DocumentListResponse
from app.shared.exceptions import DocumentNotFoundError
from app.shared.response_models import APIResponse

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post(
    "/",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    file: UploadFile = File(...),
    service: DocumentService = Depends(get_document_service),
) -> DocumentUploadResponse:
    document = await service.ingest(file)
    return DocumentUploadResponse(
        document=document,
        message="Document ingested successfully.",
    )


@router.get("/", response_model=DocumentListResponse)
async def list_documents(
    service: DocumentService = Depends(get_document_service),
) -> DocumentListResponse:
    documents = service.list_documents()
    return DocumentListResponse(documents=documents, total=len(documents))


@router.get("/{document_id}", response_model=APIResponse[Document])
async def get_document(
    document_id: str,
    service: DocumentService = Depends(get_document_service),
) -> APIResponse[Document]:
    document = service.get_document(document_id)
    if not document:
        raise DocumentNotFoundError(document_id)
    return APIResponse(success=True, data=document)


@router.delete("/{document_id}", response_model=APIResponse[None])
async def delete_document(
    document_id: str,
    service: DocumentService = Depends(get_document_service),
) -> APIResponse[None]:
    deleted = await service.delete_document(document_id)
    if not deleted:
        raise DocumentNotFoundError(document_id)
    return APIResponse(success=True, message="Document deleted successfully.")
