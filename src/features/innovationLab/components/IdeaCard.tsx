import React from "react";
import {
  FiStar,
  FiUsers,
  FiTarget,
  FiTrendingUp,
  FiAlertTriangle,
} from "react-icons/fi";
import type { Idea } from "types/innovationLab";

type Props = {
  idea: Idea;
  onOpen: (id: string) => void;
  onToggleStar: (id: string) => void;
};

const TYPE_TONES: Record<
  NonNullable<Idea["ideaType"]>,
  { bg: string; border: string; chip: string }
> = {
  Product: {
    bg: "from-blue-50 to-white",
    border: "border-blue-200",
    chip: "bg-blue-100 text-blue-700",
  },
  Feature: {
    bg: "from-violet-50 to-white",
    border: "border-violet-200",
    chip: "bg-violet-100 text-violet-700",
  },
  Tooling: {
    bg: "from-amber-50 to-white",
    border: "border-amber-200",
    chip: "bg-amber-100 text-amber-800",
  },
  Research: {
    bg: "from-emerald-50 to-white",
    border: "border-emerald-200",
    chip: "bg-emerald-100 text-emerald-700",
  },
  Infra: {
    bg: "from-slate-50 to-white",
    border: "border-slate-200",
    chip: "bg-slate-100 text-slate-700",
  },
};

function Chip({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

function iceTone(score: number) {
  if (score >= 6) return "bg-green-100 text-green-800 ring-1 ring-green-200";
  if (score >= 3) return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
  return "bg-rose-100 text-rose-800 ring-1 ring-rose-200";
}

const IdeaCard: React.FC<Props> = ({ idea, onOpen, onToggleStar }) => {
  const tone = TYPE_TONES[idea.ideaType || "Feature"];
  const ice = (idea.impact ?? 0) + (idea.confidence ?? 0) - (idea.effort ?? 0);
  const updated = new Date(
    idea.updatedAt || idea.createdAt
  ).toLocaleDateString();

  const tagList = (idea.tags ?? []).slice(0, 3);
  const extraTags = (idea.tags?.length ?? 0) - tagList.length;

  const audienceCount = idea.targetAudience?.length ?? 0;
  const s = idea.swot || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };

  return (
    <div
      role="button"
      onClick={() => onOpen(idea.id)}
      className={`group rounded-xl border ${tone.border} bg-gradient-to-br ${tone.bg} p-4 shadow-sm hover:shadow transition hover:-translate-y-0.5 cursor-pointer`}
    >
      {/* header actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="shrink-0 p-1 rounded hover:bg-white/70"
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

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>Updated</span>
          <span className="font-medium">{updated}</span>
        </div>
      </div>

      {/* title & one-liner */}
      <div className="mt-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {idea.title || "Untitled"}
        </h3>
        {idea.oneLiner ? (
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {idea.oneLiner}
          </p>
        ) : null}
      </div>

      {/* chips row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Chip className={`${tone.chip}`}>{idea.ideaType || "Feature"}</Chip>
        <Chip className="bg-gray-100 text-gray-700">{idea.status}</Chip>
        <span className="text-xs text-gray-500">ICE:</span>
        <Chip className={iceTone(ice)}>ICE: {ice}</Chip>
      </div>

      {/* tags */}
      {(tagList.length > 0 || audienceCount > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tagList.map((t) => (
            <Chip
              key={t}
              className="bg-white/80 text-gray-700 ring-1 ring-gray-200"
            >
              {t}
            </Chip>
          ))}
          {extraTags > 0 && (
            <Chip className="bg-white/80 text-gray-600 ring-1 ring-gray-200">
              +{extraTags} more
            </Chip>
          )}
          {audienceCount > 0 && (
            <Chip className="ml-auto bg-sky-100 text-sky-800 ring-1 ring-sky-200">
              <FiUsers className="mr-1" /> {audienceCount}
            </Chip>
          )}
        </div>
      )}

      {/* SWOT micro-summary */}
      {(s.strengths.length || s.opportunities.length) && (
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
          {s.strengths.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <FiTrendingUp className="text-green-600" /> {s.strengths.length}{" "}
              Strength
              {s.strengths.length > 1 ? "s" : ""}
            </span>
          )}
          {s.opportunities.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <FiTarget className="text-indigo-600" /> {s.opportunities.length}{" "}
              Opp
            </span>
          )}
          {s.threats.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <FiAlertTriangle className="text-rose-600" /> {s.threats.length}{" "}
              Threat
              {s.threats.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default IdeaCard;
