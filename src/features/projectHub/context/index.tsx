import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import useProjectHub from "../hooks/useProjectHub";
import { useProjectStore } from "stores/projectStore";

export interface ProjectHubContextType {
  projectId: string | null;
  sections: any[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  saveSection: (payload: any) => Promise<void>;
  deleteSection?: (sectionType: string) => Promise<void>;
  getSection: (sectionType: string) => Promise<any>;
}

// ✅ initialize with undefined for safety
const ProjectHubContext = createContext<ProjectHubContextType | undefined>(
  undefined
);

export const ProjectHubProvider = ({ children }: { children: ReactNode }) => {
  const { selectedProjectId } = useProjectStore();
  const {
    sections,
    isLoading,
    isError,
    refetch,
    saveSection,
    deleteSection,
    getSection,
  } = useProjectHub(selectedProjectId || undefined);

  useEffect(() => {
    if (selectedProjectId) {
      refetch();
    }
  }, [selectedProjectId, refetch]);

  // ✅ make sure all required properties are included
  const value: ProjectHubContextType = useMemo(
    () => ({
      projectId: selectedProjectId ?? null,
      sections,
      isLoading,
      isError,
      refetch,
      saveSection,
      deleteSection,
      getSection,
    }),
    [
      selectedProjectId,
      sections,
      isLoading,
      isError,
      refetch,
      saveSection,
      deleteSection,
      getSection,
    ]
  );

  return (
    <ProjectHubContext.Provider value={value}>
      {children}
    </ProjectHubContext.Provider>
  );
};

// ✅ Safe hook
export const useProjectHubContext = (): ProjectHubContextType => {
  const ctx = useContext(ProjectHubContext);
  if (!ctx) {
    throw new Error(
      "useProjectHubContext must be used within ProjectHubProvider"
    );
  }
  return ctx;
};
