# RAG Knowledge Engine

A production-grade Retrieval-Augmented Generation (RAG) Knowledge Engine — a full-stack AI application with a dark glassmorphic UI, hybrid search, and GPT-4o streaming responses.

---

## What We Built

A complete AI-powered document Q&A system where you can:
- Upload documents (PDF, DOCX, HTML, Markdown, TXT)
- Ask natural language questions about them
- Get streaming GPT-4o answers with source citations
- Manage your knowledge base with a beautiful dark UI

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 · TypeScript · Tailwind CSS v4 |
| Backend | FastAPI · Python 3.11 |
| LLM | GPT-4o (OpenAI) |
| LLM Orchestration | LangChain LCEL |
| Vector DB | Pinecone (serverless) |
| Hybrid Search | BM25 (rank-bm25) + Vector (cosine) via RRF |
| Embeddings | OpenAI `text-embedding-3-small` (1536 dims) |
| Streaming | Server-Sent Events (SSE) |
| Rate Limiting | slowapi (60 req/min) |
| Logging | structlog (structured JSON) |
| Infra | Docker · docker-compose |

---

## Features

- **Multi-format ingestion** — PDF, DOCX, HTML, Markdown, TXT (up to 50MB)
- **Hybrid search** — BM25 lexical + Pinecone vector search fused via Reciprocal Rank Fusion (RRF)
- **Streaming responses** — Real-time SSE token streaming from GPT-4o
- **Source citations** — Every answer links back to source chunks with relevance scores
- **Chat history** — Persisted to localStorage, survives page refreshes
- **Auto-polling** — Document status updates automatically (processing → ready)
- **Dark glassmorphic UI** — Deep space background, glass surfaces, indigo/violet accents
- **Clean architecture** — Domain / Infrastructure / API separation
- **Rate limiting** — Per-IP rate limiting via slowapi
- **Structured logging** — Request context propagation with structlog

---

## Project Structure

```
rag-knowledge-engine/
├── .env.example              # Environment variable template
├── .gitignore                # Protects .env and build artifacts
├── docker-compose.yml        # Docker orchestration
├── README.md
└── apps/
    ├── api/                  # FastAPI Python backend
    │   ├── Dockerfile
    │   ├── requirements.txt
    │   └── app/
    │       ├── main.py               # FastAPI app, CORS, rate limiting, lifespan
    │       ├── core/
    │       │   ├── config.py         # Pydantic Settings (all env vars)
    │       │   └── logging.py        # structlog setup
    │       ├── api/v1/routes/
    │       │   ├── health.py         # GET /api/v1/health
    │       │   ├── documents.py      # Upload, list, get, delete
    │       │   └── query.py          # SSE streaming + non-streaming RAG
    │       ├── domain/
    │       │   ├── documents/        # Models, service, in-memory repository
    │       │   └── query/            # Models, RAG query service
    │       ├── infrastructure/
    │       │   ├── pinecone/         # Vector store client, upsert, similarity search
    │       │   └── langchain/        # Parsers, chunker, hybrid search, RAG chain
    │       └── shared/               # Typed exceptions, response models, middleware
    └── web/                  # Next.js 16 frontend
        └── src/
            ├── app/
            │   ├── layout.tsx        # Root layout (Inter font, dark mesh background)
            │   ├── page.tsx          # Chat page
            │   ├── globals.css       # Tailwind v4 base
            │   ├── theme.css         # Full dark glassmorphic design system
            │   └── documents/
            │       └── page.tsx      # Document manager page
            ├── components/
            │   ├── chat/             # ChatWindow, MessageBubble, ChatInput
            │   ├── documents/        # DocumentUploader, DocumentCard, DocumentList
            │   ├── layout/           # Sidebar, Header
            │   └── ui/               # Button, Badge (CVA-based)
            ├── features/
            │   ├── chat/             # useChat (SSE streaming, localStorage history)
            │   └── documents/        # useDocuments (auto-poll), useUpload
            ├── lib/
            │   ├── api-client.ts     # Type-safe fetch + SSE stream consumer
            │   ├── constants.ts      # API URL, accepted file types
            │   └── utils.ts          # cn(), formatBytes(), formatDate()
            └── types/index.ts        # All TypeScript types
```

---

## RAG Pipeline

```
File Upload
    ↓
Parser (PDF / DOCX / HTML / Markdown / TXT)
    ↓
RecursiveCharacterTextSplitter (1000 chars, 200 overlap)
    ↓
OpenAI text-embedding-3-small → Pinecone upsert
    ↓
Query → BM25 (lexical) + Vector (cosine similarity)
    ↓
Reciprocal Rank Fusion (RRF)
    ↓
LangChain LCEL → GPT-4o → SSE stream → Frontend
```

---

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

---

## Prerequisites

- Python 3.11
- Node.js 18+
- OpenAI account with API key + credits
- Pinecone account (free tier works)

---

## Environment Setup

### 1. Get your API keys

**OpenAI API Key:**
1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Add billing credits at [platform.openai.com/settings/organization/billing](https://platform.openai.com/settings/organization/billing) (minimum $5)

**Pinecone API Key:**
1. Go to [app.pinecone.io](https://app.pinecone.io) → sign up free
2. Copy your API key from the **API Keys** section

**Pinecone Index (create manually):**
1. Go to [app.pinecone.io](https://app.pinecone.io) → **Indexes** → **Create Index**
2. Check **"Custom settings"**
3. Set:
   - Name: `rag-knowledge-engine`
   - Dimensions: `1536`
   - Metric: `cosine`
   - Cloud: AWS · Region: `us-east-1`
4. Click **Create Index**

### 2. Create your `.env` file

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
OPENAI_API_KEY=sk-...
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4o

PINECONE_API_KEY=pcsk_...
PINECONE_INDEX_NAME=rag-knowledge-engine
PINECONE_ENVIRONMENT=us-east-1

# Leave AWS blank (not required for local dev)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=

ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=["http://localhost:3000"]
RATE_LIMIT_PER_MINUTE=60

NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Starting the Servers

### Option A — Local (recommended for development)

**Terminal 1 — Backend:**
```bash
cd apps/api
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Then start from the project root:
```bash
cd /path/to/rag-knowledge-engine
apps/api/venv/bin/uvicorn app.main:app --reload --port 8000 --app-dir apps/api
```

✅ API running at: http://localhost:8000

**Terminal 2 — Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

✅ Frontend running at: http://localhost:3000

### Option B — Docker

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8000

---

## Verify Everything Works

```bash
# Check API health
curl http://localhost:8000/api/v1/health
# Expected: {"success":true,"data":{"status":"healthy","version":"1.0.0","environment":"development"}}
```

Then open [http://localhost:3000](http://localhost:3000):
1. Go to **Documents** → upload a PDF
2. Wait for status to change to **Ready** (auto-updates)
3. Go to **Chat** → ask a question
4. See streaming GPT-4o response with source citations

---

## Engineering Standards

- ✅ Arrow functions throughout — no `function` keyword
- ✅ Strict TypeScript — no `any`, proper generics
- ✅ Zero business logic in UI components
- ✅ Clean architecture — domain / infrastructure / API separation
- ✅ DRY — shared hooks, utilities, response models
- ✅ `memo`, `useCallback`, `useMemo` where they provide real value
- ✅ Proper error states, loading states, edge cases handled
- ✅ Feature/domain folder organization
- ✅ Chat history persisted to localStorage
- ✅ Auto-polling for document processing status
