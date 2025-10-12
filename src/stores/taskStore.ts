import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Task } from "types/board";
import {
  fetchTasksByProject,
  createTask as apiCreateTask,
  updateTaskStatus as apiUpdateTaskStatus,
  deleteTask as apiDeleteTask,
  updateTask as apiUpdateTask,
} from "api/tasks";

interface TaskState {
  tasksByProject: Record<string, Task[]>; // key: projectId
  isLoading: boolean;
  error: string | null;

  // actions
  loadTasks: (projectId: string) => Promise<void>;
  createTask: (projectId: string, payload: any) => Promise<Task | null>;
  updateTask: (
    taskId: string,
    projectId: string,
    patch: Partial<Task>
  ) => Promise<Task | null>;
  updateTaskStatus: (
    taskId: string,
    newStatus: string,
    projectId: string
  ) => Promise<void>;
  deleteTask: (taskId: string, projectId: string) => Promise<void>;
  clearTasks: (projectId?: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasksByProject: {},
      isLoading: false,
      error: null,

      // Load tasks for a project
      loadTasks: async (projectId: string) => {
        set({ isLoading: true, error: null });
        try {
          const tasks = await fetchTasksByProject(projectId);
          set((state) => ({
            tasksByProject: { ...state.tasksByProject, [projectId]: tasks },
            isLoading: false,
          }));
        } catch (err: any) {
          console.error("Failed to load tasks:", err);
          set({
            error: err.message || "Failed to load tasks",
            isLoading: false,
          });
        }
      },

      // Create a new task
      createTask: async (projectId: string, payload: any) => {
        try {
          const created = await apiCreateTask(payload);
          set((state) => {
            const projectTasks = state.tasksByProject[projectId] || [];
            return {
              tasksByProject: {
                ...state.tasksByProject,
                [projectId]: [...projectTasks, created],
              },
            };
          });
          return created;
        } catch (err) {
          console.error("Failed to create task:", err);
          return null;
        }
      },

      // 👇 NEW: updateTask (full/partial update)
      updateTask: async (taskId, projectId, patch) => {
        try {
          const updated = await apiUpdateTask(taskId, patch);
          set((s) => ({
            tasksByProject: {
              ...s.tasksByProject,
              [projectId]: (s.tasksByProject[projectId] || []).map((t) =>
                t.id === taskId ? { ...t, ...updated } : t
              ),
            },
          }));
          return updated;
        } catch (err) {
          set({ error: "Failed to update task" });
          return null;
        }
      },

      // Update task status (drag & drop)
      updateTaskStatus: async (
        taskId: string,
        newStatus: string,
        projectId: string
      ) => {
        try {
          await apiUpdateTaskStatus(taskId, newStatus);
          set((state) => {
            const updatedTasks = (state.tasksByProject[projectId] || []).map(
              (t) => (t.id === taskId ? { ...t, status: newStatus } : t)
            );
            return {
              tasksByProject: {
                ...state.tasksByProject,
                [projectId]: updatedTasks,
              },
            };
          });
        } catch (err) {
          console.error("Failed to update task status:", err);
        }
      },

      // Delete task
      deleteTask: async (taskId: string, projectId: string) => {
        try {
          await apiDeleteTask(taskId);
          set((state) => ({
            tasksByProject: {
              ...state.tasksByProject,
              [projectId]: (state.tasksByProject[projectId] || []).filter(
                (t) => t.id !== taskId
              ),
            },
          }));
        } catch (err) {
          console.error("Failed to delete task:", err);
        }
      },

      // Clear all tasks or just one project’s tasks
      clearTasks: (projectId?: string) => {
        set((state) => {
          if (!projectId) return { tasksByProject: {} };
          const updated = { ...state.tasksByProject };
          delete updated[projectId];
          return { tasksByProject: updated };
        });
      },
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
