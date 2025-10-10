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
