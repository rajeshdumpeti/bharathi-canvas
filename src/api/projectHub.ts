import { api } from "lib/api";
import type { ProjectHubSection } from "types/project-hub";

const BASE = "/projects";
const getUserId = () => localStorage.getItem("user_id");

/**
 * Fetch all Hub sections for a given project.
 * Backend: GET /api/v1/projects/{project_id}/hub
 */
export async function listHubSections(
  projectId: string
): Promise<ProjectHubSection[]> {
  const userId = getUserId();
  const { data } = await api.get(`${BASE}/${projectId}/hub`, {
    params: { user_id: userId },
  });
  return data;
}

/**
 * Fetch a specific Hub section.
 * Backend: GET /api/v1/projects/{project_id}/hub/{section_type}
 */
export async function getHubSection(
  projectId: string,
  sectionType: string
): Promise<ProjectHubSection> {
  const userId = getUserId();
  const { data } = await api.get(`${BASE}/${projectId}/hub/${sectionType}`, {
    params: { user_id: userId },
  });
  return data;
}

/**
 * Create or update a Hub section.
 * Backend: POST /api/v1/projects/{project_id}/hub
 */
export async function saveHubSection(
  projectId: string,
  payload: Partial<ProjectHubSection>
): Promise<ProjectHubSection> {
  const userId = getUserId();
  const { data } = await api.post(`${BASE}/${projectId}/hub`, payload, {
    params: { user_id: userId },
  });
  return data;
}

/**
 * Delete a Hub section by type.
 * Backend: DELETE /api/v1/projects/{project_id}/hub/{section_type}
 */
export async function deleteHubSection(
  projectId: string,
  sectionType: string
): Promise<void> {
  const userId = getUserId();
  await api.delete(`${BASE}/${projectId}/hub/${sectionType}`, {
    params: { user_id: userId },
  });
}
