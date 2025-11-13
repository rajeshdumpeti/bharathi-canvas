import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Project, BoardColumn } from "types/board";
import { api } from "lib/api";
import { fetchProjects } from "api/projects";

// Canonical column order & titles (used to normalize server data)
export const COLUMN_ORDER: Array<BoardColumn["id"]> = [
  "to_do",
  "in_progress",
  "validation",
  "done",
];

export const DEFAULT_COLUMNS: BoardColumn[] = [
  { id: "to_do", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "validation", title: "Validation" },
  { id: "done", title: "Done" },
];

function normalizeColumns(cols?: BoardColumn[] | null): BoardColumn[] {
  if (!cols || !cols.length) return DEFAULT_COLUMNS;

  // If backend returns with 'pos', prefer that; otherwise sort to our canonical order.
  const byId = new Map(cols.map((c) => [String(c.id), c]));
  const ordered: BoardColumn[] = [];

  for (const id of COLUMN_ORDER) {
    const c = byId.get(String(id));
    if (c) ordered.push({ id: c.id, title: c.title });
  }

  // include any custom columns that aren't in canonical order, at the end
  cols.forEach((c) => {
    if (!ordered.find((o) => o.id === c.id))
      ordered.push({ id: c.id, title: c.title });
  });

  return ordered;
}

type State = {
  projects: Project[];
  selectedProjectId: string | null;
  isLoading: boolean;
  error: string | null;
};

type Actions = {
  setProjects: (projects: Project[]) => void; // ✅ newly added
  /** Fetch projects from API and normalize columns */
  loadProjects: () => Promise<void>;

  /** Set the selected project id (doesn't mutate URL here; we'll do that in a hook) */
  selectProject: (id: string | null) => void;

  /** Create a project via API, append to state, and select it */
  addProject: (name: string) => Promise<Project | null>;

  /** Update columns for a project (client state only; API is separate) */
  setColumns: (projectId: string, cols: BoardColumn[]) => void;

  /** Remove a project locally (API remove is optional; can be added later) */
  removeProjectLocal: (projectId: string) => void;

  /** Helper selectors */
  getSelectedProject: () => Project | null;
};

export const useProjectStore = create<State & Actions>()(
  devtools((set, get) => ({
    projects: [],
    selectedProjectId: null,
    isLoading: false,
    error: null,
    setProjects: (projects) => set({ projects }),
    loadProjects: async () => {
      set({ isLoading: true, error: null });
      try {
        const rows = await fetchProjects();

        // normalize columns per project
        const normalized = rows.map((p) => ({
          ...p,
          columns: normalizeColumns(p.columns),
        }));

        set({ projects: normalized, isLoading: false });

        // If nothing is selected yet, default to the first project
        const cur = get().selectedProjectId;
        if (!cur && normalized.length > 0) {
          set({ selectedProjectId: normalized[0].id });
        }
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.message ?? "Failed to load projects",
        });
      }
    },

    selectProject: (id) => {
      set({ selectedProjectId: id });
    },

    addProject: async (name: string) => {
      try {
        const res = await api.post<Project>("/projects", { name });
        const created = res.data;

        const proj: Project = {
          ...created,
          columns: normalizeColumns(created.columns),
        };

        set((s) => ({
          projects: [...s.projects, proj],
          selectedProjectId: proj.id,
        }));

        return proj;
      } catch (err) {
        // Keep state unchanged if API fails
        set({ error: "Failed to create project" });
        return null;
      }
    },

    setColumns: (projectId, cols) => {
      const normalized = normalizeColumns(cols);
      set((s) => ({
        projects: s.projects.map((p) =>
          p.id === projectId ? { ...p, columns: normalized } : p
        ),
      }));
    },

    removeProjectLocal: (projectId) => {
      set((s) => {
        const next = s.projects.filter((p) => p.id !== projectId);
        let selectedProjectId = s.selectedProjectId;
        if (selectedProjectId === projectId) {
          selectedProjectId = next.length ? next[0].id : null;
        }
        return { projects: next, selectedProjectId };
      });
    },

    getSelectedProject: () => {
      const { projects, selectedProjectId } = get();
      return projects.find((p) => p.id === selectedProjectId) ?? null;
    },
  }))
);
