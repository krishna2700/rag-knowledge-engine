from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "RAG Knowledge Engine"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = False

    openai_api_key: str
    openai_embedding_model: str = "text-embedding-3-small"
    openai_chat_model: str = "gpt-4o"
    embedding_dimensions: int = 1536

    pinecone_api_key: str
    pinecone_index_name: str = "rag-knowledge-engine"
    pinecone_environment: str = "us-east-1-aws"

    chunk_size: int = 1000
    chunk_overlap: int = 200
    max_retrieval_docs: int = 6
    bm25_weight: float = 0.4
    vector_weight: float = 0.6

    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"
    s3_bucket_name: str = ""

    upload_dir: str = "/tmp/rag_uploads"
    max_upload_size_mb: int = 50
    allowed_extensions: list[str] = ["pdf", "docx", "html", "htm", "md", "markdown", "txt"]

    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:3001"]
    rate_limit_per_minute: int = 60


@lru_cache
def get_settings() -> Settings:
    return Settings()
