import React, { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { Modal } from "packages/ui";
import type { DocItem } from "types/documents";
import { useDocuments } from "./hooks/useDocuments";
import UploadCard from "./components/UploadCard";
import DocumentsList from "./components/DocumentsList";
import PreviewPane from "./components/PreviewPane";
import type { Project } from "types/board"; // <-- Import Project type

const DocumentsView: React.FC = () => {
  const {
    items: documents,
    projects, // <-- FIX: Get the full project list
    selectedId,
    setSelected,
    deleteDocument,
    refresh,
  } = useDocuments();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDeleteDocOpen, setIsDeleteDocOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<DocItem | null>(null);

  const selectedDoc = useMemo<DocItem | null>(
    () => documents.find((d) => d.id === selectedId) ?? null,
    [documents, selectedId]
  );

  // --- FIX: Create a project name lookup map ---
  const projectMap = useMemo(
    () => new Map(projects.map((p: Project) => [p.id, p.name])),
    [projects]
  );
  // --- END FIX ---

  // --- REMOVED ---
  // const projects = useMemo(() => { ... }, [documents]);
  // --- END REMOVED ---

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

  const handleDeleteDocument = async () => {
    if (!docToDelete) return;
    await deleteDocument(docToDelete);
    if (selectedId === docToDelete.id) setSelected(null);
    setIsDeleteDocOpen(false);
    setDocToDelete(null);
    refresh();
  };

  const renameProject = (oldName: string, newName: string) => {
    console.warn("Rename not persisted yet; local only.");
  };

  const moveDoc = (docId: string, project: string) => {
    console.warn("Move not persisted yet; local only.");
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
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
              fixed lg:static inset-y-0 left-0 z-30 w-72 bg-gray-900 text-white
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
                projects={projects} // <-- FIX: Pass the full project list
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

                  {/* --- FIX: Look up project name correctly --- */}
                  {selectedDoc && (
                    <div className="hidden sm:block text-sm text-gray-500">
                      {`Project: ${
                        projectMap.get(selectedDoc.project_id || "") ||
                        "Unassigned"
                      }`}
                    </div>
                  )}
                  {/* --- END FIX --- */}
                </div>
              </div>

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
