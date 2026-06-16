from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from app.core.config import get_settings
from app.infrastructure.pinecone.client import get_index
from functools import lru_cache


@lru_cache
def get_embeddings() -> OpenAIEmbeddings:
    settings = get_settings()
    return OpenAIEmbeddings(
        model=settings.openai_embedding_model,
        openai_api_key=settings.openai_api_key,
    )


def get_vector_store() -> PineconeVectorStore:
    settings = get_settings()
    return PineconeVectorStore(
        index=get_index(),
        embedding=get_embeddings(),
        text_key="content",
        namespace=settings.pinecone_index_name,
    )


async def upsert_chunks(chunks: list[dict]) -> None:
    vector_store = get_vector_store()
    texts = [c["content"] for c in chunks]
    metadatas = [c["metadata"] for c in chunks]
    ids = [c["id"] for c in chunks]
    await vector_store.aadd_texts(texts=texts, metadatas=metadatas, ids=ids)


async def delete_document_vectors(document_id: str) -> None:
    index = get_index()
    settings = get_settings()
    index.delete(
        filter={"document_id": {"$eq": document_id}},
        namespace=settings.pinecone_index_name,
    )


async def similarity_search(query: str, top_k: int, filter_dict: dict | None = None) -> list[dict]:
    vector_store = get_vector_store()
    results = await vector_store.asimilarity_search_with_score(
        query=query,
        k=top_k,
        filter=filter_dict,
    )
    return [
        {
            "content": doc.page_content,
            "metadata": doc.metadata,
            "score": float(score),
        }
        for doc, score in results
    ]
