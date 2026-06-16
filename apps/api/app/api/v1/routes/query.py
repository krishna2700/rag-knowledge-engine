from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.api.v1.dependencies import get_document_service, get_query_service
from app.domain.documents.service import DocumentService
from app.domain.query.models import QueryRequest, QueryResponse
from app.domain.query.service import QueryService
from app.shared.response_models import APIResponse

router = APIRouter(prefix="/query", tags=["query"])


def _get_all_chunks(document_service: DocumentService) -> list[dict]:
    documents = document_service.list_documents()
    return [
        {
            "content": "",
            "metadata": {
                "document_id": doc.id,
                "document_title": doc.title,
                "chunk_index": 0,
                "total_chunks": doc.metadata.chunk_count,
                "page_count": doc.metadata.page_count,
            },
        }
        for doc in documents
    ]


@router.post("/stream")
async def query_stream(
    request: QueryRequest,
    document_service: DocumentService = Depends(get_document_service),
    query_service: QueryService = Depends(get_query_service),
) -> StreamingResponse:
    all_chunks = _get_all_chunks(document_service)
    return StreamingResponse(
        query_service.query_stream(request=request, all_chunks=all_chunks),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/", response_model=APIResponse[QueryResponse])
async def query(
    request: QueryRequest,
    document_service: DocumentService = Depends(get_document_service),
    query_service: QueryService = Depends(get_query_service),
) -> APIResponse[QueryResponse]:
    all_chunks = _get_all_chunks(document_service)
    result = await query_service.query(request=request, all_chunks=all_chunks)
    return APIResponse(success=True, data=result)
