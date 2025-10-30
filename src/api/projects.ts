// src/api/projects.ts
import { api } from "lib/api";
import type { Project } from "types/board";

// get current user from localStorage/session
const getUserId = () => localStorage.getItem("user_id");

export async function fetchProjects(): Promise<Project[]> {
  const userId = getUserId();
  const res = await api.get(`/projects`, { params: { user_id: userId } });
  return res.data;
}

// export async function fetchProjects(): Promise<Project[]> {
//   const res = await api.get("/projects");
//   return res.data;
// }

export async function createProject(name: string): Promise<Project> {
  const res = await api.post("/projects", { name });
  return res.data;
}

export async function deleteProject(projectId: string): Promise<void> {
  await api.delete(`/projects/${projectId}`);
}

export async function updateProjectColumns(
  projectId: string,
  columns: any[]
): Promise<Project> {
  const res = await api.patch(`/projects/${projectId}/columns`, { columns });
  return res.data;
}
