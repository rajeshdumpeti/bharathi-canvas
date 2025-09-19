// features/documents/components/UploadCard.tsx
import React, { useMemo, useState } from "react";
import { useDocsStore, DocsState } from "stores/docs.store";
import type { DocItem } from "types/documents";

const MAX_MB = 5;

const UploadCard: React.FC = () => {
  const addDocuments = useDocsStore((s: DocsState) => s.addDocuments);
  const items = useDocsStore((s: DocsState) => s.items);

  const projects = useMemo(() => {
    const set = new Set<string>();
    items.forEach((d) => {
      const p = (d as any).project?.trim?.() ?? "";
      if (p) set.add(p);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const [project, setProject] = useState<string>("");

  const onPickProject = (val: string) => {
    if (val === "__new__") {
      const name = window.prompt("New project name");
      if (!name) return;
      setProject(name.trim());
      return;
    }
    setProject(val === "Unassigned" ? "" : val);
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    addDocuments(Array.from(files), project);
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-3">
      <h3 className="text-sm font-semibold text-gray-100">Upload document</h3>

      {/* Project select */}
      <div className="mt-2">
        <label className="block text-xs text-gray-400 mb-1">Project</label>
        <select
          className="w-full rounded-md bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm text-gray-100"
          value={project || "__new__"}
          onChange={(e) => onPickProject(e.target.value)}
        >
          {/* <option value="Unassigned">Create Project</option> */}
          {projects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
          <option value="__new__">➕ Create Project</option>
        </select>
      </div>

      <div className="mt-3 grid gap-2">
        <label className="flex h-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-700 bg-gray-800/50 text-gray-200 hover:border-gray-600">
          <input
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            multiple
            onChange={(e) => onFiles(e.target.files)}
          />
          <div className="text-center">
            <div className="text-sm">Drag & drop PDF / DOCX / TXT here</div>
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
