"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
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
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all",
          isDragging
            ? "border-navy-400 bg-alice-blue scale-[1.01]"
            : "border-navy-200 bg-white hover:border-navy-300 hover:bg-alice-blue"
        )}
      >
        <input
          type="file"
          className="sr-only"
          accept={Object.keys(ACCEPTED_FILE_TYPES).join(",")}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isUploading}
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-alice-blue border border-navy-100 text-2xl">
          {isUploading ? "⏳" : "📤"}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-navy-700">
            {isUploading ? "Processing document…" : "Drop a file or click to upload"}
          </p>
          <p className="mt-1 text-xs text-navy-400">
            PDF, DOCX, HTML, Markdown, TXT · Max {MAX_FILE_SIZE_MB} MB
          </p>
        </div>

        {isUploading && (
          <div className="w-full max-w-xs">
            <div className="h-1.5 w-full rounded-full bg-navy-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-navy-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </label>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
};
