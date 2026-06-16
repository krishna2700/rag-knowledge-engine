export type DocumentStatus = "pending" | "processing" | "ready" | "failed";

export interface DocumentMetadata {
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  chunk_count: number;
  page_count: number | null;
}

export interface Document {
  id: string;
  title: string;
  status: DocumentStatus;
  metadata: DocumentMetadata;
  created_at: string;
  updated_at: string;
  error_message: string | null;
}

export interface SourceChunk {
  document_id: string;
  document_title: string;
  content: string;
  score: number;
  page: number | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceChunk[];
  isStreaming?: boolean;
  timestamp: Date;
}

export interface QueryRequest {
  query: string;
  top_k?: number;
  document_ids?: string[];
}

export interface StreamChunk {
  type: "token" | "sources" | "done" | "error";
  content: string;
  sources?: SourceChunk[];
}

export interface APIResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

export interface DocumentListResponse {
  documents: Document[];
  total: number;
}

export interface DocumentUploadResponse {
  document: Document;
  message: string;
}
