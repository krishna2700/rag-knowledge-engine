"use client";

import { useCallback } from "react";
import { DocumentCard } from "@/components/documents/document-card";
import { useDocuments } from "@/features/documents/use-documents";
import type { Document } from "@/types";

interface DocumentListProps {
  onDocumentAdded?: Document | null;
}

export const DocumentList = () => {
  const { documents, isLoading, error, deleteDocument } = useDocuments();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-navy-50" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-navy-200 py-12 text-center">
        <span className="text-3xl">📭</span>
        <div>
          <p className="text-sm font-medium text-navy-700">No documents yet</p>
          <p className="text-xs text-navy-400">Upload a document above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} onDelete={deleteDocument} />
      ))}
    </div>
  );
};
