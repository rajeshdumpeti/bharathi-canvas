import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { storage, BOARD_NS } from "packages/storage";
import ExportStoriesBar from "./components/ExportStoriesBar";

type StatusId = "to-do" | "in-progress" | "validation" | "done";

type Task = {
  id: string;
  project?: string;
  storyId?: string;
  title?: string;
  status?: StatusId | string;
  assignee?: string;
  priority?: "High" | "Medium" | "Low" | string;
  createdAt?: string;
  completedAt?: string;
  acceptanceCriteria?: string;
};

type Project = {
  id: string;
  name: string;
  columns?: { id: string; title: string }[];
};

const STATUSES: { id: StatusId; label: string }[] = [
  { id: "to-do", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "validation", label: "Validation" },
  { id: "done", label: "Done" },
];

const STATUS_COLORS: Record<string, string> = {
  "to-do": "bg-gray-100 text-gray-700",
  "in-progress": "bg-blue-100 text-blue-700",
  validation: "bg-amber-100 text-amber-700",
  done: "bg-green-100 text-green-700",
};

function readBoard<T>(key: string, fallback: T): T {
  try {
    const v = storage.get<T>(BOARD_NS, key, fallback);
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

export default function StoriesView() {
  const [tasks, setTasks] = useState<Task[]>(() =>
    readBoard<Task[]>("tasks", [])
  );
  const [projects, setProjects] = useState<Project[]>(() =>
    readBoard<Project[]>("projects", [])
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() =>
    readBoard<string>("selectedProjectId", "")
  );
  const [q, setQ] = useState<string>("");
  const [status, setStatus] = useState<string>("all");

  // refresh from storage when page mounts
  useEffect(() => {
    setTasks(readBoard<Task[]>("tasks", []));
    setProjects(readBoard<Project[]>("projects", []));
    setSelectedProjectId(readBoard<string>("selectedProjectId", ""));
  }, []);

  const filtered = useMemo(() => {
    const needle = (q || "").toLowerCase();
    return tasks
      .filter((t) => {
        if (selectedProjectId && t.project !== selectedProjectId) return false;
        if (status !== "all" && t.status !== status) return false;
        if (!needle) return true;
        const hay =
          `${t.storyId || ""} ${t.title || ""} ${t.assignee || ""} ${t.acceptanceCriteria || ""}`.toLowerCase();
        return hay.includes(needle);
      })
      .sort((a, b) => (a.storyId || "").localeCompare(b.storyId || ""));
  }, [tasks, q, status, selectedProjectId]);

  return (
    <div className="h-full w-full flex flex-col bg-gray-50">
      <div className="bg-white border-b">
        <div className="mx-auto w-full max-w-7xl flex items-center justify-between py-4">
          <h1 className="text-2xl font-semibold text-gray-900">User Stories</h1>
          <Link
            to="/board"
            className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50 text-gray-700"
          >
            Back to Board
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-7xl p-6 space-y-4">
          <ExportStoriesBar
            project={projects.find((p) => p.id === selectedProjectId) || null}
            items={filtered}
          />

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, user story ID and Name "
              className="flex-1 rounded border px-3 py-2"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded border px-3 py-2"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={selectedProjectId || ""}
              onChange={(e) => setSelectedProjectId(e.target.value)}
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
                  <th className="text-left p-3 w-28">Story ID</th>
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
                        {t.storyId || "—"}
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-gray-900">
                          {t.title || "Untitled"}
                        </div>
                      </td>
                      <td className="p-3">{t.assignee || "—"}</td>
                      <td className="p-3">
                        {(() => {
                          const label =
                            STATUSES.find((s) => s.id === t.status)?.label ||
                            (t.status as string) ||
                            "—";
                          const color =
                            STATUS_COLORS[t.status || ""] ||
                            "bg-gray-200 text-gray-800";
                          return (
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${color}`}
                            >
                              {label}
                            </span>
                          );
                        })()}
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
