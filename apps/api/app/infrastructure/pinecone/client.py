from functools import lru_cache
from pinecone import Pinecone, ServerlessSpec
from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


@lru_cache
def get_pinecone_client() -> Pinecone:
    settings = get_settings()
    return Pinecone(api_key=settings.pinecone_api_key)


def ensure_index_exists() -> None:
    settings = get_settings()
    pc = get_pinecone_client()
    existing = [idx.name for idx in pc.list_indexes()]

    if settings.pinecone_index_name not in existing:
        logger.info("creating_pinecone_index", index=settings.pinecone_index_name)
        pc.create_index(
            name=settings.pinecone_index_name,
            dimension=settings.embedding_dimensions,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region=settings.pinecone_environment),
        )
        logger.info("pinecone_index_created", index=settings.pinecone_index_name)


def get_index():
    settings = get_settings()
    pc = get_pinecone_client()
    return pc.Index(settings.pinecone_index_name)
