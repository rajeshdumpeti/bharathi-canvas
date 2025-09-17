import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { storage, HUB_NS } from "../../packages/storage";
import type {
  HubProject,
  ProjectHubContextValue,
} from "../../types/project-hub";

const LIST_KEY = "projects"; // NOT "hub:projects" (ns already applied)
const SELECTED_KEY = "selectedProjectId";

function loadProjects(): HubProject[] {
  return storage.get<HubProject[]>(HUB_NS, LIST_KEY, []);
}
function persistProjects(list: HubProject[]) {
  storage.set(HUB_NS, LIST_KEY, list);
}

export const ProjectHubContext = createContext<
  ProjectHubContextValue | undefined
>(undefined);
export const useProjectHubContext = () => useContext(ProjectHubContext);

export function ProjectHubProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [projects, setProjects] = useState<HubProject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const refresh = () => setProjects(loadProjects());

  useEffect(() => {
    refresh();
    setSelectedId(storage.get<string | null>(HUB_NS, SELECTED_KEY, null));
  }, []);

  useEffect(() => {
    if (selectedId) storage.set(HUB_NS, SELECTED_KEY, selectedId);
    else storage.remove(HUB_NS, SELECTED_KEY);
  }, [selectedId]);

  const selected = useMemo<HubProject | null>(
    () => projects.find((p) => p.id === selectedId) || null,
    [projects, selectedId]
  );

  const selectProject = (id: string | null) => setSelectedId(id);

  const addProject = (name: string): HubProject | null => {
    const n = (name || "").trim();
    if (!n) return null;

    // de-dup by case-insensitive name
    if (projects.some((p) => p.name.toLowerCase() === n.toLowerCase()))
      return null;

    const id = `${n.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const proj: HubProject = { id, name: n, sections: {} };
    const next = [...projects, proj];

    setProjects(next);
    persistProjects(next);
    setSelectedId(id);
    return proj;
  };

  // Hub-only delete (does NOT touch Board data)
  const deleteProject = (id: string) => {
    const next = projects.filter((p) => p.id !== id);
    setProjects(next);
    persistProjects(next);
    if (selectedId === id) setSelectedId(null);
  };

  const updateSection = (sectionKey: string, data: unknown) => {
    if (!selectedId) return;
    const next = projects.map((p) =>
      p.id !== selectedId
        ? p
        : { ...p, sections: { ...(p.sections || {}), [sectionKey]: data } }
    );
    setProjects(next);
    persistProjects(next);
  };

  const value: ProjectHubContextValue = {
    projects,
    selected,
    selectedId,
    setSelectedId,
    selectProject,
    addProject,
    deleteProject,
    updateSection,
    refresh,
  };

  return (
    <ProjectHubContext.Provider value={value}>
      {children}
    </ProjectHubContext.Provider>
  );
}

export default function useProjectHub(): ProjectHubContextValue {
  const ctx = useProjectHubContext();
  if (!ctx)
    throw new Error("useProjectHub must be used within ProjectHubProvider");
  return ctx;
}
