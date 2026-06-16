export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const API_V1 = `${API_BASE_URL}/api/v1`;

export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/html": [".html", ".htm"],
  "text/markdown": [".md", ".markdown"],
  "text/plain": [".txt"],
};

export const MAX_FILE_SIZE_MB = 50;
