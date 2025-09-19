import React, { useMemo, useState } from "react";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import type { Idea, IdeaStatus, IdeaType } from "types/ideas";
import IdeaCard from "./components/IdeaCard";
import { loadIdeas, saveIdeas, newIdeaSeed } from "./ideaStorage";
import { useNavigate } from "react-router-dom";

const STATUSES: IdeaStatus[] = [
  "Draft",
  "Exploring",
  "Planned",
  "Building",
  "Shipped",
  "Archived",
];
const TYPES: IdeaType[] = [
  "Product",
  "Feature",
  "Tooling",
  "Research",
  "Infra",
];

const GalleryView: React.FC = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>(() => loadIdeas());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<IdeaStatus | "All">("All");
  const [type, setType] = useState<IdeaType | "All">("All");
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [sortBy, setSortBy] = useState<"updated" | "ice">("ice");

  const filtered = useMemo(() => {
    const ql = q.toLowerCase().trim();
    let list = ideas.filter((i) => {
      const text =
        `${i.title} ${i.oneLiner ?? ""} ${i.tags?.join(" ")}`.toLowerCase();
      if (ql && !text.includes(ql)) return false;
      if (status !== "All" && i.status !== status) return false;
      if (type !== "All" && i.ideaType !== type) return false;
      if (onlyStarred && !i.starred) return false;
      return true;
    });

    if (sortBy === "ice") {
      list = list.slice().sort((a, b) => {
        const sa = (a.impact ?? 0) + (a.confidence ?? 0) - (a.effort ?? 0);
        const sb = (b.impact ?? 0) + (b.confidence ?? 0) - (b.effort ?? 0);
        return sb - sa;
      });
    } else {
      list = list
        .slice()
        .sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
        );
    }
    return list;
  }, [ideas, q, status, type, onlyStarred, sortBy]);

  const addIdea = () => {
    const draft = newIdeaSeed();
    draft.title = "New idea";
    const next = [draft, ...ideas];
    setIdeas(next);
    saveIdeas(next);
    navigate(`/ideas/${draft.id}`); // you can wire this route in the next step
  };

  const openIdea = (id: string) => {
    navigate(`/ideas/${id}`);
  };

  const toggleStar = (id: string) => {
    const next = ideas.map((i) =>
      i.id === id
        ? { ...i, starred: !i.starred, updatedAt: new Date().toISOString() }
        : i
    );
    setIdeas(next);
    saveIdeas(next);
  };

  return (
    <div className="h-full w-full">
      <div className="mx-auto w-full max-w-7xl p-4">
        {/* header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Innovation Lab</h1>
            <p className="text-sm text-gray-500">
              Capture sparks, filter by status/type, and prioritize by ICE.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={addIdea}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
            >
              <FiPlus /> New Idea
            </button>
          </div>
        </div>

        {/* filters */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="relative">
            <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ideas…"
              className="w-full rounded-md border px-8 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full rounded-md border px-2 py-2"
            >
              <option>All</option>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-md border px-2 py-2"
            >
              <option>All</option>
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={onlyStarred}
                onChange={(e) => setOnlyStarred(e.target.checked)}
              />
              Starred
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-md border px-2 py-2 text-sm"
              title="Sort"
            >
              <option value="ice">Sort: ICE</option>
              <option value="updated">Sort: Updated</option>
            </select>
          </div>
        </div>

        {/* grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-lg border bg-white p-6 text-center text-gray-600">
              No ideas yet. Click <b>New Idea</b> to start.
            </div>
          ) : (
            filtered.map((i) => (
              <IdeaCard
                key={i.id}
                idea={i}
                onOpen={openIdea}
                onToggleStar={toggleStar}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryView;
