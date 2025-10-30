import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SidebarProps } from "types/sidebar";
import { useProjectStore } from "stores/projectStore";

const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onAddProject,
  onToggleSidebar,
  tasks,
  onConfirmDeleteProject,
}) => {
  const [newProjectName, setNewProjectName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { selectProject } = useProjectStore();
  // Are we currently on the Features view?
  const isFeatures = location.pathname.startsWith("/board/features");

  // Project context (used to keep the same project when switching views)

  // Metrics (unchanged)
  const projectTasks = tasks.filter(
    (t) => selectedProject && t.project === selectedProject.id
  );
  const todoCount = projectTasks.filter((t) => t.status === "to_do").length;
  const inProgressCount = projectTasks.filter(
    (t) => t.status === "in_progress"
  ).length;
  const doneCount = projectTasks.filter((t) => t.status === "done").length;
  const totalTasks = projectTasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;
  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const name = (newProjectName || "").trim();
    if (!name) return;
    const exists = projects.some(
      (p) => p.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (exists) return;
    onAddProject(name);
    setNewProjectName("");
  };

  return (
    <div className="flex h-full min-h-0 flex-col pt-2 transition-all duration-300">
      {/* Sidebar Header */}
      <div className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-bold">Projects</h3>
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 transition-colors hover:bg-gray-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Views: Board | Features */}
        <div className="mb-4 inline-flex rounded-lg bg-gray-800/70 p-1">
          <button
            className={`px-3 py-1 rounded ${!isFeatures ? "bg-blue-600 text-white" : "bg-gray-700"}`}
            onClick={() => {
              const pid = selectedProject?.id || "";
              navigate(`/board${pid ? `?project=${pid}` : ""}`);
            }}
          >
            Board
          </button>

          <button
            className={`px-3 py-1 rounded ${isFeatures ? "bg-blue-600 text-white" : "bg-gray-700"}`}
            onClick={() => {
              const pid = selectedProject?.id || "";
              navigate(`/board/features${pid ? `?project=${pid}` : ""}`);
            }}
          >
            Features
          </button>
        </div>
      </div>

      {/* Project List */}
      <ul className="custom-scrollbar mb-6 max-h-full min-h-0 flex-1 space-y-2 overflow-y-auto pr-2">
        {projects.length === 0 ? (
          <li className="select-none rounded-lg bg-gray-800/70 p-2 text-sm text-gray-300">
            Your project goes here
          </li>
        ) : (
          projects.map((project) => (
            <li
              key={project.id}
              className={`flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors ${
                selectedProject?.id === project.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => {
                selectProject(project.id);
                onSelectProject(project); // optional callback for parent
                const base = isFeatures ? "/board/features" : "/board";
                navigate(`${base}?project=${project.id}`);
                onToggleSidebar();
              }}
            >
              <span className="flex-1 pr-2">{project.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirmDeleteProject(project);
                }}
                className="rounded-full p-1 text-gray-400 transition-colors hover:text-red-500"
                title="Delete Project"
                aria-label={`Delete project ${project.name}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Add Project */}
      <form onSubmit={handleAddProject} className="mb-6 space-y-2">
        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="New project name"
          className="w-full rounded-lg bg-gray-700 p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newProjectName.trim()}
          className={`w-full rounded-lg py-2 font-semibold transition ${
            newProjectName.trim()
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-600 text-gray-300"
          }`}
        >
          Add
        </button>
      </form>

      {/* Dashboard Overview */}
      <div className="rounded-lg bg-gray-800 p-4">
        <h4 className="mb-2 font-semibold">Dashboard</h4>
        <p className="mb-1 text-sm">
          Total Tasks: <span className="font-bold">{totalTasks}</span>
        </p>
        <ul className="mb-2 space-y-1 text-xs">
          <li>To Do: {todoCount}</li>
          <li>In Progress: {inProgressCount}</li>
          <li>Done: {doneCount}</li>
        </ul>
        <p className="text-sm font-semibold">
          Progress: {progressPercentage}% Done
        </p>
        <div className="mt-2 h-2.5 w-full rounded-full bg-gray-700">
          <div
            className="h-2.5 rounded-full bg-blue-600"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="mt-4 text-xs text-gray-400">{currentDate}</p>
      </div>
    </div>
  );
};

export default Sidebar;
