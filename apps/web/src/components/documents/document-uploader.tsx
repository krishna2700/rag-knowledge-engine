"use client";

import { useCallback, useState } from "react";
import { useUpload } from "@/features/documents/use-upload";
import type { Document } from "@/types";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from "@/lib/constants";

interface DocumentUploaderProps {
  onUploaded: (doc: Document) => void;
}

export const DocumentUploader = ({ onUploaded }: DocumentUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { isUploading, progress, error, upload } = useUpload(onUploaded);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      upload(files[0]);
    },
    [upload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div className="space-y-3">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-300"
        style={
          isDragging
            ? {
                borderColor: "rgba(99,102,241,0.7)",
                background: "rgba(99,102,241,0.08)",
                boxShadow: "0 0 30px rgba(99,102,241,0.15), inset 0 0 30px rgba(99,102,241,0.05)",
                transform: "scale(1.01)",
              }
            : {
                borderColor: "rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
              }
        }
      >
        <input
          type="file"
          className="sr-only"
          accept={Object.keys(ACCEPTED_FILE_TYPES).join(",")}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isUploading}
        />

        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300"
          style={
            isUploading
              ? {
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.2)",
                }
              : isDragging
              ? {
                  background: "rgba(99,102,241,0.2)",
                  border: "1px solid rgba(99,102,241,0.4)",
                }
              : {
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }
          }
        >
          {isUploading ? (
            <svg
              className="animate-spin-slow"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#uploadGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <defs>
                <linearGradient id="uploadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isDragging ? "#818cf8" : "#475569"}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-medium" style={{ color: isUploading ? "#818cf8" : "#94a3b8" }}>
            {isUploading ? "Processing document…" : isDragging ? "Drop to upload" : "Drop a file or click to upload"}
          </p>
          <p className="text-xs" style={{ color: "#334155" }}>
            PDF, DOCX, HTML, Markdown, TXT · Max {MAX_FILE_SIZE_MB} MB
          </p>
        </div>

        {isUploading && (
          <div className="w-full max-w-xs">
            <div
              className="h-1 w-full rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full progress-shimmer transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-center text-xs" style={{ color: "#475569" }}>
              {progress}%
            </p>
          </div>
        )}
      </label>

      {error && (
        <div
          className="rounded-xl px-4 py-3 text-xs animate-fade-in"
          style={{
            background: "rgba(244,63,94,0.1)",
            border: "1px solid rgba(244,63,94,0.25)",
            color: "#fda4af",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};
