"use client";

import { useState, useCallback, useRef } from "react";
import { queryApi } from "@/lib/api-client";
import type { ChatMessage, SourceChunk, StreamChunk } from "@/types";

const generateId = () => Math.random().toString(36).slice(2);

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (query: string, documentIds?: string[]) => {
    if (!query.trim() || isStreaming) return;

    setError(null);

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    const assistantId = generateId();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      isStreaming: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);

    abortRef.current = new AbortController();

    let collectedSources: SourceChunk[] = [];

    try {
      await queryApi.stream(
        { query, top_k: 6, document_ids: documentIds },
        (chunk: StreamChunk) => {
          if (chunk.type === "sources" && chunk.sources) {
            collectedSources = chunk.sources;
          } else if (chunk.type === "token") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk.content }
                  : m
              )
            );
          } else if (chunk.type === "done") {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, isStreaming: false, sources: collectedSources }
                  : m
              )
            );
          } else if (chunk.type === "error") {
            setError(chunk.content);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, isStreaming: false } : m
              )
            );
          }
        },
        abortRef.current.signal
      );
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Query failed");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages };
};
