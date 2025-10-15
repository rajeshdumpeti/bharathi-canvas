import React, { useMemo, useState } from "react";
import type { DocItem } from "types/documents";
import { useDocuments } from "../hooks/useDocuments";

const iconFor = (doc: DocItem) => {
  if (/pdf/i.test(doc.type) || /\.pdf$/i.test(doc.name)) return "📄";
  if (/docx/i.test(doc.type) || /\.docx$/i.test(doc.name)) return "📝";
  return "📃";
};

type Props = {
  documents: DocItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onConfirmDelete: (doc: DocItem) => void;
  projects: string[];
  onRenameProject: (oldName: string, newName: string) => void;
  onMoveDoc: (docId: string, project: string) => void;
};

function useGroups(docs: DocItem[]) {
  return useMemo(() => {
    const map = new Map<string, DocItem[]>();
    for (const d of docs) {
      const key =
        (typeof (d as any).project === "string" && (d as any).project.trim()) ||
        "Unassigned";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    }
    return Array.from(map.entries()).sort(([a], [b]) => {
      if (a === "Unassigned") return 1;
      if (b === "Unassigned") return -1;
      return a.localeCompare(b);
    });
  }, [docs]);
}

const Caret: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 20 20"
    className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const DocumentsList: React.FC<Props> = ({
  documents,
  selectedId,
  onSelect,
  onConfirmDelete,
  projects,
  onRenameProject,
  onMoveDoc,
}) => {
  const groups = useGroups(documents);
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    groups.forEach(([k]) => (init[k] = true));
    return init;
  });

  const { deleteDocument } = useDocuments(); // ✅ integrated backend delete

  if (!documents.length) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-gray-100 mb-2">Files</h3>
        <p className="text-gray-400 text-sm">No files yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-100 mb-2">Projects</h3>
      <div className="space-y-2 overflow-y-auto max-h-[50vh] pr-1">
        {groups.map(([project, docs]) => {
          const isOpen = open[project] ?? true;
          const canRename = project !== "Unassigned";
          return (
            <div
              key={project}
              className="rounded-md border border-gray-800/60 bg-gray-900/50"
            >
              {/* Project header */}
              <div className="flex items-center justify-between px-2 py-2 rounded-t-md">
                <button
                  className="flex items-center gap-2 text-left text-gray-100 truncate hover:opacity-90"
                  onClick={() => setOpen((s) => ({ ...s, [project]: !isOpen }))}
                  title={project}
                >
                  <Caret open={isOpen} />
                  <span className="truncate">{project}</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{docs.length}</span>
                  {canRename && (
                    <button
                      className="rounded px-1.5 py-0.5 text-xs bg-gray-800 hover:bg-gray-700"
                      title="Rename project"
                      onClick={() => {
                        const next = window.prompt("Rename project", project);
                        if (!next) return;
                        const trimmed = next.trim();
                        if (!trimmed || trimmed === project) return;
                        onRenameProject(project, trimmed);
                      }}
                    >
                      Rename
                    </button>
                  )}
                </div>
              </div>

              {/* Doc rows */}
              {isOpen && (
                <ul className="px-1 pb-1 space-y-1">
                  {docs.map((d) => (
                    <li
                      key={d.id}
                      className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                        selectedId === d.id
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-800 text-gray-100"
                      }`}
                    >
                      <span
                        onClick={() => onSelect(d.id)}
                        className="flex-1 flex items-center gap-2 truncate pr-2"
                        title={d.name}
                      >
                        <span className="shrink-0">{iconFor(d)}</span>
                        <span className="truncate">{d.name}</span>
                      </span>

                      {/* Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onConfirmDelete(d);
                            deleteDocument(d); // ✅ call backend delete
                          }}
                          className={`p-1 rounded ${
                            selectedId === d.id
                              ? "hover:bg-blue-500/30"
                              : "hover:bg-gray-700"
                          }`}
                          title="Delete"
                          aria-label="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentsList;
