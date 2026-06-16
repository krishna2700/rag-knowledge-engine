from typing import AsyncGenerator
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.core.config import get_settings
from app.domain.query.models import SourceChunk
from app.core.logging import get_logger

logger = get_logger(__name__)

SYSTEM_PROMPT = """You are an expert knowledge assistant. Answer the user's question using ONLY the provided context.
If the context does not contain enough information to answer the question, say so clearly.
Be concise, accurate, and cite relevant information from the context.

Context:
{context}"""

HUMAN_PROMPT = "{question}"


def _build_context(sources: list[SourceChunk]) -> str:
    return "\n\n---\n\n".join(
        f"[Source: {s.document_title}]\n{s.content}"
        for s in sources
    )


def _get_llm(streaming: bool = False) -> ChatOpenAI:
    settings = get_settings()
    return ChatOpenAI(
        model=settings.openai_chat_model,
        openai_api_key=settings.openai_api_key,
        temperature=0.1,
        streaming=streaming,
    )


async def stream_rag_response(
    query: str,
    sources: list[SourceChunk],
) -> AsyncGenerator[str, None]:
    context = _build_context(sources)
    llm = _get_llm(streaming=True)

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", HUMAN_PROMPT),
    ])

    chain = prompt | llm | StrOutputParser()

    async for token in chain.astream({"context": context, "question": query}):
        yield token


async def generate_rag_response(query: str, sources: list[SourceChunk]) -> str:
    context = _build_context(sources)
    llm = _get_llm(streaming=False)

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", HUMAN_PROMPT),
    ])

    chain = prompt | llm | StrOutputParser()
    return await chain.ainvoke({"context": context, "question": query})
