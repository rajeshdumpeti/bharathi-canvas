import React, { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow"; // Updated import
import { useDocsStore, DocsState } from "stores/docs.store";
import UploadCard from "./components/UploadCard";
import DocumentsList from "./components/DocumentsList";
import PreviewPane from "./components/PreviewPane";
import { Modal } from "packages/ui";
import type { DocItem } from "types/documents";
import { debounce } from "lodash"; // Ensure Lodash is installed

const DocumentsView: React.FC = () => {
  // Use useShallow to apply shallow equality
  const { documents, selectedId } = useDocsStore(
    useShallow((s: DocsState) => ({
      documents: s.items,
      selectedId: s.selectedId,
    }))
  );
  const setSelected = useDocsStore((s: DocsState) => s.setSelected);
  const deleteDoc = useDocsStore((s: DocsState) => s.deleteDocument);

  const selectedDoc = useMemo<DocItem | null>(
    () => documents.find((d) => d.id === selectedId) ?? null,
    [documents, selectedId]
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocItem | null>(null);

  useEffect(() => {
    const debouncedHandler = debounce((e: Event) => {
      console.log("app:toggleSidebar triggered at:", new Date().toISOString());
      setIsSidebarOpen((prev) => {
        const newState = !prev;
        return newState;
      });
    }, 300);

    window.addEventListener("app:toggleSidebar", debouncedHandler);
    return () => {
      debouncedHandler.cancel();
      window.removeEventListener("app:toggleSidebar", debouncedHandler);
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

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      <div className="flex-1 min-h-0 w-full">
        <div className="relative h-full w-full flex overflow-hidden">
          <div
            onClick={() => setIsSidebarOpen(false)}
            className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />

          <aside
            aria-label="Documents sidebar"
            className={`
              fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white
              border-r border-gray-800 overflow-y-auto shrink-0
              transform transition-transform duration-300 ease-in-out
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0 lg:transform-none
            `}
          >
            <div className="h-full p-4 space-y-6">
              <UploadCard />
              <DocumentsList
                documents={documents}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelected(id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                onConfirmDelete={confirmDeleteDocument}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0 h-full overflow-auto">
            <div className="h-full flex flex-col">
              {selectedDoc && (
                <div className="bg-white border-b">
                  <div className="mx-auto w-full max-w-7xl flex items-center justify-between py-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      Documents
                    </h1>
                  </div>
                </div>
              )}
              <div className="flex-1 overflow-auto">
                <PreviewPane doc={selectedDoc} />
              </div>
            </div>

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
