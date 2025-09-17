export type Id = string;

export type BoardProject = {
  id: Id;
  name: string;
  // columns etc. may exist on the board side; we don’t rely on them here
  [k: string]: unknown;
};

export type BoardTask = {
  id: Id;
  title?: string;
  status?: "to-do" | "in-progress" | "validation" | "done" | string;
  project?: Id;
  completedAt?: string | null; // ISO
  priority?: "Low" | "Medium" | "High" | string;
  labels?: string[];
  // allow any extra fields the board may carry
  [k: string]: unknown;
};

export type ReleaseRecord = {
  id: Id;
  projectId: Id;
  version: string;
  date: string; // ISO when the release was created/saved
  range: { from: string; to: string }; // yyyy-mm-dd for UI
  filters: Record<string, unknown>;
  grouping: Grouping;
  notesMd: string;
  tasks: Id[]; // ids of included tasks
};

export type Grouping = "type" | "label";
