import { useEffect } from "react";
import { useDocsStore } from "stores/docs.store";
import { useProjectStore } from "stores/projectStore";
import { useSearchParams } from "react-router-dom";

/**
 * Hook to manage document lifecycle within a project.
 * It automatically fetches and exposes upload/delete actions.
 */
export function useDocuments() {
  const [search] = useSearchParams();
  const paramProjectId = search.get("project") || null;

  // 💾 project store
  const { projects, selectedProjectId, loadProjects, selectProject } =
    useProjectStore();

  // 📄 docs store
  const {
    items,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    selectedId,
    setSelected,
  } = useDocsStore();

  // Ensure projects are loaded (idempotent if already loaded)
  useEffect(() => {
    if (!projects || projects.length === 0) {
      loadProjects();
    }
  }, [projects.length, loadProjects, projects]);

  // If route has a projectId, keep store in sync with it
  useEffect(() => {
    if (paramProjectId && paramProjectId !== selectedProjectId) {
      selectProject(paramProjectId);
    }
  }, [paramProjectId, selectedProjectId, selectProject]);

  // Effective project id to use for document calls
  const effectiveProjectId = paramProjectId || selectedProjectId || null;

  // Fetch documents whenever the effective project changes
  useEffect(() => {
    if (effectiveProjectId) {
      fetchDocuments(effectiveProjectId);
    }
  }, [effectiveProjectId, fetchDocuments]);

  return {
    projectId: effectiveProjectId,
    projects,
    items,
    loading,
    error,
    selectedId,
    setSelected,
    uploadDocument,
    deleteDocument,
    refresh: () => effectiveProjectId && fetchDocuments(effectiveProjectId),
  };
}
