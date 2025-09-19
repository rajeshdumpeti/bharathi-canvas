import React from "react";
import { FiStar } from "react-icons/fi";
import type { Idea } from "types/ideas";

type Props = {
  idea: Idea;
  onOpen: (id: string) => void;
  onToggleStar: (id: string) => void;
};

const typeColor: Record<string, string> = {
  Product: "bg-sky-100 text-sky-700",
  Feature: "bg-indigo-100 text-indigo-700",
  Tooling: "bg-emerald-100 text-emerald-700",
  Research: "bg-amber-100 text-amber-700",
  Infra: "bg-rose-100 text-rose-700",
};

const statusColor: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Exploring: "bg-blue-100 text-blue-700",
  Planned: "bg-violet-100 text-violet-700",
  Building: "bg-amber-100 text-amber-800",
  Shipped: "bg-emerald-100 text-emerald-800",
  Archived: "bg-stone-100 text-stone-600",
};

function Chip({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export default function IdeaCard({ idea, onOpen, onToggleStar }: Props) {
  const ice = (idea.impact ?? 0) + (idea.confidence ?? 0) - (idea.effort ?? 0);
  const updated = new Date(
    idea.updatedAt || idea.createdAt
  ).toLocaleDateString();

  const typeCls = typeColor[idea.ideaType] || "bg-gray-100 text-gray-700";
  const statusCls = statusColor[idea.status] || "bg-gray-100 text-gray-700";

  return (
    <div
      role="button"
      onClick={() => onOpen(idea.id)}
      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* gradient accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-violet-500 to-fuchsia-500" />

      {/* star button */}
      <button
        type="button"
        className="absolute right-2 top-2 z-10 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-yellow-500"
        onClick={(e) => {
          e.stopPropagation();
          onToggleStar(idea.id);
        }}
        aria-label={idea.starred ? "Unstar" : "Star"}
        title={idea.starred ? "Unstar" : "Star"}
      >
        <FiStar
          className={
            idea.starred ? "h-5 w-5 text-yellow-500 fill-yellow-400" : "h-5 w-5"
          }
        />
      </button>

      <div className="p-4">
        {/* title */}
        <h3 className="line-clamp-1 text-base font-semibold text-gray-900">
          {idea.title || "Untitled"}
        </h3>
        {idea.oneLiner ? (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
            {idea.oneLiner}
          </p>
        ) : null}

        {/* chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Chip className={typeCls}>{idea.ideaType}</Chip>
          <Chip className={statusCls}>{idea.status}</Chip>
          <Chip className="bg-gray-50 text-gray-600 ring-1 ring-gray-200">
            ICE: <span className="ml-1 font-semibold">{ice}</span>
          </Chip>
        </div>

        {/* footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span className="truncate">
            {idea.tags?.length
              ? `#${idea.tags.slice(0, 3).join("  #")}`
              : "\u00A0"}
          </span>
          <span>{updated}</span>
        </div>
      </div>

      {/* subtle hover glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-indigo-200/0 group-hover:ring-2 group-hover:ring-indigo-200/60" />
    </div>
  );
}
