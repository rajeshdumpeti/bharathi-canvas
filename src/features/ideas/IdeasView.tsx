import React, { useEffect, useMemo, useState } from "react";
import { storage } from "packages/storage";
import IdeasSidebar from "./components/IdeasSidebar";
import IdeaCard from "./components/IdeaCard";
import type { Idea, IdeaStatus } from "types/ideas";
import Modal from "components/ui/Modal";
import IdeaDetails from "./components/IdeaDetails";

const IDEAS_NS = "ideas";

const defaultFilters = {
  q: "",
  tags: [] as string[],
  status: "All" as "All" | IdeaStatus,
  minImpact: 0 as 0 | 1 | 2 | 3 | 4 | 5,
};

export default function IdeasView() {
  const [ideas, setIdeas] = useState<Idea[]>(() =>
    storage.get(IDEAS_NS, "items", [] as Idea[])
  );
  const [selectedId, setSelectedId] = useState<string | null>(() =>
    storage.get(IDEAS_NS, "selectedId", null)
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);

  // persist
  useEffect(() => {
    storage.set(IDEAS_NS, "items", ideas);
  }, [ideas]);

  useEffect(() => {
    if (selectedId) storage.set(IDEAS_NS, "selectedId", selectedId);
    else storage.remove(IDEAS_NS, "selectedId");
  }, [selectedId]);

  // mobile toggle
  useEffect(() => {
    const handler = () => setIsSidebarOpen((s) => !s);
    window.addEventListener("app:toggleSidebar", handler as EventListener);
    return () =>
      window.removeEventListener("app:toggleSidebar", handler as EventListener);
  }, []);

  const saveSelected = (updated: Idea) => {
    const next = ideas.map((i) => (i.id === updated.id ? updated : i));
    setIdeas(next);
    // if you persist here, keep your existing storage.set call:
    storage.set(IDEAS_NS, "ideas", next);
  };

  const allTags = useMemo(() => {
    const t = new Set<string>();
    ideas.forEach((i) => i.tags?.forEach((x) => t.add(x)));
    return Array.from(t).sort();
  }, [ideas]);

  const visible = useMemo(() => {
    return ideas.filter((i) => {
      if (filters.status !== "All" && i.status !== filters.status) return false;
      if (filters.minImpact > 0 && (i.impact ?? 0) < filters.minImpact)
        return false;
      if (filters.tags.length && !filters.tags.every((t) => i.tags.includes(t)))
        return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const hay = (
          i.title +
          " " +
          (i.oneLiner || "") +
          " " +
          (i.problem || "") +
          " " +
          (i.notes || "")
        ).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [ideas, filters]);

  const addIdea = (draft: Omit<Idea, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const rec: Idea = {
      ...draft,
      id: `idea-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    const next = [...ideas, rec];
    setIdeas(next);
    setSelectedId(rec.id);
  };

  const updateIdea = (id: string, patch: Partial<Idea>) => {
    const now = new Date().toISOString();
    setIdeas((list) =>
      list.map((i) => (i.id === id ? { ...i, ...patch, updatedAt: now } : i))
    );
  };

  const deleteIdea = (id: string) => {
    const next = ideas.filter((i) => i.id !== id);
    setIdeas(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? null);
  };

  const selected = useMemo(
    () => ideas.find((i) => i.id === selectedId) || null,
    [ideas, selectedId]
  );

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="flex-1 min-h-0 w-full">
        <div className="relative h-full w-full flex overflow-hidden">
          {/* backdrop (mobile) */}
          <div
            onClick={() => setIsSidebarOpen(false)}
            className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          />
          {/* sidebar */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-gray-900 text-white border-r border-gray-800 overflow-y-auto shrink-0 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:transform-none`}
          >
            <div className="h-full p-4">
              <IdeasSidebar
                tags={allTags}
                filters={filters}
                onChangeFilters={setFilters}
                items={ideas}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onCreate={addIdea}
              />
            </div>
          </aside>

          {/* main */}
          <main className="flex-1 min-w-0 h-full overflow-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Ideas Lab</h1>
                <div className="text-sm text-gray-500">
                  {visible.length} idea{visible.length === 1 ? "" : "s"}
                </div>
              </div>

              {visible.length === 0 ? (
                <div className="rounded-lg border bg-white p-8 text-gray-600">
                  No ideas yet — add one from the left.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {visible.map((i) => (
                    <IdeaCard
                      key={i.id}
                      idea={i}
                      active={i.id === selectedId}
                      onClick={() => setSelectedId(i.id)}
                      onRename={(title) => updateIdea(i.id, { title })}
                      onDelete={() => deleteIdea(i.id)}
                    />
                  ))}
                </div>
              )}

              {selected && (
                <div className="mt-6 rounded-lg border bg-white p-4">
                  <h2 className="text-lg font-semibold">{selected.title}</h2>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                    {selected.oneLiner || "—"}
                  </p>
                  {!!selected.tags.length && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-gray-100 text-xs"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500">
                        Impact
                      </label>
                      <div className="text-sm">{selected.impact}</div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">
                        Effort
                      </label>
                      <div className="text-sm">{selected.effort}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded border px-3 py-2"
                      defaultValue={selected.notes || ""}
                      onBlur={(e) =>
                        updateIdea(selected.id, { notes: e.target.value })
                      }
                      placeholder="Capture details, acceptance criteria, or quick sketches…"
                    />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Modal
        isOpen={!!selected}
        onClose={() => setSelectedId(null)}
        title={selected ? selected.title : "Idea"}
        className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full"
      >
        {selected && (
          <IdeaDetails
            idea={selected}
            onSave={(u) => {
              saveSelected(u);
              setSelectedId(null);
            }}
            onClose={() => setSelectedId(null)}
            onDelete={(id) => {
              const next = ideas.filter((i) => i.id !== id);
              setIdeas(next);
              // storage.set(IDEAS_NS, "ideas", next);
              setSelectedId(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
