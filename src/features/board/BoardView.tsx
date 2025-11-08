// src/features/board/BoardView.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, EmptyState } from "packages/ui";
import Column from "./components/Column";
import TaskForm from "./components/TaskForm";
import AddColumnModal from "./components/AddColumnModal";
import type { BoardColumn } from "types/board";
import { useProjectStore, DEFAULT_COLUMNS } from "stores/projectStore";
import { useSyncProjectParam } from "hooks/useSyncProjectParam";
import { useBoardActions } from "./hooks/useBoardActions";
import { toStatusId } from "utils/statusUtils";
import { normalizeColumns } from "utils/columns";
import { useQuery } from "@tanstack/react-query";
import { fetchFeaturesByProject } from "api/features";
import { Button } from "components/ui/index";

export default function BoardView() {
  const [columns, setColumns] = useState<BoardColumn[]>(DEFAULT_COLUMNS);
  const { loadProjects, setColumns: setProjectColumns } = useProjectStore();

  // ✅ Correct destructuring from unified hook
  const {
    selectedProject,
    tasks,
    handleAddTask,
    handleSaveTask,
    handleDeleteTask,
    handleDrop,
    confirmDeleteTask,
    setEditingTask,
    editingTask,
    projectToDelete,
    handleDeleteProject,
  } = useBoardActions();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isDeleteColumnModalOpen, setIsDeleteColumnModalOpen] = useState(false);
  const [isProjectDeleteModalOpen, setIsProjectDeleteModalOpen] =
    useState(false);
  const [columnToDeleteId, setColumnToDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // scroll helpers
  const columnsRef = useRef<HTMLDivElement | null>(null);
  const columnRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const setColumnRef = (id: string) => (el: HTMLDivElement | null) => {
    columnRefs.current[id] = el;
  };
  const scrollColumnsBy = (delta: number) =>
    columnsRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  const scrollToColumn = (colId: string) => {
    const el = columnRefs.current[colId];
    if (el && columnsRef.current)
      columnsRef.current.scrollTo({
        left: el.offsetLeft - 16,
        behavior: "smooth",
      });
  };

  // Sync project param (URL ↔ state)
  useSyncProjectParam();

  // Load projects
  useEffect(() => {
    loadProjects().finally(() => setIsLoading(false));
  }, [loadProjects]);

  // Sync columns when project changes

  useEffect(() => {
    if (!selectedProject) {
      setColumns(DEFAULT_COLUMNS);
      return;
    }
    const normalized = normalizeColumns(selectedProject.columns);
    setColumns(normalized);
  }, [selectedProject]);

  // ---------- Columns ----------
  const confirmDeleteColumn = (columnId: string) => {
    setColumnToDeleteId(columnId);
    setIsDeleteColumnModalOpen(true);
  };

  const handleDeleteColumn = () => {
    if (!selectedProject || !columnToDeleteId) return;
    const updatedCols = columns.filter((c) => c.id !== columnToDeleteId);
    setColumns(updatedCols);
    setProjectColumns(selectedProject.id, updatedCols);
    setIsDeleteColumnModalOpen(false);
  };

  const handleAddColumn = (newTitle: string) => {
    if (!newTitle || !selectedProject) return;
    const newColumns = [
      ...columns,
      { id: newTitle.toLowerCase().replace(/\s+/g, "-"), title: newTitle },
    ];
    setColumns(newColumns);
    setProjectColumns(selectedProject.id, newColumns);
    setIsColumnModalOpen(false);
  };

  const { data: features = [], isLoading: featuresLoading } = useQuery({
    queryKey: ["features", selectedProject?.id],
    queryFn: () => fetchFeaturesByProject(selectedProject!.id),
    enabled: !!selectedProject?.id,
  });
  // ---------- Render ----------
  return (
    <div className="h-full w-full flex flex-col bg-gray-50 font-sans text-gray-800">
      <div className="flex-1 min-h-0 w-full">
        <div className="relative h-full w-full flex overflow-hidden">
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
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          handleAddTask("to_do");
                          setIsTaskModalOpen(true);
                        }}
                      >
                        Create Story
                      </Button>
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
                        onClick={() => setIsColumnModalOpen(true)}
                        className={`rounded-md border px-2 py-1 text-sm ${
                          selectedProject
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Add Column
                      </button>
                      {/* <button
                        onClick={() => {
                          confirmDeleteProject(selectedProject);
                          setIsProjectDeleteModalOpen(true);
                        }}
                        className="rounded-md border px-2 py-1 text-sm text-rose-700 hover:bg-rose-50"
                      >
                        Delete Project
                      </button> */}
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
                    "Use “Add Column” to customize workflow.",
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
                        className={`${
                          columns.length > 1 ? "flex" : "hidden"
                        } h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-gray-50`}
                      >
                        ←
                      </button>

                      <div className="relative flex-1 overflow-hidden">
                        <div className="flex gap-2 overflow-x-auto tabs-scrollbar">
                          {columns.map((c) => (
                            <button
                              key={`tab-${c.id}`}
                              onClick={() => scrollToColumn(c.id)}
                              className="px-3 py-1.5 rounded-full text-sm border bg-gray-50 hover:bg-white whitespace-nowrap"
                            >
                              {c.title}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        aria-label="Scroll right"
                        onClick={() => scrollColumnsBy(320)}
                        className={`${
                          columns.length > 1 ? "flex" : "hidden"
                        } h-8 w-8 items-center justify-center rounded-full border bg-white hover:bg-gray-50`}
                      >
                        →
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
                        {columns.map((column) => {
                          const statusId = toStatusId(
                            column.id || column.title
                          );
                          return (
                            <div
                              key={`wrap-${column.id}`}
                              ref={setColumnRef(statusId)}
                              className="min-w-[320px] max-w-[360px]"
                            >
                              <Column
                                id={statusId}
                                title={column.title}
                                tasks={tasks.filter(
                                  (t) => t.status === statusId
                                )}
                                onAddTask={(id) => {
                                  handleAddTask(id);
                                  setIsTaskModalOpen(true);
                                }}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onDragStart={(e, taskId) =>
                                  e.dataTransfer.setData("taskId", taskId)
                                }
                                onEditTask={(task) => {
                                  setEditingTask(task);
                                  setIsTaskModalOpen(true);
                                }}
                                onConfirmDeleteTask={(id) => {
                                  confirmDeleteTask(id);
                                  setIsDeleteTaskModalOpen(true);
                                }}
                                onConfirmDeleteColumn={confirmDeleteColumn}
                              />
                            </div>
                          );
                        })}
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

      {isTaskModalOpen && (
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title={editingTask ? "Edit Task" : "Create Task"}
        >
          {featuresLoading ? (
            <p className="text-center text-gray-500 py-10">Loading features…</p>
          ) : (
            <TaskForm
              task={
                editingTask || {
                  id: `temp-${Date.now()}`,
                  title: "",
                  description: "",
                  acceptanceCriteria: "",
                  assignee: "",
                  priority: "Low",
                  architecture: "FE",
                  project: selectedProject?.id || "",
                  status: "to_do",
                  featureId: "",
                }
              }
              onSave={(task) => {
                handleSaveTask(task);
                setIsTaskModalOpen(false);
              }}
              onCancel={() => setIsTaskModalOpen(false)}
              features={features.map((f) => ({
                id: f.id,
                name: f.name,
              }))}
            />
          )}
        </Modal>
      )}

      <Modal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        title="Add Column"
      >
        <AddColumnModal
          onSave={handleAddColumn}
          onCancel={() => setIsColumnModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isDeleteTaskModalOpen}
        onClose={() => setIsDeleteTaskModalOpen(false)}
        title="Confirm Delete Task"
      >
        <p className="text-gray-700">
          Are you sure you want to delete this task?
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsDeleteTaskModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
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
        title="Confirm Delete Column"
      >
        <p className="text-gray-700">
          Delete this column and all its tasks? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsDeleteColumnModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
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
      >
        <p className="text-gray-700">
          Are you sure you want to delete project "{projectToDelete?.name}"?
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsProjectDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
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
