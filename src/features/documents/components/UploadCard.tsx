import React, { useMemo, useState } from "react";
import { useDocuments } from "../hooks/useDocuments";
import { useProjectStore } from "stores/projectStore"; // ✅ new

const MAX_MB = 5;

const UploadCard: React.FC = () => {
  const { projectId, uploadDocument } = useDocuments(); // ✅ using new hook + store
  const { projects, selectedProjectId, selectProject } = useProjectStore();

  const [project, setProject] = useState<string>("");

  // Distinct project names from current docs (for dropdown)
  // ✅ Use backend projects from board store
  const projectOptions = useMemo(
    () =>
      (projects || []).map((p) => ({
        id: p.id,
        name: p.name,
      })),
    [projects]
  );

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length || !projectId) return;
    for (const file of Array.from(files)) {
      await uploadDocument(projectId, file); // ✅ upload to backend
    }
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
      <div className="flex justify-end">
        <button
          onClick={() => {
            window.dispatchEvent(new Event("app:toggleSidebar"));
          }}
          className="rounded-lg p-2 transition-colors hover:bg-gray-700 lg:hidden"
          aria-label="Close sidebar"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <h3 className="text-sm font-semibold text-gray-100">Upload document</h3>

      {/* Project select */}
      <div className="mt-2">
        <label className="block text-xs text-gray-400 mb-1">Project</label>
        <select
          className="w-full rounded-md bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm text-gray-100"
          value={project || selectedProjectId || ""}
          onChange={(e) => {
            const val = e.target.value;
            setProject(val);
            if (val) selectProject(val); // ✅ sync with global project store
          }}
        >
          {projectOptions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* File upload area */}
      <div className="mt-3 grid gap-2">
        <label className="flex h-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-700 bg-gray-800/50 text-gray-200 hover:border-gray-600">
          <input
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,.png,.jpg,.jpeg,.gif,.webp"
            className="hidden"
            multiple
            onChange={(e) => onFiles(e.target.files)}
          />
          <div className="text-center">
            <div className="text-sm">
              Drag & drop PDF / DOCX / TXT / Images here
            </div>
            <div className="text-[11px] text-gray-400">
              Max {MAX_MB} MB each
            </div>
          </div>
        </label>

        <button
          onClick={() =>
            document
              .querySelector<HTMLInputElement>('input[type="file"]')
              ?.click?.()
          }
          className="inline-flex justify-center rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-100 hover:bg-gray-700"
        >
          Browse files
        </button>
      </div>
    </div>
  );
};

export default UploadCard;
