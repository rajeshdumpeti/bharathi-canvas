// src/stores/docs.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DOCS_NS } from "packages/storage";
import type { DocItem, DocUploadResult } from "types/documents";

export type DocsState = {
  items: DocItem[];
  selectedId: string | null;

  pending: File[];
  error: string;

  // actions
  setSelected: (id: string | null) => void;
  clearSelectedIfDeleted: (deletedId: string) => void;

  stageFiles: (files: File[]) => void;
  clearPending: () => void;
  setError: (msg: string) => void;
  clearError: () => void;

  addDocuments: (files: File[]) => Promise<void>;
  deleteDocument: (doc: DocItem) => void;
};

// namespaced storage (stable reference)
const namespacedStorage = {
  getItem: (name: string) => localStorage.getItem(`${DOCS_NS}:${name}`) ?? null,
  setItem: (name: string, value: string) =>
    localStorage.setItem(`${DOCS_NS}:${name}`, value),
  removeItem: (name: string) => localStorage.removeItem(`${DOCS_NS}:${name}`),
} as const;

const storage = createJSONStorage(() => namespacedStorage);

const MAX = 5 * 1024 * 1024;
const allowMimes = [
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const byExtOK = (name: string) => /\.(pdf|txt|docx)$/i.test(name);

function readFileAsResult(file: File): Promise<DocUploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const isTxt = file.type === "text/plain" || /\.txt$/i.test(file.name);
    if (isTxt) {
      reader.onload = () =>
        resolve({ kind: "txt", text: String(reader.result ?? "") });
      reader.onerror = reject;
      reader.readAsText(file);
      return;
    }
    reader.onload = () =>
      resolve({ kind: "data", dataURL: String(reader.result ?? "") });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const useDocsStore = create<DocsState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedId: null,
      pending: [],
      error: "",

      setSelected: (id) =>
        set((s) => (s.selectedId === id ? s : { selectedId: id })),

      clearSelectedIfDeleted: (deletedId) => {
        const { selectedId, items } = get();
        if (selectedId === deletedId) {
          const next = items.find((d) => d.id !== deletedId)?.id ?? null;
          set({ selectedId: next });
        }
      },

      stageFiles: (files) => {
        if (!files?.length) return;
        const cur = get().pending;
        const key = (f: File) => `${f.name}-${f.size}`;
        const existing = new Set(cur.map(key));
        const merged = [...cur];
        files.forEach((f) => {
          if (!existing.has(key(f))) merged.push(f);
        });
        set({ pending: merged, error: "" });
      },
      clearPending: () => set({ pending: [] }),
      setError: (msg) => set({ error: msg }),
      clearError: () => set({ error: "" }),

      addDocuments: async (files) => {
        if (!files?.length) return;

        // validation
        for (const f of files) {
          if (f.size > MAX) {
            set({ error: `"${f.name}" is larger than 5 MB.` });
            return;
          }
          if (!(allowMimes.includes(f.type) || byExtOK(f.name))) {
            set({
              error: `"${f.name}" is not a supported type (PDF, DOCX, TXT).`,
            });
            return;
          }
        }

        try {
          const results = await Promise.all(files.map(readFileAsResult));
          const toAdd: DocItem[] = results.map((res, idx) => {
            const f = files[idx];
            return {
              id: `${Date.now()}-${idx}-${Math.random()
                .toString(36)
                .slice(2, 7)}`,
              name: f.name,
              type:
                f.type || (f.name.match(/\.(\w+)$/)?.[1] || "").toLowerCase(),
              size: f.size,
              createdAt: new Date().toISOString(),
              dataURL: res.kind === "data" ? res.dataURL : null,
              text: res.kind === "txt" ? res.text : null,
            };
          });

          const items = [...get().items, ...toAdd];
          const selectedId = get().selectedId ?? items[0]?.id ?? null;

          set({ items, selectedId, pending: [], error: "" });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
          set({ error: "Failed to read one or more files." });
        }
      },

      deleteDocument: (doc) =>
        set((s) => {
          const next = s.items.filter((d) => d.id !== doc.id);
          const nextSelected =
            s.selectedId === doc.id ? (next[0]?.id ?? null) : s.selectedId;
          // If nothing changed, return previous state (prevents useless notifications)
          if (next === s.items && nextSelected === s.selectedId) return s;
          return { items: next, selectedId: nextSelected };
        }),
    }),
    {
      name: `${DOCS_NS}:store`,
      version: 1,
      storage,
      // ✅ Persist ONLY data, not actions. This avoids rehydrate/set loops.
      partialize: (s) => ({
        items: s.items,
        selectedId: s.selectedId,
      }),
    }
  )
);
