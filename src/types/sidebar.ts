import { Task, Project } from "./board";
export interface SidebarProps {
  projects: Project[];
  selectedProject: Project | null;

  onSelectProject: (project: Project) => void;
  onAddProject: (name: string) => void;

  isSidebarOpen: boolean; // kept for parity (used by parent)
  onToggleSidebar: () => void;

  tasks: Task[];
  onConfirmDeleteProject: (project: Project) => void;

  onOpenDocuments?: () => void; // optional, not used right now
}
