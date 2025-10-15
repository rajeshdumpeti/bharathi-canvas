import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DocItem } from "types/documents";
import * as docsApi from "api/documents";

export type DocsState = {
  items: DocItem[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchDocuments: (projectId: string) => Promise<void>;
  uploadDocument: (projectId: string, file: File) => Promise<void>;
  deleteDocument: (doc: DocItem) => Promise<void>;
  setSelected: (id: string | null) => void;
  setItems: (docs: DocItem[]) => void;
};

export const useDocsStore = create<DocsState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedId: null,
      loading: false,
      error: null,

      async fetchDocuments(projectId) {
        try {
          set({ loading: true, error: null });
          const data = await docsApi.listDocuments(projectId);
          set({ items: data, loading: false });
        } catch (err: any) {
          console.error("❌ fetchDocuments failed", err);
          set({
            error: err.message || "Failed to load documents",
            loading: false,
          });
        }
      },

      async uploadDocument(projectId, file) {
        try {
          set({ loading: true });

          // 1️⃣ Call backend upload
          const newDoc = await docsApi.uploadDocument(projectId, file);

          // 2️⃣ Generate preview DataURL (for immediate UI display)
          const previewDataUrl = await new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          });

          const enrichedDoc = {
            ...newDoc,
            name: newDoc.original_name || file.name,
            type: newDoc.file_type || file.type,
            size: newDoc.file_size || file.size,
            dataURL: previewDataUrl,
          };

          // 4️⃣ Update store
          set({ items: [enrichedDoc, ...get().items], loading: false });
        } catch (err: any) {
          console.error("❌ uploadDocument failed", err);
          set({
            error: err.message || "Failed to upload document",
            loading: false,
          });
        }
      },

      async deleteDocument(doc) {
        try {
          await docsApi.deleteDocument(doc.id);
          const updated = get().items.filter((d) => d.id !== doc.id);
          set({ items: updated });
        } catch (err: any) {
          console.error("❌ deleteDocument failed", err);
        }
      },

      setSelected(id) {
        set({ selectedId: id });
      },

      setItems(docs) {
        set({ items: docs });
      },
    }),
    {
      name: "docs-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
