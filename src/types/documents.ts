// src/types/document.ts
export type DocItem = {
  id: string;

  /** Frontend display name (derived from original_name or file.name) */
  name: string;

  /** Browser MIME type or backend-provided type (e.g. "application/pdf") */
  type: string;

  /** File size in bytes */
  size: number;

  /** Creation timestamp from backend (ISO string) */
  createdAt?: string;

  /** Optional: for PDF/DOCX preview */
  dataURL?: string | null;

  /** Optional: for TXT preview */
  text?: string | null;

  /** For immediate upload preview */
  file?: File;

  /** ✅ Backend-returned fields */
  project_id?: string;
  original_name?: string;
  file_type?: string;
  file_size?: number;
  filename?: string;
  uploaded_at?: string;
};

export type DocUploadResult =
  | { kind: "data"; dataURL: string }
  | { kind: "txt"; text: string };
