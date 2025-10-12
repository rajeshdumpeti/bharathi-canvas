// src/app/board/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useSearchParams, Navigate } from "react-router-dom";
import Sidebar from "features/board/components/Sidebar";
import BoardView from "features/board/BoardView";
import FeatureDashboard from "features/board/features/FeatureDashboard";
import StoriesView from "features/board/StoriesView";
import { useProjectStore } from "stores/projectStore";
import { useTaskStore } from "stores/taskStore";
import { api } from "lib/api";

/**
 * BoardApp - main layout that holds Sidebar and all board views.
 * Projects and tasks are fetched via Zustand stores.
 */

export default function BoardApp() {
  const [search] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    projects,
    selectedProjectId,
    loadProjects,
    selectProject,
    removeProjectLocal,
  } = useProjectStore();

  const { tasksByProject, loadTasks } = useTaskStore();

  // 🧠 Load all projects at mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // 🧠 When project changes in URL, sync with store
  useEffect(() => {
    const pid = search.get("project");
    if (pid && pid !== selectedProjectId) {
      selectProject(pid);
      loadTasks(pid);
    }
  }, [search, selectedProjectId, selectProject, loadTasks]);

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || null;
  const tasks = selectedProject ? tasksByProject[selectedProject.id] || [] : [];

  const handleAddProject = async (name: string) => {
    try {
      const res = await api.post("/projects", { name });
      const created = res.data;
      await loadProjects(); // reload from backend
      selectProject(created.id);
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleDeleteProject = (project: any) => {
    removeProjectLocal(project.id);
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

      {/* sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white
  border-r border-gray-800 overflow-y-auto transform transition-transform duration-300 ease-in-out
  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:transform-none`}
      >
        <div className="h-full p-4">
          <Sidebar
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={(project) => selectProject(project.id)} // ✅ fixed
            onAddProject={handleAddProject}
            onConfirmDeleteProject={handleDeleteProject}
            tasks={tasks}
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((s) => !s)}
          />
        </div>
      </aside>

      {/* main content */}
      <main className="min-w-0 flex-1">
        <Routes>
          <Route index element={<BoardView />} />
          <Route path="features" element={<FeatureDashboard />} />
          <Route path="stories" element={<StoriesView />} />
          <Route path="*" element={<Navigate to="/board" replace />} />
        </Routes>
      </main>
    </div>
  );
}
