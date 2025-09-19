import React, { useState } from "react";
import type { Idea, IdeaStatus, IdeaType } from "types/ideas";
import { PlusIcon } from "@heroicons/react/24/outline";

type Props = {
  tags: string[];
  filters: {
    q: string;
    tags: string[];
    status: "All" | IdeaStatus;
    minImpact: 0 | 1 | 2 | 3 | 4 | 5;
  };
  onChangeFilters: (f: Props["filters"]) => void;
  items: Idea[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreate: (draft: Omit<Idea, "id" | "createdAt" | "updatedAt">) => void;
};

export default function IdeasSidebar({
  tags,
  filters,
  onChangeFilters,
  items,
  selectedId,
  onSelect,
  onCreate,
}: Props) {
  const [draft, setDraft] = useState<
    Omit<Idea, "id" | "createdAt" | "updatedAt">
  >({
    title: "",
    tags: [],
    ideaType: "Feature" as IdeaType,
    oneLiner: "",
    status: "Draft",
    impact: 3,
    effort: 3,
    confidence: 3,
    // createdAt: "" as any, // ignored on create
    // updatedAt: "" as any, // ignored on create
  });

  const addTag = (t: string) =>
    setDraft((d) => (d.tags.includes(t) ? d : { ...d, tags: [...d.tags, t] }));

  const removeTag = (t: string) =>
    setDraft((d) => ({ ...d, tags: d.tags.filter((x) => x !== t) }));

  const create = () => {
    const title = (draft.title || "").trim();
    if (!title) return;
    onCreate(draft);
    setDraft({
      ...draft,
      title: "",
      oneLiner: "",
      tags: [],
      ideaType: "Feature",
      status: "Draft",
      impact: 3,
      effort: 3,
      confidence: 3,
    });
  };

  return (
    <div className="flex h-full flex-col gap-6">
      {/* New idea */}
      <section>
        <h3 className="text-sm font-semibold mb-2">New idea</h3>
        <input
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="Title"
          className="w-full mb-2 rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm"
        />

        <textarea
          rows={3}
          value={draft.oneLiner}
          onChange={(e) => setDraft({ ...draft, oneLiner: e.target.value })}
          placeholder="One-liner / short summary"
          className="w-full mb-2 rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm"
        />

        <div className="grid grid-cols-2 gap-2 mb-2">
          <select
            value={draft.ideaType}
            onChange={(e) =>
              setDraft({ ...draft, ideaType: e.target.value as IdeaType })
            }
            className="rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm"
          >
            {["Product", "Feature", "Tooling", "Research", "Infra"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={draft.status}
            onChange={(e) =>
              setDraft({ ...draft, status: e.target.value as IdeaStatus })
            }
            className="rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm"
          >
            {[
              "Draft",
              "Exploring",
              "Planned",
              "Building",
              "Shipped",
              "Archived",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <input
            type="number"
            min={1}
            max={5}
            value={draft.impact ?? 3}
            onChange={(e) =>
              setDraft({
                ...draft,
                impact: Math.max(1, Math.min(5, Number(e.target.value) || 3)),
              })
            }
            className="rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm"
            placeholder="Impact (1-5)"
            title="Impact (1-5)"
          />
          <input
            type="number"
            min={1}
            max={5}
            value={draft.effort ?? 3}
            onChange={(e) =>
              setDraft({
                ...draft,
                effort: Math.max(1, Math.min(5, Number(e.target.value) || 3)),
              })
            }
            className="rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm"
            placeholder="Effort (1-5)"
            title="Effort (1-5)"
          />
          <input
            type="number"
            min={1}
            max={5}
            value={draft.confidence ?? 3}
            onChange={(e) =>
              setDraft({
                ...draft,
                confidence: Math.max(
                  1,
                  Math.min(5, Number(e.target.value) || 3)
                ),
              })
            }
            className="rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm"
            placeholder="Confidence (1-5)"
            title="Confidence (1-5)"
          />
        </div>

        {/* quick tag add */}
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.slice(0, 8).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => addTag(t)}
              className="px-2 py-0.5 rounded bg-gray-700 hover:bg-gray-600 text-xs"
              title={`Add tag '${t}'`}
            >
              + {t}
            </button>
          ))}
        </div>
        {draft.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {draft.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-blue-600 text-xs">
                {t}
                <button
                  onClick={() => removeTag(t)}
                  className="ml-1 text-white/80 hover:text-white"
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={create}
          className="w-full inline-flex items-center justify-center gap-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 text-sm"
        >
          <PlusIcon className="h-5 w-5" />
          Add Idea
        </button>
      </section>

      {/* Filters */}
      <select
        value={filters.status}
        onChange={(e) =>
          onChangeFilters({ ...filters, status: e.target.value as any })
        }
        className="w-full mb-2 rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm"
      >
        {[
          "All",
          "Draft",
          "Exploring",
          "Planned",
          "Building",
          "Shipped",
          "Archived",
        ].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={String(filters.minImpact)}
        onChange={(e) =>
          onChangeFilters({
            ...filters,
            minImpact: Number(e.target.value) as any,
          })
        }
        className="w-full mb-2 rounded bg-gray-800 border border-gray-700 px-2 py-1.5 text-sm"
        title="Min Impact"
      >
        <option value="0">Any impact</option>
        <option value="1">Impact ≥ 1</option>
        <option value="2">Impact ≥ 2</option>
        <option value="3">Impact ≥ 3</option>
        <option value="4">Impact ≥ 4</option>
        <option value="5">Impact ≥ 5</option>
      </select>

      {/* List quick nav */}
      <section className="mt-auto">
        <h3 className="text-sm font-semibold mb-2">All ideas</h3>
        <ul className="space-y-1 max-h-48 overflow-auto pr-1">
          {items.length === 0 ? (
            <li className="text-xs text-gray-400">No ideas yet.</li>
          ) : (
            items
              .slice()
              .reverse()
              .map((i) => (
                <li key={i.id}>
                  <button
                    onClick={() => onSelect(i.id)}
                    className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                      selectedId === i.id ? "bg-gray-700" : "hover:bg-gray-800"
                    }`}
                    title={i.title}
                  >
                    <span className="line-clamp-1">{i.title}</span>
                  </button>
                </li>
              ))
          )}
        </ul>
      </section>
    </div>
  );
}
