from pydantic import BaseModel, Field


class SourceChunk(BaseModel):
    document_id: str
    document_title: str
    content: str
    score: float
    page: int | None = None


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    top_k: int = Field(default=6, ge=1, le=20)
    document_ids: list[str] | None = None


class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
    query: str


class StreamChunk(BaseModel):
    type: str
    content: str
    sources: list[SourceChunk] | None = None
