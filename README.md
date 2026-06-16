# RAG Knowledge Engine

A production-grade Retrieval-Augmented Generation (RAG) pipeline with a modern Next.js frontend.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · TypeScript · Tailwind CSS v4 |
| Backend | FastAPI · Python 3.11 |
| LLM Orchestration | LangChain · GPT-4o |
| Vector DB | Pinecone (serverless) |
| Hybrid Search | BM25 (rank-bm25) + Vector (cosine) via RRF |
| Embeddings | OpenAI `text-embedding-3-small` |
| Infra | Docker · docker-compose · AWS-ready |

## Features

- **Multi-format ingestion** — PDF, DOCX, HTML, Markdown, TXT
- **Semantic chunking** — `RecursiveCharacterTextSplitter` with configurable overlap
- **Hybrid search** — BM25 + vector similarity fused via Reciprocal Rank Fusion (RRF)
- **Streaming responses** — Server-Sent Events (SSE) from FastAPI → Next.js
- **Source citations** — Every answer links back to source chunks with relevance scores
- **Rate limiting** — `slowapi` per-IP rate limiting
- **Structured logging** — `structlog` with request context propagation

## Project Structure

```
apps/
├── api/          # FastAPI backend
│   └── app/
│       ├── core/           # Config, logging
│       ├── api/v1/routes/  # HTTP endpoints
│       ├── domain/         # Business logic (documents, query)
│       ├── infrastructure/ # Pinecone, LangChain, parsers
│       └── shared/         # Exceptions, response models, middleware
└── web/          # Next.js frontend
    └── src/
        ├── app/            # App Router pages
        ├── components/     # UI components (chat, documents, layout)
        ├── features/       # Feature hooks (useChat, useDocuments, useUpload)
        ├── lib/            # API client, utils, constants
        └── types/          # TypeScript types
```

## Quick Start

### 1. Configure environment

```bash
cp .env.example .env
# Fill in OPENAI_API_KEY and PINECONE_API_KEY
```

### 2. Run with Docker Compose

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs (debug mode only)

### 3. Run locally

**Backend:**
```bash
cd apps/api
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Health check |
| `POST` | `/api/v1/documents/` | Upload & ingest document |
| `GET` | `/api/v1/documents/` | List all documents |
| `GET` | `/api/v1/documents/{id}` | Get document by ID |
| `DELETE` | `/api/v1/documents/{id}` | Delete document + vectors |
| `POST` | `/api/v1/query/stream` | Streaming RAG query (SSE) |
| `POST` | `/api/v1/query/` | Non-streaming RAG query |

## Architecture

```
User Query
    │
    ▼
Hybrid Search
    ├── BM25 (lexical)
    └── Pinecone (semantic)
         │
         ▼
    RRF Fusion
         │
         ▼
  LangChain RAG Chain
    (GPT-4o + context)
         │
         ▼
  SSE Stream → Frontend
```
