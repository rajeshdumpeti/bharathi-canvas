import { api } from "lib/api";
import { Task } from "types/board";

export async function fetchTasksByProject(projectId: string): Promise<Task[]> {
  const { data } = await api.get(`/tasks/project/${projectId}`);
  return (data || []).map((t: any) => ({
    id: t.id,
    project: t.project_id, // normalize
    status: String(t.status).replace("-", "_"), // ensure underscores
    title: t.title,
    description: t.description ?? "",
    acceptanceCriteria: t.acceptance_criteria ?? "",
    assignee: t.assignee ?? "",
    priority: t.priority ?? "Low",
    architecture: t.architecture ?? "FE",
    storyId: t.story_id ?? undefined,
    createdAt: t.created_at ?? undefined,
    dueDate: t.due_date ?? undefined,
    completedAt: t.completed_at ?? null,
  }));
}

export async function createTask(payload: {
  title: string;
  description?: string;
  status: string; // expect underscores: "to_do" | "in_progress" | ...
  assignee?: string;
  project_id: string;
}) {
  const { data } = await api.post("/tasks", payload);
  // normalize response for board UI
  const normalized: Task = {
    ...data,
    status: String(data.status).replace("-", "_"),
    project: data.project_id,
  };
  return normalized;
}

// src/api/tasks.ts
export async function updateTaskStatus(taskId: string, newStatus: string) {
  const payload = { status: newStatus }; // backend expects hyphen format
  const { data } = await api.patch(`/tasks/${taskId}`, payload);
  return {
    ...data,
    status: String(data.status),
    project: data.project_id,
  };
}
