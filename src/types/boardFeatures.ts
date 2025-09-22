// Strong, UI-friendly types for the Feature → Story → Bug hierarchy

export type FeatureId = string;
export type StoryId = string;
export type BugId = string;

export type StoryStatus = "To Do" | "In Progress" | "Validation" | "Done";
export type Priority = "Low" | "Medium" | "High" | "Critical";
export type BugSeverity = "Minor" | "Major" | "Critical";

export interface Feature {
  id: FeatureId;
  name: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
  projectId?: string;
}

export interface Story {
  id: StoryId;
  featureId: FeatureId;
  title: string;
  description?: string;
  status: StoryStatus;
  assignees?: string[];
  points?: number | null;
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
}

export interface Bug {
  id: BugId;
  storyId: StoryId;
  title: string;
  repro?: string;
  severity: BugSeverity;
  priority: Priority;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
}

// Dashboard rollups
export interface FeatureSummary {
  feature: Feature;
  stories: Story[];
  bugCountsByStory: Record<StoryId, number>;
}
