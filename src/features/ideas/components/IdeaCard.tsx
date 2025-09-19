import React, { useState } from "react";
import type { Idea } from "types/ideas";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  idea: Idea;
  active?: boolean;
  onClick?: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
};

export default function IdeaCard({
  idea,
  active,
  onClick,
  onRename,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(idea.title);

  const save = () => {
    const t = val.trim();
    if (!t || t === idea.title) {
      setEditing(false);
      return;
    }
    onRename(t);
    setEditing(false);
  };

  return (
    <div
      className={`rounded-lg border bg-white p-4 hover:shadow-sm transition cursor-pointer ${
        active ? "ring-2 ring-indigo-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        {editing ? (
          <input
            autoFocus
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => e.key === "Enter" && save()}
            className="w-full rounded border px-2 py-1 text-sm"
          />
        ) : (
          <h3 className="font-semibold text-gray-900">{idea.title}</h3>
        )}
        <div className="flex items-center gap-2">
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(true);
            }}
            title="Rename"
          >
            <PencilSquareIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button
            className="p-1 rounded hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete"
          >
            <TrashIcon className="h-5 w-5 text-red-600" />
          </button>
        </div>
      </div>

      <p className="mt-1 text-sm text-gray-600 line-clamp-3">
        {idea.oneLiner || "—"}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="px-2 py-0.5 rounded bg-gray-100 text-xs">
          {idea.ideaType}
        </span>
        <span className="px-2 py-0.5 rounded bg-gray-100 text-xs">
          {idea.status}
        </span>
        <span className="px-2 py-0.5 rounded bg-gray-50 border text-xs">
          Impact {idea.impact ?? "–"}
        </span>
        <span className="px-2 py-0.5 rounded bg-gray-50 border text-xs">
          Effort {idea.effort ?? "–"}
        </span>
        <span className="px-2 py-0.5 rounded bg-gray-50 border text-xs">
          Conf {idea.confidence ?? "–"}
        </span>
        {idea.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded bg-gray-50 border text-xs"
          >
            {t}
          </span>
        ))}
        {idea.tags.length > 3 && (
          <span className="text-xs text-gray-500">+{idea.tags.length - 3}</span>
        )}
      </div>
    </div>
  );
}
