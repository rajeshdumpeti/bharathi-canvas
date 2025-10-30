import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import ExportStoriesBar from "./components/ExportStoriesBar";
import { useProjectStore } from "stores/projectStore";
import { useTaskStore } from "stores/taskStore";
import { toColumnTitle } from "utils/statusUtils";

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
      <div className="bg-white border-b">
        <div className="mx-auto w-full max-w-7xl flex items-center justify-between py-4">
          <h1 className="text-2xl font-semibold text-gray-900">User Stories</h1>
          <button
            onClick={handleBackToBoard}
            className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50 text-gray-700"
          >
            Back to Board
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-7xl p-6 space-y-4">
          <ExportStoriesBar project={selectedProject} items={filtered} />

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, story code, or assignee"
              className="flex-1 rounded border px-3 py-2"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded border px-3 py-2"
            >
              <option value="all">All statuses</option>
              {["to_do", "in_progress", "validation", "done"].map((s) => (
                <option key={s} value={s}>
                  {toColumnTitle(s as any)}
                </option>
              ))}
            </select>
            <select
              value={selectedProjectId || ""}
              onChange={(e) => {
                selectProject(e.target.value);
                loadTasks(e.target.value);
              }}
              className="rounded border px-3 py-2"
            >
              <option value="">All projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="overflow-auto rounded border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left p-3 w-28">Story Code</th>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Assignee</th>
                  <th className="text-left p-3 w-40">Status</th>
                  <th className="text-left p-3">Priority</th>
                  <th className="text-left p-3 w-44">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      No stories match.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="p-3 font-mono text-blue-700">
                        {t.story_code || "—"}
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-gray-900">
                          {t.title || "Untitled"}
                        </div>
                      </td>
                      <td className="p-3">{t.assignee || "—"}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            STATUS_COLORS[t.status || ""] ||
                            "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {toColumnTitle(t.status as any)}
                        </span>
                      </td>
                      <td className="p-3">{t.priority || "—"}</td>
                      <td className="p-3">
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
  );
}
