"use client";

import { memo, useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBytes, formatDate } from "@/lib/utils";
import type { Document, DocumentStatus } from "@/types";

const STATUS_CONFIG: Record<DocumentStatus, { label: string; variant: "success" | "warning" | "danger" | "processing" | "default" }> = {
  ready: { label: "Ready", variant: "success" },
  processing: { label: "Processing", variant: "processing" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
};

const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: "📕",
  docx: "📘",
  html: "🌐",
  htm: "🌐",
  md: "📝",
  markdown: "📝",
  txt: "📄",
};

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => Promise<void>;
}

export const DocumentCard = memo(({ document, onDelete }: DocumentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const status = STATUS_CONFIG[document.status];
  const icon = FILE_TYPE_ICONS[document.metadata.file_type] ?? "📄";

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await onDelete(document.id);
    } finally {
      setIsDeleting(false);
    }
  }, [document.id, onDelete]);

  return (
    <div className="flex items-start gap-4 rounded-xl border border-navy-100 bg-white p-4 hover:border-navy-200 hover:shadow-sm transition-all">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-alice-blue border border-navy-100 text-xl">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium text-navy-800">{document.title}</p>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-400">
          <span>{formatBytes(document.metadata.file_size_bytes)}</span>
          {document.metadata.chunk_count > 0 && (
            <span>{document.metadata.chunk_count} chunks</span>
          )}
          <span>{formatDate(document.created_at)}</span>
        </div>

        {document.error_message && (
          <p className="mt-1.5 text-xs text-red-600">{document.error_message}</p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isDeleting}
        className="shrink-0 text-navy-400 hover:text-red-600 hover:bg-red-50"
      >
        {isDeleting ? "…" : "✕"}
      </Button>
    </div>
  );
});

DocumentCard.displayName = "DocumentCard";
