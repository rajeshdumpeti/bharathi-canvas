// src/features/board/BoardView.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Modal, EmptyState } from "packages/ui";
import { storage, BOARD_NS } from "packages/storage";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";
import AddColumnModal from "./components/AddColumnModal";
import { ensureBacklogFeature, syncTaskToStory } from "./features/storage";

import type { BoardColumn, Project, Task } from "types/board";

const DEFAULT_COLS: BoardColumn[] = [
  { id: "to-do", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
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

  // ---------- load once ----------
  useEffect(() => {
    setIsLoading(true);
    try {
      const savedProjects = storage.get<Project[]>(BOARD_NS, "projects", []);
      const savedTasks = storage.get<Task[]>(BOARD_NS, "tasks", []);

      // normalize statuses
      const ok = new Set(["to-do", "in-progress", "validation", "done"]);
      const fixed = (savedTasks || []).map((t) => ({
        ...t,
        status: ok.has(String(t.status))
          ? (t.status as Task["status"])
          : "to-do",
      }));

      setProjects(savedProjects);
      setTasks(fixed);
      if (JSON.stringify(savedTasks) !== JSON.stringify(fixed)) {
        storage.set(BOARD_NS, "tasks", fixed);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---------- react to sidebar/storage changes ----------
  useEffect(() => {
    const sync = () => {
      const latestProjects = storage.get<Project[]>(BOARD_NS, "projects", []);
      const latestTasks = storage.get<Task[]>(BOARD_NS, "tasks", []);
      setProjects(latestProjects);
      setTasks(latestTasks);
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
    setColumns(next?.columns || []);

    if (next) {
      storage.set(BOARD_NS, "selectedProjectId", next.id);
    } else {
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
        status: newColumnId as Task["status"],
        completedAt: willBeDone && !wasDone ? nowISO : (t.completedAt ?? null),
      };
    });

    setTasks(updated);
    storage.set(BOARD_NS, "tasks", updated);
  };

  // ---------- tasks ----------
  type DraftTask = Partial<Task> & { id?: string };

  const handleAddTask = (columnId?: string | React.MouseEvent) => {
    if (!selectedProject) return;
    const isEventLike =
      columnId &&
      typeof columnId === "object" &&
      ("nativeEvent" in columnId || "target" in columnId);
    const status = isEventLike
      ? "to-do"
      : typeof columnId === "string"
        ? columnId
        : "to-do";

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

  const handleSaveTask = (taskData: DraftTask) => {
    if (!selectedProject) return;

    const isNew = !taskData.id || taskData.id.startsWith("temp-");
    const dataToSave: Task = {
      ...(taskData as Task),
      id: isNew ? `task-${Date.now()}` : (taskData.id as string),
      project: selectedProject.id,
      storyId:
        taskData.storyId ||
        (isNew ? nextStoryId(selectedProject.id) : taskData.storyId),
      acceptanceCriteria: taskData.acceptanceCriteria || "",
    };

    const updated = isNew
      ? [...tasks, dataToSave]
      : tasks.map((t) => (t.id === dataToSave.id ? { ...dataToSave } : t));

    setTasks(updated);
    storage.set(BOARD_NS, "tasks", updated);
    // ---- Bridge: mirror into Features ----

    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const confirmDeleteTask = (taskId: string) => {
    setTaskToDeleteId(taskId);
    setIsDeleteTaskModalOpen(true);
  };
  const handleDeleteTask = () => {
    if (!taskToDeleteId) return;
    const updated = tasks.filter((t) => t.id !== taskToDeleteId);
    setTasks(updated);
    storage.set(BOARD_NS, "tasks", updated);
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

  // Per-project Story ID sequence (starts at 234567)
  const nextStoryId = (projectId: string) => {
    const map = storage.get<Record<string, number>>(BOARD_NS, "storySeq", {});
    const current = Number(map[projectId] || 234567);
    const id = `US${current}`;
    map[projectId] = current + 1;
    storage.set(BOARD_NS, "storySeq", map);
    return id;
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
                        onClick={() => handleAddTask("to-do")}
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
              status: "to-do",
            }
          }
          onSave={handleSaveTask}
          onCancel={() => setIsTaskModalOpen(false)}
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
