"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { documentsApi } from "@/lib/api-client";
import type { Document } from "@/types";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchDocuments = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      setError(null);
      const res = await documentsApi.list();
      setDocuments(res.documents);
      return res.documents;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
      return [];
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const docs = await fetchDocuments(true);
      const hasProcessing = docs.some(
        (d: Document) => d.status === "processing" || d.status === "pending"
      );
      if (!hasProcessing) stopPolling();
    }, 2000);
  }, [fetchDocuments, stopPolling]);

  useEffect(() => {
    fetchDocuments();
    return () => stopPolling();
  }, [fetchDocuments, stopPolling]);

  useEffect(() => {
    const hasProcessing = documents.some(
      (d) => d.status === "processing" || d.status === "pending"
    );
    if (hasProcessing && !pollRef.current) startPolling();
    if (!hasProcessing) stopPolling();
  }, [documents, startPolling, stopPolling]);

  const deleteDocument = useCallback(async (id: string) => {
    await documentsApi.delete(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { documents, isLoading, error, refetch: fetchDocuments, deleteDocument };
};
