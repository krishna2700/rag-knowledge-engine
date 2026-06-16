"use client";

import { useCallback, useState } from "react";
import { Header } from "@/components/layout/header";
import { DocumentUploader } from "@/components/documents/document-uploader";
import { DocumentList } from "@/components/documents/document-list";
import { useDocuments } from "@/features/documents/use-documents";
import type { Document } from "@/types";

export default function DocumentsPage() {
  const { documents, isLoading, error, refetch, deleteDocument } = useDocuments();

  const handleUploaded = useCallback(
    (_doc: Document) => {
      refetch();
    },
    [refetch]
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Documents"
        subtitle={`${documents.length} document${documents.length !== 1 ? "s" : ""} in knowledge base`}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-navy-700">Upload Document</h2>
            <DocumentUploader onUploaded={handleUploaded} />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-navy-700">Knowledge Base</h2>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 animate-pulse rounded-xl bg-navy-50" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : documents.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-navy-200 py-12 text-center">
                <span className="text-3xl">📭</span>
                <div>
                  <p className="text-sm font-medium text-navy-700">No documents yet</p>
                  <p className="text-xs text-navy-400">Upload a document above to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-start gap-4 rounded-xl border border-navy-100 bg-white p-4 hover:border-navy-200 hover:shadow-sm transition-all"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-alice-blue border border-navy-100 text-xl">
                      {doc.metadata.file_type === "pdf" ? "📕" : doc.metadata.file_type === "docx" ? "📘" : "📄"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-navy-800">{doc.title}</p>
                      <p className="mt-1 text-xs text-navy-400">
                        {(doc.metadata.file_size_bytes / 1024).toFixed(1)} KB
                        {doc.metadata.chunk_count > 0 && ` · ${doc.metadata.chunk_count} chunks`}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        doc.status === "ready"
                          ? "bg-emerald-100 text-emerald-800"
                          : doc.status === "processing"
                          ? "bg-blue-100 text-blue-800"
                          : doc.status === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {doc.status}
                    </span>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="shrink-0 rounded-lg p-1.5 text-navy-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
