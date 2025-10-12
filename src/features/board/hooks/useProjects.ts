// src/features/board/hooks/useProjects.ts
import { useState } from "react";
import { useProjectStore } from "stores/projectStore";
import type { Project } from "types/board";

export function useProjects() {
  const {
    projects,
    selectedProjectId,
    loadProjects,
    selectProject,
    removeProjectLocal,
    setColumns,
  } = useProjectStore();

  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const selectedProject: Project | undefined = projects.find(
    (p) => p.id === selectedProjectId
  );

  const confirmDeleteProject = (project: Project) => {
    setProjectToDelete(project);
  };

  const handleDeleteProject = () => {
    if (!projectToDelete) return;
    removeProjectLocal(projectToDelete.id);
    setProjectToDelete(null);
  };

  const updateProjectColumns = async (
    projectId: string,
    columns: any[]
  ): Promise<void> => {
    setColumns(projectId, columns);
  };

  return {
    projects,
    selectedProject,
    selectedProjectId,
    projectToDelete,
    confirmDeleteProject,
    handleDeleteProject,
    loadProjects,
    selectProject,
    updateProjectColumns,
  };
}
