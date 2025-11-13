import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { DocItem } from "types/documents";
import * as docsApi from "api/documents";

// Define the namespace for session storage
export const DOCS_NS = "bc-docs";

export type DocsState = {
  items: DocItem[];
  selectedId: string | null;
  loading: boolean;
  error: string | null;

  fetchDocuments: (projectId: string) => Promise<void>;
  uploadDocument: (projectId: string, file: File) => Promise<void>;
  deleteDocument: (doc: DocItem) => Promise<void>;
  setSelected: (id: string | null) => void;
  setItems: (docs: DocItem[]) => void;
};

/**
 * Normalizes a raw document from the backend (DocumentOut)
 * into the frontend DocItem type.
 */
function normalizeDoc(doc: DocItem): DocItem {
  return {
    ...doc,
    name: doc.original_name || doc.name,
    type: doc.file_type || doc.type,
    size: doc.file_size || doc.size || 0,
    // Ensure project_id is present
    project_id: doc.project_id || (doc as any).project,
  };
}

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
          const rawData = await docsApi.listDocuments(projectId);

          // FIX: Normalize the raw data from the API
          const normalizedData = rawData.map(normalizeDoc);

          set({ items: normalizedData, loading: false });
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
          const newDoc = await docsApi.uploadDocument(projectId, file);

          const previewDataUrl = await new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          });

          if (previewDataUrl) {
            // FIX: Save to session storage
            sessionStorage.setItem(
              `${DOCS_NS}:blob:${newDoc.id}`,
              previewDataUrl
            );
          }

          // FIX: Use the same normalization function
          const enrichedDoc = normalizeDoc({
            ...newDoc,
            dataURL: previewDataUrl,
            // Add file defaults as fallbacks
            name: file.name,
            type: file.type,
            size: file.size,
          });

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

          // FIX: Also clear session storage on delete
          sessionStorage.removeItem(`${DOCS_NS}:blob:${doc.id}`);
          sessionStorage.removeItem(`${DOCS_NS}:txt:${doc.id}`);

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
      // FIX: Only persist settings, not the full items list.
      // This forces a fresh fetch and prevents stale data.
      partialize: (state) => ({
        selectedId: state.selectedId,
      }),
    }
  )
);
