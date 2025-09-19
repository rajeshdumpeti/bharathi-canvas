import React from "react";
import { FiStar } from "react-icons/fi";
import type { Idea, IdeaStatus, IdeaType } from "types/innovationLab";
import { Chip } from "./ui";

type Props = {
  idea: Idea;
  ice: number;
  statuses: IdeaStatus[];
  types: IdeaType[];
  onPatch: <K extends keyof Idea>(key: K, value: Idea[K]) => void;
};

const TitleMeta: React.FC<Props> = ({
  idea,
  ice,
  statuses,
  types,
  onPatch,
}) => {
  return (
    <section className="rounded-lg border bg-white p-4 space-y-3">
      {/* Title row */}
      <div className="flex items-start gap-3">
        <input
          value={idea.title}
          onChange={(e) => onPatch("title", e.target.value as any)}
          placeholder="Idea title"
          className="w-full text-2xl font-semibold outline-none"
        />
        {/* optional star */}
        <button
          type="button"
          onClick={() => onPatch("starred", !idea.starred as any)}
          className={`shrink-0 mt-1 rounded-md border px-2.5 py-2 transition ${
            idea.starred
              ? "border-yellow-200 bg-yellow-50 text-yellow-700"
              : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
          }`}
          title={idea.starred ? "Unstar" : "Star"}
        >
          <FiStar
            className={`h-4 w-4 ${idea.starred ? "fill-yellow-400" : ""}`}
          />
        </button>
      </div>

      {/* One-liner */}
      <input
        value={idea.oneLiner ?? ""}
        onChange={(e) => onPatch("oneLiner", e.target.value as any)}
        placeholder="One-liner (what/why in one sentence)"
        className="w-full rounded-md border px-3 py-2"
      />

      {/* Meta line */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="w-16 text-sm text-gray-600">Status</span>
          <select
            value={idea.status}
            onChange={(e) => onPatch("status", e.target.value as IdeaStatus)}
            className="flex-1 rounded-md border px-2 py-2"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Type */}
        <div className="flex items-center gap-2">
          <span className="w-16 text-sm text-gray-600">Type</span>
          <select
            value={idea.ideaType}
            onChange={(e) => onPatch("ideaType", e.target.value as IdeaType)}
            className="flex-1 rounded-md border px-2 py-2"
          >
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* ICE */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-gray-600">ICE score</span>
          <Chip>{ice}</Chip>
        </div>
      </div>

      {/* Dates (subtle) */}
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-400">
        {idea.createdAt ? (
          <span>Created: {new Date(idea.createdAt).toLocaleDateString()}</span>
        ) : null}
        {idea.updatedAt ? (
          <span>Updated: {new Date(idea.updatedAt).toLocaleDateString()}</span>
        ) : null}
      </div>
    </section>
  );
};

export default TitleMeta;
