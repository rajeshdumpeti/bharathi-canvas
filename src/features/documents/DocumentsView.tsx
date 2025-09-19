// features/documents/DocumentsView.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useDocsStore, DocsState } from "stores/docs.store";
import UploadCard from "./components/UploadCard";
import DocumentsList from "./components/DocumentsList";
import PreviewPane from "./components/PreviewPane";
import { Modal } from "packages/ui";
import type { DocItem } from "types/documents";
import { debounce } from "lodash";

const DocumentsView: React.FC = () => {
  const { documents, selectedId } = useDocsStore(
    useShallow((s: DocsState) => ({
      documents: s.items,
      selectedId: s.selectedId,
    }))
  );
  const setSelected = useDocsStore((s: DocsState) => s.setSelected);
  const deleteDoc = useDocsStore((s: DocsState) => s.deleteDocument);

  // ⬇️ NEW: replace whole list (rename/move bulk ops)
  const setItems = useDocsStore((s: DocsState) => (s as any).setItems);

  const selectedDoc = useMemo<DocItem | null>(
    () => documents.find((d) => d.id === selectedId) ?? null,
    [documents, selectedId]
  );

  // Distinct project names (excluding empty/unassigned)
  const projects = useMemo(() => {
    const set = new Set<string>();
    documents.forEach((d) => {
      const p = (d as any).project?.trim?.() ?? "";
      if (p) set.add(p);
    });
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b));
    if (!arr.includes("Unassigned")) arr.unshift("Unassigned");
    return arr;
  }, [documents]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocItem | null>(null);

  useEffect(() => {
    const debouncedHandler = debounce(() => {
      setIsSidebarOpen((prev) => !prev);
    }, 250);
    window.addEventListener("app:toggleSidebar", debouncedHandler as any);
    return () => {
      debouncedHandler.cancel();
      window.removeEventListener("app:toggleSidebar", debouncedHandler as any);
    };
  }, []);

  const confirmDeleteDocument = (doc: DocItem) => {
    setDocToDelete(doc);
    setIsDeleteDocOpen(true);
  };

  const handleDeleteDocument = () => {
    if (!docToDelete) return;
    deleteDoc(docToDelete);
    if (selectedId === docToDelete.id) setSelected(null);
    setIsDeleteDocOpen(false);
    setDocToDelete(null);
  };

  // ⬇️ NEW: rename project (bulk update)
  const renameProject = (oldName: string, newName: string) => {
    if (!setItems) {
      console.warn("docs.store: add setItems([...]) action to enable rename.");
      return;
    }
    const next = documents.map((d) => {
      const p = (d as any).project?.trim?.() ?? "";
      if (p === oldName) {
        return { ...d, project: newName } as DocItem & { project?: string };
      }
      return d;
    });
    setItems(next as any);
  };

  // ⬇️ NEW: move doc to a project (can be empty string for Unassigned)
  const moveDoc = (docId: string, project: string) => {
    if (!setItems) {
      console.warn("docs.store: add setItems([...]) action to enable move.");
      return;
    }
    const next = documents.map((d) =>
      d.id === docId ? ({ ...d, project } as any) : d
    );
    setItems(next as any);
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="flex-1 min-h-0 w-full">
        <div className="relative h-full w-full flex overflow-hidden">
          {/* mobile backdrop */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />

          {/* Sidebar */}
          <aside
            aria-label="Documents sidebar"
            className={`
              fixed lg:static inset-y-0 left-0 z-30 w-72 bg-gray-900 text-white
              border-r border-gray-800 overflow-y-auto shrink-0
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0 lg:transform-none
            `}
          >
            <div className="h-full p-4 space-y-6">
              {/* Upload now supports project selection; see patch #3 */}
              <UploadCard />
              <DocumentsList
                documents={documents}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelected(id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                onConfirmDelete={confirmDeleteDocument}
                projects={projects}
                onRenameProject={renameProject}
                onMoveDoc={moveDoc}
              />
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 h-full overflow-auto">
            <div className="h-full flex flex-col">
              <div className="bg-white border-b">
                <div className="mx-auto w-full max-w-7xl flex items-center justify-between py-4 px-4">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Documents
                  </h1>
                  {selectedDoc && (
                    <div className="hidden sm:block text-sm text-gray-500">
                      {(selectedDoc as any).project
                        ? `Project: ${(selectedDoc as any).project}`
                        : "Unassigned"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <PreviewPane doc={selectedDoc} />
              </div>
            </div>

            {/* Delete modal */}
            <Modal
              isOpen={isDeleteDocOpen}
              onClose={() => {
                setIsDeleteDocOpen(false);
                setDocToDelete(null);
              }}
              title="Delete document?"
            >
              <p className="text-gray-700">
                {`Are you sure you want to delete “${
                  docToDelete?.name || "this file"
                }”? This action cannot be undone.`}
              </p>
              <div className="flex justify-between space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsDeleteDocOpen(false);
                    setDocToDelete(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDocument}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </Modal>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DocumentsView;
