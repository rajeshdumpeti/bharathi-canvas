import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listHubSections,
  saveHubSection,
  deleteHubSection,
  getHubSection,
} from "api/projectHub";

export default function useProjectHub(projectId?: string) {
  const queryClient = useQueryClient();

  /** -------------------------------
   * Fetch all sections for a project
   * ------------------------------- */
  const {
    data: sections = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["hubSections", projectId],
    queryFn: () => {
      if (!projectId) return Promise.resolve([]);
      return listHubSections(projectId);
    },
    enabled: !!projectId,
    staleTime: 1000 * 60 * 3, // 3 mins cache
  });

  /** -------------------------------
   * Create or update a section
   * ------------------------------- */
  const mutationSave = useMutation({
    mutationFn: (payload: any) => {
      if (!projectId) throw new Error("No project selected");
      return saveHubSection(projectId, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubSections", projectId] });
    },
  });

  /** -------------------------------
   * Delete a section by type
   * ------------------------------- */
  const mutationDelete = useMutation({
    mutationFn: (sectionType: string) => {
      if (!projectId) throw new Error("No project selected");
      return deleteHubSection(projectId, sectionType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubSections", projectId] });
    },
  });

  /** -------------------------------
   * Get one section on-demand
   * ------------------------------- */
  const fetchOne = async (sectionType: string) => {
    if (!projectId) throw new Error("No project selected");
    return getHubSection(projectId, sectionType);
  };

  /** -------------------------------
   * Return all helpers
   * ------------------------------- */
  return {
    sections,
    isLoading,
    isError,
    refetch,
    saveSection: async (payload: any) => {
      await mutationSave.mutateAsync(payload);
    },
    deleteSection: async (sectionType: string) => {
      await mutationDelete.mutateAsync(sectionType);
    },
    getSection: fetchOne,
  };
}
