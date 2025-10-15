import { api } from "lib/api";
import type { DocItem } from "types/documents";

const BASE = "/documents";
const getUserId = () => localStorage.getItem("user_id");

/**
 * Fetch all documents for a given project.
 * Backend: GET /api/v1/documents/project/{project_id}
 */
export async function listDocuments(projectId: string): Promise<DocItem[]> {
  const userId = getUserId();
  const { data } = await api.get(`${BASE}/project/${projectId}`, {
    params: { user_id: userId },
  });
  return data;
}

/**
 * Upload a document for a given project.
 * Backend: POST /api/v1/documents/upload?project_id=<PROJECT_UUID>
 */
export async function uploadDocument(
  projectId: string,
  file: File
): Promise<DocItem> {
  const userId = getUserId();

  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(`${BASE}/upload`, formData, {
    params: { project_id: projectId, user_id: userId },
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

/**
 * Delete a document by ID.
 * Backend: DELETE /api/v1/documents/{document_id}
 */
export async function deleteDocument(documentId: string): Promise<void> {
  await api.delete(`${BASE}/${documentId}`);
}
