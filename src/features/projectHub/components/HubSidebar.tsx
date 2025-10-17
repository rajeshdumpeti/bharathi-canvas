import React, { useState } from "react";
import { useProjectStore } from "stores/projectStore";
import type { SectionDef, SectionKey } from "types/project-hub";

type Props = {
  sections: SectionDef[];
  activeKey: SectionKey;
  onSelect?: (key: SectionKey) => void;
};

export default function HubSidebar({ sections, activeKey, onSelect }: Props) {
  const { projects, selectedProjectId, selectProject } = useProjectStore();

  return (
    <aside className="flex h-full flex-col text-white">
      {/* Header */}
      <h3 className="text-xl font-bold mb-4 text-gray-100">Projects</h3>
      {/* Projects list */}
      <ul className="space-y-2 mb-6 overflow-y-auto pr-1">
        {projects.map((p) => (
          <li
            key={p.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
              selectedProjectId === p.id
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <span
              onClick={() => selectProject(p.id)}
              className="flex-1 pr-2 truncate"
              title={p.name}
            >
              {p.name}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // deleteProject(p.id);
              }}
              className="p-1 rounded text-gray-400 hover:text-red-500"
              title="Delete project"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </li>
        ))}
        {projects.length === 0 && (
          <li className="text-sm text-gray-500">No projects yet.</li>
        )}
      </ul>

      {/* Sections */}
      <div className="mt-auto">
        <h4 className="font-semibold mb-2 text-gray-100">Sections</h4>
        <ul className="space-y-1 max-h-64 overflow-y-auto pr-1">
          {sections.map((s) => (
            <li key={s.key}>
              <button
                onClick={() => onSelect?.(s.key)}
                disabled={!selectedProjectId}
                className={`w-full text-left px-2 py-1 rounded transition ${
                  activeKey === s.key
                    ? "bg-blue-700 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                } ${!selectedProjectId ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {s.title}
              </button>
            </li>
          ))}
        </ul>
        {!selectedProjectId && (
          <p className="mt-3 text-xs text-gray-400">
            Select a project to enable sections.
          </p>
        )}
      </div>
    </aside>
  );
}
