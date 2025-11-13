import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ExportStoriesBar from "./components/ExportStoriesBar";
import { useProjectStore } from "stores/projectStore";
import { useTaskStore } from "stores/taskStore";
import { toColumnTitle } from "utils/statusUtils";
import { FiArrowLeft, FiSearch, FiFilter, FiFolder } from "react-icons/fi";

const STATUS_COLORS: Record<string, string> = {
  to_do: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  validation: "bg-amber-100 text-amber-700",
  done: "bg-green-100 text-green-700",
};

export default function StoriesView() {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const { projects, selectedProjectId, selectProject, loadProjects } =
    useProjectStore();

  const { tasksByProject, loadTasks } = useTaskStore();

  // 🧠 Load projects on mount if not yet loaded
  useEffect(() => {
    if (projects.length === 0) loadProjects();
  }, [projects.length, loadProjects]);

  // 🧠 Determine which project is active from URL (?project=)
  useEffect(() => {
    const pid = search.get("project");
    if (pid && pid !== selectedProjectId) {
      selectProject(pid);
      loadTasks(pid);
    }
  }, [search, selectedProjectId, selectProject, loadTasks]);

  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const tasks = selectedProject ? tasksByProject[selectedProject.id] || [] : [];

  // 🧠 Filter logic
  const stableTasks = useMemo(() => tasks || [], [tasks]);

  const filtered = useMemo(() => {
    const needle = q.toLowerCase();
    return stableTasks
      .filter((t) => {
        if (status !== "all" && t.status !== status) return false;
        if (!needle) return true;
        const hay =
          `${t.story_code || ""} ${t.title || ""} ${t.assignee || ""} ${
            t.acceptanceCriteria || ""
          }`.toLowerCase();
        return hay.includes(needle);
      })
      .sort((a, b) => (a.story_code || "").localeCompare(b.story_code || ""));
  }, [stableTasks, q, status]);

  const handleBackToBoard = () => {
    if (selectedProjectId) {
      navigate(`/board?project=${selectedProjectId}`);
    } else {
      navigate("/board");
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Side: Title and Project Info */}
            <div className="flex gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiFolder className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  User Stories
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {selectedProject?.name || "All Projects"} • {filtered.length}{" "}
                  stories
                </p>
              </div>
            </div>

            {/* Right Side: Actions - Export buttons and Back to Board */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Export Buttons - Always horizontal */}
              <div className="flex gap-2 justify-start sm:justify-center">
                <ExportStoriesBar project={selectedProject} items={filtered} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-7xl p-4 space-y-4">
          <button
            onClick={handleBackToBoard}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors justify-center sm:justify-start"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to Board
          </button>
          {/* Filters Section */}
          <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <FiSearch className="h-4 w-4 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">
                Search & Filter
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Search Input */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Stories
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by title, story code, or assignee..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiFilter className="inline h-4 w-4 mr-1" />
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  {["to_do", "in_progress", "validation", "done"].map((s) => (
                    <option key={s} value={s}>
                      {toColumnTitle(s as any)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project
                </label>
                <select
                  value={selectedProjectId || ""}
                  onChange={(e) => {
                    selectProject(e.target.value);
                    loadTasks(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Projects</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stories Table */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-4 sm:px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                Stories ({filtered.length})
              </h3>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                      Story Code
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Assignee
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Priority
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell w-32">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 sm:px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FiSearch className="h-12 w-12 mb-3 text-gray-300" />
                          <p className="text-lg font-medium mb-1">
                            No stories found
                          </p>
                          <p className="text-sm">
                            {q || status !== "all"
                              ? "Try adjusting your search or filters"
                              : "No stories available for this project"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-sm font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                            {t.story_code || "—"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="font-medium text-gray-900 text-sm">
                            {t.title || "Untitled"}
                          </div>
                          {/* Mobile-only assignee */}
                          <div className="sm:hidden text-xs text-gray-500 mt-1">
                            {t.assignee || "Unassigned"}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                          {t.assignee || "—"}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              STATUS_COLORS[t.status || ""] ||
                              "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {toColumnTitle(t.status as any)}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              t.priority === "High"
                                ? "bg-red-100 text-red-800"
                                : t.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {t.priority || "—"}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {(t.createdAt || "").slice(0, 10) || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
