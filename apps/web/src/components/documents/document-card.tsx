"use client";

import { memo, useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatDate } from "@/lib/utils";
import type { Document, DocumentStatus } from "@/types";

const STATUS_CONFIG: Record<DocumentStatus, { label: string; variant: "success" | "warning" | "danger" | "processing" | "default" }> = {
  ready:      { label: "Ready",      variant: "success" },
  processing: { label: "Processing", variant: "processing" },
  pending:    { label: "Pending",    variant: "warning" },
  failed:     { label: "Failed",     variant: "danger" },
};

const FILE_TYPE_ICONS: Record<string, React.ReactNode> = {
  pdf: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  docx: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  md: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
};

const getFileIcon = (fileType: string): React.ReactNode =>
  FILE_TYPE_ICONS[fileType] ?? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => Promise<void>;
}

export const DocumentCard = memo(({ document, onDelete }: DocumentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const status = STATUS_CONFIG[document.status];

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onDelete(document.id);
    } finally {
      setIsDeleting(false);
    }
  }, [document.id, onDelete]);

  return (
    <div
      className="flex items-start gap-4 rounded-2xl p-4 transition-all duration-200 animate-fade-up"
      style={{
        background: isHovered ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)",
        border: isHovered ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {getFileIcon(document.metadata.file_type)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium" style={{ color: "#e2e8f0" }}>
            {document.title}
          </p>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: "#334155" }}>
          <span>{formatBytes(document.metadata.file_size_bytes)}</span>
          {document.metadata.chunk_count > 0 && (
            <span>{document.metadata.chunk_count} chunks</span>
          )}
          <span>{formatDate(document.created_at)}</span>
        </div>

        {document.error_message && (
          <p className="mt-1.5 text-xs" style={{ color: "#f43f5e" }}>
            {document.error_message}
          </p>
        )}
      </div>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-40"
        style={{ color: "#334155" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(244,63,94,0.12)";
          (e.currentTarget as HTMLButtonElement).style.color = "#f43f5e";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "#334155";
        }}
      >
        {isDeleting ? (
          <svg className="animate-spin-slow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        )}
      </button>
    </div>
  );
});

DocumentCard.displayName = "DocumentCard";
