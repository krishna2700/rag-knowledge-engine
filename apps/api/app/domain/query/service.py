from typing import AsyncGenerator
import json
from app.core.config import get_settings
from app.core.logging import get_logger
from app.domain.query.models import QueryRequest, QueryResponse, SourceChunk, StreamChunk
from app.infrastructure.langchain.hybrid_search import hybrid_search
from app.infrastructure.langchain.rag_chain import stream_rag_response, generate_rag_response
from app.shared.exceptions import QueryError

logger = get_logger(__name__)


class QueryService:
    def __init__(self) -> None:
        self._settings = get_settings()

    async def query_stream(
        self,
        request: QueryRequest,
        all_chunks: list[dict],
    ) -> AsyncGenerator[str, None]:
        try:
            filter_dict = None
            if request.document_ids:
                filter_dict = {"document_id": {"$in": request.document_ids}}

            sources = await hybrid_search(
                query=request.query,
                all_chunks=all_chunks,
                top_k=request.top_k,
                filter_dict=filter_dict,
            )

            sources_payload = StreamChunk(
                type="sources",
                content="",
                sources=sources,
            )
            yield f"data: {sources_payload.model_dump_json()}\n\n"

            async for token in stream_rag_response(query=request.query, sources=sources):
                chunk = StreamChunk(type="token", content=token)
                yield f"data: {chunk.model_dump_json()}\n\n"

            done_chunk = StreamChunk(type="done", content="")
            yield f"data: {done_chunk.model_dump_json()}\n\n"

        except Exception as exc:
            logger.error("query_stream_failed", error=str(exc))
            error_chunk = StreamChunk(type="error", content=str(exc))
            yield f"data: {error_chunk.model_dump_json()}\n\n"

    async def query(
        self,
        request: QueryRequest,
        all_chunks: list[dict],
    ) -> QueryResponse:
        try:
            filter_dict = None
            if request.document_ids:
                filter_dict = {"document_id": {"$in": request.document_ids}}

            sources = await hybrid_search(
                query=request.query,
                all_chunks=all_chunks,
                top_k=request.top_k,
                filter_dict=filter_dict,
            )

            answer = await generate_rag_response(query=request.query, sources=sources)
            return QueryResponse(answer=answer, sources=sources, query=request.query)

        except Exception as exc:
            logger.error("query_failed", error=str(exc))
            raise QueryError(str(exc))
