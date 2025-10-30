export type StatusId = "to_do" | "in_progress" | "validation" | "done";

export interface Project {
  id: string;
  name: string;
  columns: { id: string; title: string }[];
  sections?: Record<string, unknown>;
}

export interface Task {
  id: string;
  project: string;
  title: string;
  description?: string;
  assignee?: string;
  priority: "Low" | "Medium" | "High";
  architecture: "FE" | "BE" | "DB" | "ARCH" | "MISC";
  status: StatusId;
  createdAt?: string;
  dueDate?: string | null;
  completedAt?: string | null;
  storyId?: string;
  acceptanceCriteria?: string;
}

export interface DocItem {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  dataURL?: string | null;
  text?: string | null;
}

export interface Release {
  id: string;
  projectId: string;
  version: string;
  date: string;
  range: { from: string; to: string };
  grouping: string;
  notesMd: string;
  tasks: string[]; // task ids
}
