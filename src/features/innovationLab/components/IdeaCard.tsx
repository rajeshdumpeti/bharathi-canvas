import React from "react";
import { FiStar } from "react-icons/fi";
import type { Idea } from "types/ideas";

type Props = {
  idea: Idea;
  onOpen: (id: string) => void;
  onToggleStar: (id: string) => void;
};

const IdeaCard: React.FC<Props> = ({ idea, onOpen, onToggleStar }) => {
  return (
    <div
      className="rounded-lg border bg-white p-3 hover:shadow-sm transition cursor-pointer"
      onClick={() => onOpen(idea.id)}
      role="button"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-snug line-clamp-2">
          {idea.title || "Untitled idea"}
        </h3>
        <button
          type="button"
          className="shrink-0 p-1 rounded hover:bg-gray-100"
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
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
          {idea.ideaType}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
          {idea.status}
        </span>
        {idea.tags?.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-full bg-blue-50 text-blue-700 px-2 py-0.5"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
        <span>
          ICE:&nbsp;
          <b>
            {(idea.impact ?? 0) + (idea.confidence ?? 0) - (idea.effort ?? 0)}
          </b>
        </span>
        <span>
          {new Date(idea.updatedAt || idea.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default IdeaCard;
