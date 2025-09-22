import React, { useEffect, useState } from "react";
import { Routes, Route, useSearchParams, Navigate } from "react-router-dom";

import Sidebar from "features/board/components/Sidebar";
import BoardView from "features/board/BoardView";
import FeatureDashboard from "features/board/features/FeatureDashboard";
// import FeatureBoard from "features/board/features/FeatureBoard";

import type { SidebarProps } from "types/sidebar";
import { storage, BOARD_NS } from "packages/storage";
import { Project } from "types/board";
import StoriesView from "features/board/StoriesView";

/**
 * This component is the persistent layout for the board area.
 * Left: sidebar. Right: nested routes (BoardView | Features | Feature detail).
 * We read/write the selected project id via query param (?project=) and storage.
 */

const DEFAULT_COLS = [
  { id: "to-do", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "validation", title: "Validation" },
  { id: "done", title: "Done" },
] as const;
export default function BoardApp() {
  const [search] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => readProjects());
  const [tasks, setTasks] = useState<any[]>(() => readTasks());

  // allow header hamburger to toggle (if you emit 'app:toggleSidebar')
  useEffect(() => {
    const handler = () => setIsSidebarOpen((s) => !s);
    window.addEventListener("app:toggleSidebar", handler as EventListener);
    return () =>
      window.removeEventListener("app:toggleSidebar", handler as EventListener);
  }, []);

  const projectFromUrl = search.get("project") || "";

  // ---- small local helpers to hydrate sidebar props from storage ----
  // --- reactive storage readers ---
  function read<T>(key: string, fallback: T): T {
    try {
      const v = storage.get<T>(BOARD_NS, key, fallback);
      return v ?? fallback;
    } catch {
      return fallback;
    }
  }

  function readProjects(): Project[] {
    const raw = read<any[]>("projects", []);
    return raw.map((p) => ({
      id: p.id,
      name: p.name,
      columns:
        Array.isArray(p.columns) && p.columns.length
          ? p.columns
          : [...DEFAULT_COLS],
    }));
  }

  function readTasks(): any[] {
    return read<any[]>("tasks", []);
  }

  // keep BoardApp in sync with storage & custom updates
  useEffect(() => {
    const sync = () => {
      setProjects(readProjects());
      setTasks(readTasks());
    };
    window.addEventListener("storage", sync);
    window.addEventListener("board:projectsUpdated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(
        "board:projectsUpdated",
        sync as EventListener
      );
    };
  }, []);

  const selectedProject =
    projects.find((p) => p.id === projectFromUrl) ??
    projects.find((p) => p.id === read<string>("selectedProjectId", "")) ??
    null;

  const sidebarProps: SidebarProps = {
    projects,
    selectedProject,
    onSelectProject: (p) => {
      storage.set(BOARD_NS, "selectedProjectId", p.id);
      // we do not navigate here; Sidebar already navigates with ?project=
    },
    isSidebarOpen,
    onToggleSidebar: () => setIsSidebarOpen((s) => !s),
    tasks,
    onAddProject: (name: string) => {
      const next = [
        ...projects,
        { id: `proj_${Date.now()}`, name, columns: [...DEFAULT_COLS] },
      ];
      setProjects(next);
      storage.set(BOARD_NS, "projects", next);
      window.dispatchEvent(new Event("board:projectsUpdated"));
    },

    onConfirmDeleteProject: (p) => {
      const next = projects.filter((x) => x.id !== p.id);
      setProjects(next);
      storage.set(BOARD_NS, "projects", next);
      // also clear selected if it was this project
      const cur = read<string>("selectedProjectId", "");
      if (cur === p.id) storage.set(BOARD_NS, "selectedProjectId", "");
      window.dispatchEvent(new Event("board:projectsUpdated"));
    },
    onOpenDocuments: () => {},
  };

  return (
    <div className="flex h-full min-h-0 w-full">
      {/* mobile backdrop */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`lg:hidden fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* sliding sidebar on mobile, static on desktop */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white
      border-r border-gray-800 overflow-y-auto transform transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:transform-none`}
      >
        <div className="h-full p-4">
          <Sidebar {...sidebarProps} />
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        {/* Nested routes render on the right, sidebar persists */}
        <Routes>
          <Route index element={<BoardView />} />
          <Route path="features" element={<FeatureDashboard />} />
          {/* <Route path="features/:featureId" element={<FeatureBoard />} /> */}
          <Route path="stories" element={<StoriesView />} />
          {/* <Route path="story/:storyId" element={<StoryDetail />} /> */}

          <Route path="*" element={<Navigate to="/board" replace />} />
        </Routes>
      </main>
    </div>
  );
}
