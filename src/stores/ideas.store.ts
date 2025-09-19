// stores/ideas.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IDEAS_NS } from "packages/storage";
import type { Idea, IdeaType } from "types/ideas";

type IdeasState = {
  items: Idea[];
  selectedId: string | null;

  addIdea: (input: {
    title: string;
    ideaType: IdeaType;
    tags: string[];
    oneLiner?: string;
  }) => Idea;

  setSelectedId: (id: string | null) => void;
  updateIdea: (id: string, patch: Partial<Idea>) => void;
  removeIdea: (id: string) => void;
};

const namespacedStorage = createJSONStorage(() => ({
  getItem: (name: string) =>
    localStorage.getItem(`${IDEAS_NS}:${name}`) ?? null,
  setItem: (name: string, value: string) =>
    localStorage.setItem(`${IDEAS_NS}:${name}`, value),
  removeItem: (name: string) => localStorage.removeItem(`${IDEAS_NS}:${name}`),
}));

export const useIdeasStore = create<IdeasState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedId: null,

      addIdea: ({ title, ideaType, tags, oneLiner }) => {
        const now = new Date().toISOString();
        const idea: Idea = {
          id: `idea-${Date.now()}`,
          title: title.trim(),
          ideaType,
          tags,
          oneLiner: (oneLiner || "").trim(),
          status: "Draft",
          createdAt: now,
          updatedAt: now,
          // all other fields default undefined for now
        };
        set((s) => ({ items: [idea, ...s.items], selectedId: idea.id }));
        return idea;
      },

      setSelectedId: (id) => set({ selectedId: id }),

      updateIdea: (id, patch) =>
        set((s) => ({
          items: s.items.map((it) =>
            it.id === id
              ? { ...it, ...patch, updatedAt: new Date().toISOString() }
              : it
          ),
        })),

      removeIdea: (id) =>
        set((s) => {
          const next = s.items.filter((it) => it.id !== id);
          return {
            items: next,
            selectedId:
              s.selectedId === id ? (next[0]?.id ?? null) : s.selectedId,
          };
        }),
    }),
    {
      name: `${IDEAS_NS}:store`,
      version: 1,
      storage: namespacedStorage,
    }
  )
);
