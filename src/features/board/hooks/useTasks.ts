// src/features/board/hooks/useTasks.ts
import { useTaskStore } from "stores/taskStore";
import { useProjectStore } from "stores/projectStore";
import { NormalizedStatus, toStatusId } from "utils/statusUtils";
import { syncTaskToStory, deleteStoryById } from "../features/storage";
import type { Task } from "types/board";
import { useState } from "react";

export function useTasks() {
  const { getSelectedProject } = useProjectStore();
  const {
    tasksByProject,
    createTask,
    updateTaskStatus,
    deleteTask,
    updateTask,
  } = useTaskStore();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  const selectedProject = getSelectedProject();
  const tasks = selectedProject ? tasksByProject[selectedProject.id] || [] : [];

  const handleAddTask = (columnId?: string | React.MouseEvent) => {
    if (!selectedProject) return;
    const isEvent = columnId && typeof columnId === "object";
    const status = isEvent ? "to_do" : (columnId as string) || "to_do";

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
  };

  const handleSaveTask = async (
    taskData: Partial<Task> & { featureId?: string }
  ) => {
    if (!selectedProject) return;
    try {
      const payload = {
        title: taskData.title || "",
        description: taskData.description || "",
        acceptance_criteria: taskData.acceptanceCriteria ?? null,
        priority: taskData.priority ?? null,
        status: toStatusId(taskData.status),
        assignee: taskData.assignee || "",
        project_id: selectedProject.id,
        feature_id: taskData.featureId || null,
      };
      const isEdit = taskData.id && !String(taskData.id).startsWith("temp-");
      const created = isEdit
        ? await updateTask(taskData.id, selectedProject.id, payload) // ✅ update existing task
        : await createTask(selectedProject.id, payload); // ✅ crea

      const normalizedStatus = toStatusId(created.status) as NormalizedStatus;
      if (taskData.featureId) {
        syncTaskToStory(
          {
            id: created.id,
            project: created.project!,
            storyId: created.storyId,
            title: created.title,
            status: normalizedStatus, // 👈 strictly typed
            assignee: created.assignee,
            priority: created.priority ?? "Low",
            createdAt: created.createdAt,
            completedAt: created.completedAt ?? null,
            acceptanceCriteria: created.acceptanceCriteria ?? "",
          },
          taskData.featureId
        );
      }
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to create task", err);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDeleteId || !selectedProject) return;
    try {
      await deleteTask(taskToDeleteId, selectedProject.id);
      const doomed = tasks.find((t) => t.id === taskToDeleteId);
      if (doomed?.storyId) deleteStoryById(doomed.storyId);
      setTaskToDeleteId(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Error deleting task");
    }
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newColumnId: string
  ) => {
    e.preventDefault();
    if (!selectedProject) return;

    const taskId = e.dataTransfer.getData("taskId");
    await updateTaskStatus(taskId, toStatusId(newColumnId), selectedProject.id);
  };

  const confirmDeleteTask = (taskId: string) => setTaskToDeleteId(taskId);

  return {
    tasks,
    editingTask,
    setEditingTask,
    handleAddTask,
    handleSaveTask,
    handleDeleteTask,
    confirmDeleteTask,
    handleDrop,
  };
}
