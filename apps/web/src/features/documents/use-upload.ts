"use client";

import { useState, useCallback } from "react";
import { documentsApi } from "@/lib/api-client";
import type { Document } from "@/types";
import { MAX_FILE_SIZE_MB } from "@/lib/constants";

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export const useUpload = (onSuccess: (doc: Document) => void) => {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  });

  const upload = useCallback(
    async (file: File) => {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setState((s) => ({ ...s, error: `File exceeds ${MAX_FILE_SIZE_MB} MB limit.` }));
        return;
      }

      setState({ isUploading: true, progress: 10, error: null });

      try {
        setState((s) => ({ ...s, progress: 40 }));
        const res = await documentsApi.upload(file);
        setState((s) => ({ ...s, progress: 100 }));
        onSuccess(res.document);
      } catch (err) {
        setState((s) => ({
          ...s,
          error: err instanceof Error ? err.message : "Upload failed",
        }));
      } finally {
        setTimeout(() => setState({ isUploading: false, progress: 0, error: null }), 800);
      }
    },
    [onSuccess]
  );

  return { ...state, upload };
};
