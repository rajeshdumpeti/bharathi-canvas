// features/innovationLab/GalleryView.tsx
import React, { useMemo, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import type { Idea, IdeaStatus, IdeaType } from "types/innovationLab";
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

  // TS-safe lazy initializer: pass the function reference
  const [ideas, setIdeas] = useState<Idea[]>(loadIdeas);

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
    navigate(`/ideas/${draft.id}`);
  };

  const openIdea = (id: string) => navigate(`/ideas/${id}`);

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
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700"
            >
              <FiPlus /> New Idea
            </button>
          </div>
        </div>

        {/* filters bar */}
        <div className="mt-4 rounded-xl border bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-5">
            {/* search */}
            <div className="relative sm:col-span-2">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search ideas…"
                className="w-full rounded-lg border border-gray-200 bg-white px-9 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </div>

            {/* status */}
            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                <option>All</option>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* type */}
            <div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
              >
                <option>All</option>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* starred + sort */}
            <div className="flex items-center justify-between gap-2">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={onlyStarred}
                  onChange={(e) => setOnlyStarred(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Starred
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
                title="Sort"
              >
                <option value="ice">Sort: ICE</option>
                <option value="updated">Sort: Updated</option>
              </select>
            </div>
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
