// src/features/board/BoardView.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Modal, EmptyState } from "packages/ui";
import { storage, BOARD_NS } from "packages/storage";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";
import AddColumnModal from "./components/AddColumnModal";
import type { BoardColumn, Project, Task } from "types/board";
import {
  deleteStoryById,
  moveStoryByStoryId,
  featuresByProject,
  syncTaskToStory,
} from "./features/storage";
import { api } from "lib/api";
import { fetchTasksByProject, createTask } from "api/tasks";

const DEFAULT_COLS: BoardColumn[] = [
  { id: "to_do", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "validation", title: "Validation" },
  { id: "done", title: "Done" },
];

export default function BoardView() {
  const [search] = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // UI state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  const [isProjectDeleteModalOpen, setIsProjectDeleteModalOpen] =
    useState(false);

  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const [columnToDeleteId, setColumnToDeleteId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // rail helpers
  const columnsRef = useRef<HTMLDivElement | null>(null);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const setColumnRef = (id: string) => (el: HTMLDivElement | null) => {
    columnRefs.current[id] = el;
  };
  const scrollColumnsBy = (delta: number) => {
    if (!columnsRef.current) return;
    columnsRef.current.scrollBy({ left: delta, behavior: "smooth" });
  };
  const scrollToColumn = (colId: string) => {
    const el = columnRefs.current[colId];
    if (!el || !columnsRef.current) return;
    const parent = columnsRef.current;
    const left = el.offsetLeft - 16;
    parent.scrollTo({ left, behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedProject) return;

    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const tasks = await fetchTasksByProject(selectedProject.id);
        setTasks(tasks);
        storage.set(BOARD_NS, "tasks", tasks); // optional caching
      } catch (err) {
        console.error("Failed to load tasks", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [selectedProject]);

  // ---------- Load projects and tasks from backend ----------
  console.log("projects", projects);
  useEffect(() => {
    const loadProjectsAndTasks = async () => {
      try {
        setIsLoading(true);
        const projectsRes = await api.get("/projects");
        const allProjects = projectsRes.data || [];
        setProjects(allProjects);

        // auto-select the first project or query param
        const qid = search.get("project");
        const active =
          allProjects.find((p) => p.id === qid) || allProjects[0] || null;
        setSelectedProject(active);

        if (active) {
          const tasksRes = await fetchTasksByProject(active.id);
          setTasks(tasksRes);
          const desiredOrder = ["to_do", "in_progress", "validation", "done"];
          const cols = (next?.columns || [])
            .map((c: any) => ({
              id: String(c.key ?? c.id ?? "").replaceAll("-", "_"),
              title: c.title,
            }))
            .sort(
              (a, b) => desiredOrder.indexOf(a.id) - desiredOrder.indexOf(b.id)
            );

          setColumns(cols.length ? cols : DEFAULT_COLS);
        } else {
          setColumns(DEFAULT_COLS);
          setTasks([]);
        }
      } catch (err) {
        console.error("Failed to load board data", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectsAndTasks();
  }, [search]);

  // ---------- react to sidebar/storage changes ----------
  useEffect(() => {
    if (!selectedProject?.id) {
      setTasks([]);
      return;
    }
    (async () => {
      try {
        const remote = await fetchTasksByProject(selectedProject.id);
        setTasks(remote);
      } catch (e) {
        console.error("Failed to load tasks", e);
        setTasks([]);
      }
    })();
  }, [selectedProject?.id]);

  // ---------- derive selected project from ?project= or stored id ----------
  // ---------- derive selected project from ?project= or stored id ----------
  useEffect(() => {
    const qid = search.get("project") || null;
    const storedId = storage.get<string | null>(
      BOARD_NS,
      "selectedProjectId",
      null
    );
    const pickId = qid ?? storedId;

    const next = projects.find((p) => p.id === pickId) || projects[0] || null;
    setSelectedProject(next);

    // ✅ If the project doesn't have columns yet, fall back to defaults
    if (next) {
      // if (!next.columns || next.columns.length === 0) {
      //   next.columns = DEFAULT_COLS;
      // }
      const desiredOrder = ["to_do", "in_progress", "validation", "done"];
      const cols = (next?.columns || [])
        .map((c: any) => ({
          id: String(c.key ?? c.id ?? "").replaceAll("-", "_"),
          title: c.title,
        }))
        .sort(
          (a, b) => desiredOrder.indexOf(a.id) - desiredOrder.indexOf(b.id)
        );

      setColumns(cols.length ? cols : DEFAULT_COLS);
    } else {
      setColumns(DEFAULT_COLS);
      storage.remove(BOARD_NS, "selectedProjectId");
    }
  }, [search, projects]);

  // ---------- project helpers (used by delete project modal) ----------
  const confirmDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setIsProjectDeleteModalOpen(true);
  };
  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    const nextProjects = projects.filter((p) => p.id !== projectToDelete.id);
    const nextTasks = tasks.filter((t) => t.project !== projectToDelete.id);

    setProjects(nextProjects);
    setTasks(nextTasks);
    storage.set(BOARD_NS, "projects", nextProjects);
    storage.set(BOARD_NS, "tasks", nextTasks);

    const nextSel = nextProjects[0] || null;
    setSelectedProject(nextSel);
    setColumns(nextSel?.columns || DEFAULT_COLS);

    if (nextSel) storage.set(BOARD_NS, "selectedProjectId", nextSel.id);
    else storage.remove(BOARD_NS, "selectedProjectId");

    setIsProjectDeleteModalOpen(false);
    setProjectToDelete(null);

    // let the sidebar refresh
    window.dispatchEvent(new Event("board:projectsUpdated"));
  };

  // ---------- DnD ----------
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    taskId: string
  ) => {
    e.dataTransfer.setData("taskId", taskId);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    newColumnId: string
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const nowISO = new Date().toISOString();

    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const wasDone = t.status === "done";
      const willBeDone = newColumnId === "done";
      return {
        ...t,
        status: newColumnId,
        completedAt: willBeDone && !wasDone ? nowISO : (t.completedAt ?? null),
      };
    });

    setTasks(updated);
    storage.set(BOARD_NS, "tasks", updated);

    // if mirrored from a Feature story, move it there as well
    const moved = tasks.find((t) => t.id === taskId);
    if (moved?.storyId) {
      const toFeature =
        newColumnId === "to_do"
          ? "To Do"
          : newColumnId === "in_progress"
            ? "In Progress"
            : newColumnId === "validation"
              ? "Validation"
              : "Done";
      moveStoryByStoryId(moved.storyId, toFeature);
    }
  };

  // ---------- tasks ----------
  type DraftTask = Partial<Task> & { id?: string; featureId?: string };

  const handleAddTask = (columnId?: string | React.MouseEvent) => {
    if (!selectedProject) return;
    const isEventLike =
      columnId &&
      typeof columnId === "object" &&
      ("nativeEvent" in columnId || "target" in columnId);
    const status = isEventLike
      ? "to_do"
      : typeof columnId === "string"
        ? columnId
        : "to_do";

    setEditingTask({
      id: `temp-${Date.now()}`,
      status: status as Task["status"],
      title: "",
      description: "",
      assignee: "",
      priority: "Low",
      architecture: "FE",
      project: selectedProject.id,
      acceptanceCriteria: "",
    });
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: DraftTask) => {
    if (!selectedProject) return;

    try {
      // build payload for backend (underscores; backend stores as needed)
      const payload = {
        title: taskData.title || "",
        description: taskData.description || "",
        status: (taskData.status as string) || "to_do",
        assignee: taskData.assignee || "",
        project_id: selectedProject.id,
      };

      // create on server
      const created = await createTask(payload);

      // push into UI immediately (no refresh needed)
      setTasks((prev) => [...prev, created]);

      // (optional) if you still mirror to Features:
      if (typeof taskData.featureId === "string" && taskData.featureId) {
        syncTaskToStory(
          {
            id: created.id,
            project: created.project!,
            storyId: created.storyId, // if you add it later
            title: created.title,
            status: created.status as any,
            assignee: created.assignee,
            priority: created.priority ?? "Low",
            createdAt: created.createdAt,
            completedAt: created.completedAt ?? null,
            acceptanceCriteria: created.acceptanceCriteria ?? "",
          } as any,
          taskData.featureId
        );
      }

      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to create task", err);
      alert("Failed to create task. Please try again.");
    }
  };

  const confirmDeleteTask = (taskId: string) => {
    setTaskToDeleteId(taskId);
    setIsDeleteTaskModalOpen(true);
  };
  const handleDeleteTask = () => {
    if (!taskToDeleteId) return;
    const doomed = tasks.find((t) => t.id === taskToDeleteId);
    const updated = tasks.filter((t) => t.id !== taskToDeleteId);
    setTasks(updated);
    storage.set(BOARD_NS, "tasks", updated);
    if (doomed?.storyId) {
      deleteStoryById(doomed.storyId);
    }
    setIsDeleteTaskModalOpen(false);
    setTaskToDeleteId(null);
  };

  // ---------- columns ----------
  const confirmDeleteColumn = (columnId: string) => {
    setColumnToDeleteId(columnId);
    setIsDeleteColumnModalOpen(true);
  };

  const handleDeleteColumn = () => {
    if (!selectedProject || !columnToDeleteId) return;

    const updatedCols = (columns || []).filter(
      (c) => c.id !== columnToDeleteId
    );
    const updatedTasks = tasks.filter((t) => t.status !== columnToDeleteId);

    setColumns(updatedCols);
    setTasks(updatedTasks);

    const updatedProjects = projects.map((p) =>
      p.id === selectedProject.id ? { ...p, columns: updatedCols } : p
    );
    setProjects(updatedProjects);

    storage.set(BOARD_NS, "projects", updatedProjects);
    storage.set(BOARD_NS, "tasks", updatedTasks);

    setIsDeleteColumnModalOpen(false);
    setColumnToDeleteId(null);

    // let the sidebar refresh
    window.dispatchEvent(new Event("board:projectsUpdated"));
  };

  const handleAddColumn = (newTitle: string) => {
    if (!newTitle || !selectedProject) return;
    const newColumns = [
      ...columns,
      { id: newTitle.toLowerCase().replace(/\s+/g, "-"), title: newTitle },
    ];
    setColumns(newColumns);

    const updatedProjects = projects.map((p) =>
      p.id === selectedProject.id ? { ...p, columns: newColumns } : p
    );
    setProjects(updatedProjects);
    storage.set(BOARD_NS, "projects", updatedProjects);

    setIsColumnModalOpen(false);

    // let the sidebar refresh
    window.dispatchEvent(new Event("board:projectsUpdated"));
  };

  // ---------- render ----------
  return (
    <div className="h-full w-full flex flex-col bg-gray-50 font-sans text-gray-800">
      <div className="flex-1 min-h-0 w-full">
        <div className="relative h-full w-full flex overflow-hidden">
          {/* Right content */}
          <main className="flex-1 min-w-0 h-full overflow-auto">
            <div className="h-full flex flex-col">
              {/* Title bar */}
              <div className="bg-white border-b">
                {selectedProject && (
                  <div className="mx-auto w-full max-w-7xl flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 px-2 gap-3">
                    <div className="flex w-full justify-between sm:justify-start sm:gap-2">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {`${selectedProject.name} Project`}
                      </h1>
                      <button
                        onClick={() => handleAddTask("to_do")}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                      >
                        Create Story
                      </button>
                    </div>
                    <div className="flex w-full justify-between sm:justify-end sm:gap-2">
                      <Link
                        to="stories"
                        className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                        title="View all stories"
                      >
                        US LookUp
                      </Link>
                      <button
                        onClick={() =>
                          selectedProject && setIsColumnModalOpen(true)
                        }
                        disabled={!selectedProject}
                        className={`rounded-md border px-2 py-1 text-sm ${
                          selectedProject
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Add Column
                      </button>
                      <button
                        onClick={() =>
                          selectedProject &&
                          confirmDeleteProject(selectedProject)
                        }
                        className="rounded-md border px-2 py-1 text-sm text-rose-700 hover:bg-rose-50"
                        title="Delete this project"
                      >
                        Delete Project
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-xl text-gray-600">
                  Loading board...
                </div>
              ) : !selectedProject ? (
                <EmptyState
                  title="Create your first project"
                  description={
                    <>
                      Create a project in the left sidebar. We’ll add default
                      columns (<em>To Do</em>, <em>In Progress</em>,{" "}
                      <em>Validation</em>, <em>Done</em>).
                    </>
                  }
                  bullets={[
                    "Projects live in the left panel.",
                    "Click a project to open its board.",
                    "Use “Add Column” to customize the workflow.",
                  ]}
                />
              ) : (
                <div className="flex-1 min-h-0 flex flex-col">
                  {/* Tabs bar */}
                  <div className="bg-white border-b sticky top-0 z-10">
                    <div className="mx-auto w-full max-w-7xl flex items-center gap-3 py-2">
                      <button
                        aria-label="Scroll left"
                        onClick={() => scrollColumnsBy(-320)}
                        className={`${columns.length > 1 ? "flex" : "hidden"} h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white hover:bg-gray-50`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 15.707a1 1 0 010-1.414L8.414 10l3.879-4.293a1 1 0 10-1.586-1.414l-5 5a1 1 0 000 1.414l5 5a1 1 0 001.586-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <div className="relative flex-1 overflow-hidden">
                        <div className="flex gap-2 overflow-x-auto tabs-scrollbar">
                          {columns.map((c) => (
                            <button
                              key={`tab-${c.id}`}
                              onClick={() => scrollToColumn(c.id)}
                              className="px-3 py-1.5 rounded-full text-sm border bg-gray-50 hover:bg-white hover:shadow-sm whitespace-nowrap"
                            >
                              {c.title}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        aria-label="Scroll right"
                        onClick={() => scrollColumnsBy(320)}
                        className={`${columns.length > 1 ? "flex" : "hidden"} h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white hover:bg-gray-50`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.707 4.293a1 1 0 010 1.414L11.586 10l-3.879 4.293a1 1 0 101.586 1.414l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.586 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Columns rail */}
                  <div className="flex-1 min-h-0">
                    <div
                      ref={columnsRef}
                      className="mx-auto w-full max-w-7xl h-full px-4 py-2 overflow-x-auto overflow-y-visible board-scrollbar"
                    >
                      <div className="flex flex-row gap-2 pb-6">
                        {columns.map((column) => (
                          <div
                            key={`wrap-${column.id}`}
                            ref={setColumnRef(column.id)}
                            className="min-w-[320px] max-w-[360px]"
                          >
                            <Column
                              id={column.id}
                              title={column.title}
                              tasks={tasks.filter(
                                (t) =>
                                  selectedProject &&
                                  t.project === selectedProject.id
                              )}
                              onAddTask={handleAddTask}
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              onDragStart={handleDragStart}
                              onEditTask={handleEditTask}
                              onConfirmDeleteTask={confirmDeleteTask}
                              onConfirmDeleteColumn={confirmDeleteColumn}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={editingTask && editingTask.id ? "Edit Story" : "New Story"}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <TaskForm
          task={
            editingTask || {
              id: `temp-${Date.now()}`,
              title: "",
              description: "",
              assignee: "",
              priority: "Low",
              architecture: "FE",
              project: selectedProject?.id || "",
              status: "to_do",
            }
          }
          onSave={handleSaveTask}
          onCancel={() => setIsTaskModalOpen(false)}
          // ▼ NEW: feed features for the currently selected project
          features={
            selectedProject
              ? featuresByProject(selectedProject.id).map((f) => ({
                  id: f.id,
                  name: f.name,
                }))
              : []
          }
          // (optional) preselect nothing; or set to a feature id you want as default
          initialFeatureId={undefined}
        />
      </Modal>

      <Modal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        title="Add Column"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <AddColumnModal
          onSave={handleAddColumn}
          onCancel={() => setIsColumnModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteTaskModalOpen}
        onClose={() => setIsDeleteTaskModalOpen(false)}
        title="Confirm Delete"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <p className="text-gray-700">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-between space-x-4 mt-6">
          <button
            onClick={() => setIsDeleteTaskModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteTask}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteColumnModalOpen}
        onClose={() => setIsDeleteColumnModalOpen(false)}
        title="Confirm Delete"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <p className="text-gray-700">
          Are you sure you want to delete this column and all its tasks? This
          action cannot be undone.
        </p>
        <div className="flex justify-between space-x-4 mt-6">
          <button
            onClick={() => setIsDeleteColumnModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteColumn}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isProjectDeleteModalOpen}
        onClose={() => setIsProjectDeleteModalOpen(false)}
        title="Confirm Delete Project"
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <p className="text-gray-700">
          Are you sure you want to delete the project "{projectToDelete?.name}"?
          This will permanently delete all associated tasks.
        </p>
        <div className="flex justify-between space-x-4 mt-6">
          <button
            onClick={() => setIsProjectDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteProject}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
