import React from "react";
import type { DocItem } from "types/documents";

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
};

const DocumentsList: React.FC<Props> = ({
  documents,
  selectedId,
  onSelect,
  onConfirmDelete,
}) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-100 mb-2">Files</h3>
      {documents.length === 0 ? (
        <p className="text-gray-400 text-sm">No files yet.</p>
      ) : (
        <ul className="space-y-1 overflow-y-auto max-h-[50vh] pr-1">
          {documents.map((d) => (
            <li
              key={d.id}
              className={`flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-sm ${
                selectedId === d.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800"
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
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirmDelete(d);
                }}
                className="p-1 rounded hover:bg-gray-700"
                title="Delete"
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentsList;
