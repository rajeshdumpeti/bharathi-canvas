// src/features/innovationLab/components/IdeaCard.tsx
import React from "react";
import { FiStar } from "react-icons/fi";
import type { Idea } from "types/innovationLab";

// small helpers
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString() : "";

const revenueTone = (n: number | undefined) => {
  const v = n ?? 0;
  if (v >= 4) return "bg-emerald-100 text-emerald-700";
  if (v >= 2) return "bg-amber-100 text-amber-700";
  return "bg-rose-100 text-rose-700";
};

type Props = {
  idea: Idea;
  onOpen: (id: string) => void;
  onToggleStar: (id: string) => void;
};

const IdeaCard: React.FC<Props> = ({ idea, onOpen, onToggleStar }) => {
  const ice = (idea.impact ?? 0) + (idea.confidence ?? 0) - (idea.effort ?? 0);
  const reqCount = idea.technicalRequirements?.length ?? 0;
  const months = idea.solo?.timelineWeeks
    ? Math.max(1, Math.round((idea.solo.timelineWeeks || 0) / 4))
    : 0;
  const monthly = idea.budget?.monthlyTotal ?? 0;

  return (
    <div
      className="cursor-pointer rounded-2xl border border-violet-200/70 bg-gradient-to-br from-violet-50 to-white p-4 shadow-sm transition hover:shadow-md"
      onClick={() => onOpen(idea.id)}
      role="button"
    >
      {/* Top row */}
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          className="shrink-0 p-1 rounded hover:bg-violet-100"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(idea.id);
          }}
          aria-label={idea.starred ? "Unstar" : "Star"}
          title={idea.starred ? "Unstar" : "Star"}
        >
          <FiStar
            className={
              idea.starred ? "text-yellow-500 fill-yellow-400" : "text-gray-400"
            }
          />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
            {idea.ideaType}
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
            {idea.status}
          </span>
        </div>
      </div>

      {/* Title & one-liner */}
      <h3 className="truncate text-lg font-semibold text-gray-900">
        {idea.title || "Untitled"}
      </h3>
      {idea.oneLiner ? (
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
          {idea.oneLiner}
        </p>
      ) : null}

      {/* Badges row */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
          ICE: <b className="ml-1">{ice}</b>
        </span>

        {/* NEW: revenue potential */}
        <span
          className={`rounded-full px-2 py-0.5 ${revenueTone(
            idea.revenuePotential
          )}`}
          title="Revenue potential"
        >
          Rev: <b className="ml-1">{idea.revenuePotential ?? 0}/5</b>
        </span>

        {/* NEW: solo timeline summary */}
        {months > 0 ? (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700">
            ~{months} mo solo
          </span>
        ) : null}

        {/* NEW: tech req count */}
        {reqCount > 0 ? (
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-700">
            {reqCount} req
          </span>
        ) : null}

        {/* NEW: budget monthly */}
        {monthly > 0 ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">
            {idea.budget?.currency ?? "₹"}
            {monthly}/mo
          </span>
        ) : null}
      </div>

      {/* Footer */}
      <div className="mt-3 text-right text-xs text-gray-500">
        {fmtDate(idea.updatedAt || idea.createdAt)}
      </div>
    </div>
  );
};

export default IdeaCard;
