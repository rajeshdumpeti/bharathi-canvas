import React, { useMemo, useState } from "react";
import { FiPlus, FiSearch, FiFilter, FiStar } from "react-icons/fi";
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

  // Quick-pill helpers
  const toggleStatusPill = (s: IdeaStatus) =>
    setStatus((cur) => (cur === s ? "All" : s));
  const toggleTypePill = (t: IdeaType) =>
    setType((cur) => (cur === t ? "All" : t));

  return (
    <div className="h-full w-full">
      <div className="mx-auto w-full max-w-7xl p-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm">
                💡
              </span>
              <h1 className="text-2xl font-bold text-gray-900">
                Innovation Lab
              </h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Capture sparks, filter by status/type, and prioritize by ICE.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-500">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </span>
            <button
              onClick={addIdea}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white shadow-sm transition hover:from-blue-700 hover:to-indigo-700 active:translate-y-[1px]"
            >
              <FiPlus className="text-base" />
              <span className="font-medium">New Idea</span>
            </button>
          </div>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-0 z-10 mt-4 rounded-xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/65">
          <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-5">
            {/* Search */}
            <div className="relative sm:col-span-2">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search ideas…"
                className="w-full rounded-lg border border-gray-200 bg-white px-9 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <FiFilter className="hidden text-gray-400 sm:block" />
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

            {/* Type */}
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

            {/* Star + Sort */}
            {/* Star + Sort */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setOnlyStarred((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition ${onlyStarred ? "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                title="Toggle starred"
              >
                <FiStar
                  className={onlyStarred ? "text-yellow-500" : "text-gray-500"}
                />
                Starred
              </button>

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

          {/* Quick pills */}
          {/* Quick pills */}
          <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 px-3 py-2">
            <span className="text-xs font-medium text-gray-500">Quick:</span>

            {/* status pills */}
            {["Draft", "Planned", "Building", "Shipped"].map((s) => (
              <button
                key={`pill-s-${s}`}
                onClick={() => toggleStatusPill(s as IdeaStatus)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition
        ${status === s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {s}
              </button>
            ))}

            <span className="mx-1 h-4 w-px bg-gray-200" />

            {/* type pills with color accents */}
            {(["Product", "Feature", "Tooling"] as IdeaType[]).map((t) => {
              const tone =
                t === "Product"
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  : t === "Feature"
                    ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                    : "bg-amber-100 text-amber-800 hover:bg-amber-200";
              const active =
                t === "Product"
                  ? "bg-blue-600 text-white"
                  : t === "Feature"
                    ? "bg-violet-600 text-white"
                    : "bg-amber-600 text-white";
              return (
                <button
                  key={`pill-t-${t}`}
                  onClick={() => toggleTypePill(t)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${type === t ? active : tone}`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600">
              <p className="text-sm">
                No ideas match your filters. Try clearing filters or create a
                new one.
              </p>
              <button
                onClick={addIdea}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition hover:bg-blue-700 active:translate-y-[1px]"
              >
                <FiPlus />
                New Idea
              </button>
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
