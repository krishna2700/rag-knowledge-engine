import numpy as np
from rank_bm25 import BM25Okapi
from app.core.config import get_settings
from app.infrastructure.pinecone.vector_store import similarity_search
from app.domain.query.models import SourceChunk


def _tokenize(text: str) -> list[str]:
    return text.lower().split()


def _reciprocal_rank_fusion(
    vector_results: list[dict],
    bm25_results: list[dict],
    k: int = 60,
) -> list[dict]:
    scores: dict[str, float] = {}
    doc_map: dict[str, dict] = {}

    for rank, doc in enumerate(vector_results):
        key = doc["metadata"]["document_id"] + "_" + str(doc["metadata"]["chunk_index"])
        scores[key] = scores.get(key, 0.0) + 1.0 / (k + rank + 1)
        doc_map[key] = doc

    for rank, doc in enumerate(bm25_results):
        key = doc["metadata"]["document_id"] + "_" + str(doc["metadata"]["chunk_index"])
        scores[key] = scores.get(key, 0.0) + 1.0 / (k + rank + 1)
        doc_map[key] = doc

    sorted_keys = sorted(scores, key=lambda x: scores[x], reverse=True)
    return [
        {**doc_map[k], "score": scores[k]}
        for k in sorted_keys
    ]


async def hybrid_search(
    query: str,
    all_chunks: list[dict],
    top_k: int,
    filter_dict: dict | None = None,
) -> list[SourceChunk]:
    settings = get_settings()

    vector_results = await similarity_search(query=query, top_k=top_k * 2, filter_dict=filter_dict)

    if all_chunks:
        corpus = [_tokenize(c["content"]) for c in all_chunks]
        corpus = [tokens if tokens else [""] for tokens in corpus]
        try:
            bm25 = BM25Okapi(corpus)
            bm25_scores = bm25.get_scores(_tokenize(query) or [""])
            top_bm25_indices = np.argsort(bm25_scores)[::-1][: top_k * 2]
            bm25_results = [
                {**all_chunks[i], "score": float(bm25_scores[i])}
                for i in top_bm25_indices
                if bm25_scores[i] > 0
            ]
        except Exception:
            bm25_results = []
    else:
        bm25_results = []

    fused = _reciprocal_rank_fusion(vector_results, bm25_results)[:top_k]

    return [
        SourceChunk(
            document_id=r["metadata"]["document_id"],
            document_title=r["metadata"]["document_title"],
            content=r["content"],
            score=r["score"],
            page=r["metadata"].get("page_count"),
        )
        for r in fused
    ]
