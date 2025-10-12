import { api } from "lib/api";

export async function fetchStoriesByFeature(featureId: string) {
  const res = await api.get(`/features/feature/${featureId}`);
  return res.data;
}
