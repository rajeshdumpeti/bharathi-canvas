export type SectionKey =
  | "setup"
  | "architecture"
  | "database"
  | "links"
  | "deploymentGuide"
  | "pocs"
  | "screenshots"
  | "revenue"
  | "value"
  | "maintenance"
  | "demand"
  | "tech"
  | "releases"
  | "ux";

export type SectionDef = {
  key: SectionKey;
  title: string;
  comp: React.ComponentType; // current sections do not accept props
};

export type UseProjectHubShape = {
  selected: HubProject | null;
  deleteProject: (id: string) => void;
};

export type HubProject = {
  id: string;
  name: string;
  /** Hub-only data bag per section */
  sections: Record<string, unknown>;
};

export type ProjectHubContextValue = {
  projects: HubProject[];
  selected: HubProject | null;
  selectedId: string | null;

  setSelectedId: (id: string | null) => void;
  selectProject: (id: string | null) => void;

  addProject: (name: string) => HubProject | null;
  deleteProject: (id: string) => void;
  updateSection: (sectionKey: string, data: unknown) => void;

  refresh: () => void;
};

export type ProjectHubSection = {
  id: string;
  project_id: string;
  section_type: string;
  content: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
};
