// src/types/document.ts
export type DocItem = {
  id: string;
  name: string;
  /** Browser mime (e.g. application/pdf) OR extension (pdf|txt|docx) */
  type: string;
  size: number; // bytes
  createdAt: string; // ISO
  dataURL: string | null; // for pdf/docx preview
  text: string | null; // for txt preview
  file?: File;
};

export type DocUploadResult =
  | { kind: "data"; dataURL: string }
  | { kind: "txt"; text: string };
