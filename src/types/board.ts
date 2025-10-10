// src/types/board.ts
export type Status = "to_do" | "in_progress" | "validation" | "done";

export type Priority = "High" | "Medium" | "Low";
export type Tech = "FE" | "BE" | "DB" | "ARCH" | "MISC";

export interface BoardColumn {
  id: Status | string; // allow custom columns you add later
  title: string;
}

export interface Project {
  id: string;
  name: string;
  columns: BoardColumn[];
}

export interface Task {
  id: string;
  project: string; // project id
  status: Status | string;

  title: string;
  description?: string;
  acceptanceCriteria?: string;

  assignee?: string;
  priority: Priority;
  architecture: Tech;

  storyId?: string; // e.g., "US234567"
  createdAt?: string; // ISO date
  dueDate?: string; // ISO date
  completedAt?: string | null;
}

export interface ColumnProps {
  title: string;
  id: string; // column id
  tasks: Task[];

  onAddTask: (columnId: string) => void;

  onDrop: (e: React.DragEvent<HTMLDivElement>, newColumnId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;

  onEditTask: (task: Task) => void;
  onConfirmDeleteTask: (taskId: string) => void;
  onConfirmDeleteColumn: (columnId: string) => void;
}
