"use client";

import { useState, useCallback, useEffect } from "react";
import { documentsApi } from "@/lib/api-client";
import type { Document } from "@/types";

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await documentsApi.list();
      setDocuments(res.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const deleteDocument = useCallback(
    async (id: string) => {
      await documentsApi.delete(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    },
    []
  );

  return { documents, isLoading, error, refetch: fetchDocuments, deleteDocument };
};
