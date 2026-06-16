"use client";

import { useCallback } from "react";
import { Header } from "@/components/layout/header";
import { DocumentUploader } from "@/components/documents/document-uploader";
import { DocumentCard } from "@/components/documents/document-card";
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

  const readyCount = documents.filter((d) => d.status === "ready").length;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Documents"
        subtitle={`${documents.length} document${documents.length !== 1 ? "s" : ""} · ${readyCount} ready`}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-8">

          {/* Stats row */}
          {documents.length > 0 && (
            <div className="grid grid-cols-3 gap-3 animate-fade-up">
              {[
                { label: "Total", value: documents.length, color: "#818cf8" },
                { label: "Ready", value: readyCount, color: "#10b981" },
                { label: "Processing", value: documents.filter((d) => d.status === "processing" || d.status === "pending").length, color: "#38bdf8" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#334155" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Upload section */}
          <section className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#334155" }}>
              Upload Document
            </p>
            <DocumentUploader onUploaded={handleUploaded} />
          </section>

          {/* Knowledge base section */}
          <section className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "#334155" }}>
              Knowledge Base
            </p>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-2xl skeleton"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            ) : error ? (
              <div
                className="rounded-2xl px-4 py-4 text-sm animate-fade-in"
                style={{
                  background: "rgba(244,63,94,0.08)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  color: "#fda4af",
                }}
              >
                {error}
              </div>
            ) : documents.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-14 text-center animate-fade-in"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#475569" }}>No documents yet</p>
                  <p className="text-xs mt-1" style={{ color: "#334155" }}>Upload a document above to get started</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} onDelete={deleteDocument} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
