import { API_V1 } from "@/lib/constants";
import type {
  APIResponse,
  Document,
  DocumentListResponse,
  DocumentUploadResponse,
  QueryRequest,
  StreamChunk,
} from "@/types";

const request = async <T>(
  path: string,
  options?: RequestInit
): Promise<T> => {
  const res = await fetch(`${API_V1}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail ?? "Request failed");
  }

  return res.json() as Promise<T>;
};

export const documentsApi = {
  list: () => request<DocumentListResponse>("/documents"),

  get: (id: string) => request<APIResponse<Document>>(`/documents/${id}`),

  upload: async (file: File): Promise<DocumentUploadResponse> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API_V1}/documents/`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(error.detail ?? "Upload failed");
    }
    return res.json();
  },

  delete: (id: string) =>
    request<APIResponse<null>>(`/documents/${id}`, { method: "DELETE" }),
};

export const queryApi = {
  stream: async (
    payload: QueryRequest,
    onChunk: (chunk: StreamChunk) => void,
    signal?: AbortSignal
  ): Promise<void> => {
    const res = await fetch(`${API_V1}/query/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });

    if (!res.ok || !res.body) {
      throw new Error("Stream request failed");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const chunk = JSON.parse(line.slice(6)) as StreamChunk;
            onChunk(chunk);
          } catch {
            // malformed chunk — skip
          }
        }
      }
    }
  },
};
