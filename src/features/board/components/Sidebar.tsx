// src/features/board/components/Sidebar.tsx
import React, { useState } from "react";
import { SidebarProps } from "types/sidebar";

const Sidebar: React.FC<SidebarProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onAddProject,
  isSidebarOpen,
  onToggleSidebar,
  tasks,
  onConfirmDeleteProject,
  onOpenDocuments,
}) => {
  const [newProjectName, setNewProjectName] = useState("");

  const projectTasks = tasks.filter(
    (task) => selectedProject && task.project === selectedProject.id
  );
  const todoCount = projectTasks.filter((t) => t.status === "to-do").length;
  const inProgressCount = projectTasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const doneCount = projectTasks.filter((t) => t.status === "done").length;
  const totalTasks = projectTasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
    <div className="flex flex-col h-full min-h-0 transition-all duration-300 pt-2">
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Projects</h3>
        <button
          onClick={onToggleSidebar}
          className="p-2 lg:hidden rounded-lg hover:bg-gray-700 transition-colors"
          aria-label="Close sidebar"
        >
          <svg
            className="w-6 h-6"
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

      {/* Project List */}
      <ul className="flex-1 space-y-2 mb-6 overflow-y-auto max-h-full min-h-0 pr-2 custom-scrollbar">
        {projects.length === 0 ? (
          <li className="p-2 rounded-lg bg-gray-800/70 text-gray-300 text-sm select-none">
            Your project goes here
          </li>
        ) : (
          projects.map((project) => (
            <li
              key={project.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                selectedProject?.id === project.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <span
                onClick={() => {
                  onSelectProject(project);
                  onToggleSidebar();
                }}
                className="flex-1 pr-2"
              >
                {project.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirmDeleteProject(project);
                }}
                className="p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors"
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
          className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!newProjectName.trim()}
          className={`w-full py-2 rounded-lg font-semibold transition
            ${
              newProjectName.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
        >
          Add
        </button>
      </form>

      {/* Dashboard Overview */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2">Dashboard</h4>
        <p className="text-sm mb-1">
          Total Tasks: <span className="font-bold">{totalTasks}</span>
        </p>
        <ul className="text-xs space-y-1 mb-2">
          <li>To Do: {todoCount}</li>
          <li>In Progress: {inProgressCount}</li>
          <li>Done: {doneCount}</li>
        </ul>
        <p className="text-sm font-semibold">
          Progress: {progressPercentage}% Done
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-4">{currentDate}</p>
      </div>
    </div>
  );
};

export default Sidebar;
