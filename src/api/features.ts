import { api } from "lib/api";
import type { Feature } from "types/boardFeatures";

const toCamel = (d: any): Feature => ({
  id: d.id,
  name: d.name,
  details: d.details,
  userStory: d.user_story,
  coreRequirements: d.core_requirements,
  acceptanceCriteria: d.acceptance_criteria,
  technicalNotes: d.technical_notes,
  projectId: d.project_id,
  userId: d.user_id,
  createdAt: d.created_at,
});

export async function fetchFeaturesByProject(
  projectId: string
): Promise<Feature[]> {
  const res = await api.get(`/features/project/${projectId}`);
  return res.data.map(toCamel);
}

export async function createFeature(payload: any): Promise<Feature> {
  const res = await api.post("/features", payload);
  return toCamel(res.data);
}

export async function updateFeature(
  featureId: string,
  payload: any
): Promise<Feature> {
  const res = await api.patch(`/features/${featureId}`, payload);
  return toCamel(res.data);
}

export async function deleteFeatureById(id: string): Promise<void> {
  await api.delete(`/features/${id}`);
}
