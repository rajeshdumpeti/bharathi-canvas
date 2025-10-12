import { api } from "lib/api";
import type { Task } from "types/board";

const getUserId = () => localStorage.getItem("user_id");

export async function fetchTasksByProject(projectId: string): Promise<Task[]> {
  const userId = getUserId();
  const res = await api.get(`/tasks/project/${projectId}`, {
    params: { user_id: userId },
  });
  return res.data;
}

export async function createTask(payload: any): Promise<Task> {
  const userId = getUserId();
  const res = await api.post("/tasks", { ...payload, user_id: userId });
  return res.data;
}
export async function updateTaskStatus(taskId: string, status: string) {
  const res = await api.patch(`/tasks/${taskId}/status`, { status });
  return res.data;
}

export async function deleteTask(taskId: string) {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
}
