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
import {
  FiPlus,
  FiLayout,
  FiList,
  FiArrowLeft,
  FiArrowRight,
  FiFolder,
  FiTrello,
  FiSearch,
} from "react-icons/fi";

export default function BoardView() {
  const [columns, setColumns] = useState<BoardColumn[]>(DEFAULT_COLUMNS);
  const { loadProjects, setColumns: setProjectColumns } = useProjectStore();

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

  // Scroll helpers
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

  // Columns handlers
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

  // Calculate total tasks for stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="h-full w-full flex flex-col bg-gray-50 font-sans text-gray-800">
      <div className="flex-1 min-h-0 w-full">
        <div className="relative h-full w-full flex overflow-hidden">
          <main className="flex-1 min-w-0 h-full overflow-auto">
            <div className="h-full flex flex-col">
              {/* Header Section */}
              <div className="bg-white border-b shadow-sm">
                {selectedProject && (
                  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4">
                    {/* Top Row - Project Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FiTrello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <div>
                          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {selectedProject.name}
                          </h1>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            Kanban Board • {totalTasks} stories •{" "}
                            {completedTasks} completed
                          </p>
                        </div>
                      </div>

                      {/* Create Story Button - Top Right */}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          handleAddTask("to_do");
                          setIsTaskModalOpen(true);
                        }}
                        className="inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                      >
                        <FiPlus className="h-4 w-4" />
                        Create Story
                      </Button>
                    </div>

                    {/* Bottom Row - Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        to="stories"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex-1 sm:flex-none justify-center"
                      >
                        <FiSearch className="h-3 w-3 sm:h-4 sm:w-4" />
                        Story Lookup
                      </Link>

                      <button
                        onClick={() => setIsColumnModalOpen(true)}
                        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none justify-center ${
                          selectedProject
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <FiPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                        Add Column
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Main Content */}
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-lg text-gray-600">Loading your board...</p>
                </div>
              ) : !selectedProject ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <EmptyState
                    icon={<FiFolder className="h-16 w-16 text-gray-400" />}
                    title="No Project Selected"
                    description="Select a project from the sidebar or create a new one to start organizing your work."
                    bullets={[
                      "Projects help you organize work by team or initiative",
                      "Each project gets its own board with customizable columns",
                      "Drag and drop stories to track progress",
                    ]}
                  />
                </div>
              ) : (
                <div className="flex-1 min-h-0 flex flex-col">
                  {/* Columns Navigation */}
                  <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                    <div className="mx-auto w-full max-w-7xl px-6 py-3">
                      <div className="flex items-center gap-4">
                        <button
                          aria-label="Scroll left"
                          onClick={() => scrollColumnsBy(-320)}
                          className={`flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors ${
                            columns.length > 1 ? "flex" : "hidden"
                          }`}
                        >
                          <FiArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>

                        <div className="flex-1 overflow-hidden">
                          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                            {columns.map((column) => {
                              const columnTasks = tasks.filter(
                                (t) =>
                                  t.status ===
                                  toStatusId(column.id || column.title)
                              );
                              return (
                                <button
                                  key={`tab-${column.id}`}
                                  onClick={() => scrollToColumn(column.id)}
                                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors whitespace-nowrap min-w-0"
                                >
                                  <span className="font-medium text-gray-900 truncate">
                                    {column.title}
                                  </span>
                                  <span className="flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                    {columnTasks.length}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          aria-label="Scroll right"
                          onClick={() => scrollColumnsBy(320)}
                          className={`flex items-center justify-center h-10 w-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors ${
                            columns.length > 1 ? "flex" : "hidden"
                          }`}
                        >
                          <FiArrowRight className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Columns Container */}
                  <div className="flex-1 min-h-0 bg-gradient-to-br from-gray-50 to-blue-50/30">
                    <div
                      ref={columnsRef}
                      className="mx-auto w-full max-w-7xl h-full px-6 py-6 overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                    >
                      <div className="flex flex-row gap-6 pb-6 min-h-full">
                        {columns.map((column) => {
                          const statusId = toStatusId(
                            column.id || column.title
                          );
                          const columnTasks = tasks.filter(
                            (t) => t.status === statusId
                          );

                          return (
                            <div
                              key={`wrap-${column.id}`}
                              ref={setColumnRef(statusId)}
                              className="flex-shrink-0 w-80"
                            >
                              <Column
                                id={statusId}
                                title={column.title}
                                tasks={columnTasks}
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
          title={editingTask ? "Edit User Story" : "Create New User Story"}
          size="lg"
        >
          {featuresLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-gray-500">Loading features...</p>
            </div>
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
        title="Add New Column"
        size="md"
      >
        <AddColumnModal
          onSave={handleAddColumn}
          onCancel={() => setIsColumnModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modals */}
      <Modal
        isOpen={isDeleteTaskModalOpen}
        onClose={() => setIsDeleteTaskModalOpen(false)}
        title="Delete User Story"
        size="md"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiList className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Confirm Deletion
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this user story? This action cannot
            be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsDeleteTaskModalOpen(false)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteTask}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Story
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isDeleteColumnModalOpen}
        onClose={() => setIsDeleteColumnModalOpen(false)}
        title="Delete Column"
        size="md"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiLayout className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Column
          </h3>
          <p className="text-gray-600 mb-6">
            This will delete the column and all stories in it. This action
            cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsDeleteColumnModalOpen(false)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteColumn}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Column
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isProjectDeleteModalOpen}
        onClose={() => setIsProjectDeleteModalOpen(false)}
        title="Delete Project"
        size="md"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiFolder className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Project
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete project "{projectToDelete?.name}"?
            All stories and data will be lost.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsProjectDeleteModalOpen(false)}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProject}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Project
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
