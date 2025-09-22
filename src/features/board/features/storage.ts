import { storage, BOARD_NS } from "packages/storage";
import type {
  Feature,
  Story,
  Bug,
  FeatureId,
  StoryId,
  BugId,
  StoryStatus,
  FeatureSummary,
} from "types/boardFeatures";
// import { storage as _storage } from "packages/storage";

// ────────────────────────────────────────────────────────────
// Keys
const K_FEATURES = "features";
const K_STORIES = "stories";
const K_BUGS = "bugs";

// ---- Bridge: Board <-> Features -------------------------------------------

type BoardTask = {
  id: string;
  project: string;
  storyId?: string;
  title: string;
  status: "to-do" | "in-progress" | "validation" | "done";
  assignee?: string;
  priority?: "High" | "Medium" | "Low" | string;
  createdAt?: string;
  completedAt?: string | null;
  acceptanceCriteria?: string;
};

// status maps
const S2T: Record<
  "To Do" | "In Progress" | "Validation" | "Done",
  BoardTask["status"]
> = {
  "To Do": "to-do",
  "In Progress": "in-progress",
  Validation: "validation",
  Done: "done",
};
const T2S: Record<
  BoardTask["status"],
  "To Do" | "In Progress" | "Validation" | "Done"
> = {
  "to-do": "To Do",
  "in-progress": "In Progress",
  validation: "Validation",
  done: "Done",
};

function readTasks(): BoardTask[] {
  return storage.get<BoardTask[]>(BOARD_NS, "tasks", []);
}
function writeTasks(next: BoardTask[]) {
  storage.set(BOARD_NS, "tasks", next);
}

// Ensure there is a backlog feature for a project (used when creating from Board)
export function ensureBacklogFeature(projectId: string) {
  const feats = loadFeatures();
  const found = feats.find(
    (f) => f.projectId === projectId && f.name === "Backlog"
  );
  if (found) return found;
  const f = newFeatureSeed(projectId, "Backlog");
  upsertFeature(f);
  return f;
}

// Persist/update a board task for a story
export function syncStoryToBoard(story: Story, projectId: string) {
  const tasks = readTasks();
  const ix = tasks.findIndex((t) => t.storyId === story.id);
  const base: BoardTask = {
    id: ix >= 0 ? tasks[ix].id : `task-${Date.now()}`,
    project: projectId,
    storyId: story.id,
    title: story.title,
    status: S2T[story.status as keyof typeof S2T] ?? "to-do",
    createdAt: story.createdAt,
  };
  const next =
    ix >= 0
      ? [
          ...tasks.slice(0, ix),
          { ...tasks[ix], ...base },
          ...tasks.slice(ix + 1),
        ]
      : [base, ...tasks];
  writeTasks(next);
  window.dispatchEvent(new Event("board:projectsUpdated"));
}

// Remove a board task when a story is deleted
export function removeBoardTaskForStory(storyId: StoryId) {
  const tasks = readTasks().filter((t) => t.storyId !== storyId);
  writeTasks(tasks);
  window.dispatchEvent(new Event("board:projectsUpdated"));
}

// From a board task, ensure a Story exists under a feature
export function syncTaskToStory(task: BoardTask, featureId: FeatureId) {
  const existing = loadStories().find((s) => s.id === (task.storyId || ""));
  const now = new Date().toISOString();
  const s: Story = existing ?? {
    id: task.storyId || `story_${Date.now()}`,
    featureId,
    title: task.title || "Untitled",
    status: T2S[task.status] ?? "To Do",
    createdAt: task.createdAt || now,
    updatedAt: now,
    points: null,
  };
  // keep status/title in sync
  s.status = T2S[task.status] ?? "To Do";
  s.title = task.title || s.title;
  s.updatedAt = now;
  upsertStory(s);
  // if Story was newly created, remember the linkage on the task
  if (!task.storyId) {
    const tasks = readTasks().map((t) =>
      t.id === task.id ? { ...t, storyId: s.id } : t
    );
    writeTasks(tasks);
  }
}

// ────────────────────────────────────────────────────────────
// Load/save helpers
export function loadFeatures(): Feature[] {
  return storage.get<Feature[]>(BOARD_NS, K_FEATURES, []);
}
export function saveFeatures(list: Feature[]) {
  storage.set(BOARD_NS, K_FEATURES, list);
}

export function loadStories(): Story[] {
  return storage.get<Story[]>(BOARD_NS, K_STORIES, []);
}
export function saveStories(list: Story[]) {
  storage.set(BOARD_NS, K_STORIES, list);
}

export function loadBugs(): Bug[] {
  return storage.get<Bug[]>(BOARD_NS, K_BUGS, []);
}
export function saveBugs(list: Bug[]) {
  storage.set(BOARD_NS, K_BUGS, list);
}

// ────────────────────────────────────────────────────────────
// ID
const uid = (p: string) =>
  `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ────────────────────────────────────────────────────────────
// Seeds
export function newFeatureSeed(
  projectId: string,
  name = "New Feature"
): Feature {
  const now = new Date().toISOString();
  return {
    id: uid("feat"),
    projectId, // <— NEW
    name,
    createdAt: now,
    updatedAt: now,
    tags: [],
  };
}

export function newStorySeed(featureId: FeatureId, title = "New Story"): Story {
  const now = new Date().toISOString();
  return {
    id: uid("story"),
    featureId,
    title,
    status: "To Do",
    createdAt: now,
    updatedAt: now,
    points: null,
  };
}

export function newBugSeed(storyId: StoryId, title = "New Bug"): Bug {
  const now = new Date().toISOString();
  return {
    id: uid("bug"),
    storyId,
    title,
    severity: "Major",
    priority: "Medium",
    status: "Open",
    createdAt: now,
    updatedAt: now,
  };
}

// ────────────────────────────────────────────────────────────
// Feature CRUD
export function upsertFeature(f: Feature): Feature[] {
  const list = loadFeatures();
  const ix = list.findIndex((x) => x.id === f.id);
  const next =
    ix >= 0 ? [...list.slice(0, ix), f, ...list.slice(ix + 1)] : [f, ...list];
  saveFeatures(next);
  return next;
}

export function getFeatureById(id: FeatureId): Feature | null {
  return loadFeatures().find((f) => f.id === id) ?? null;
}

export function deleteFeature(id: FeatureId) {
  saveFeatures(loadFeatures().filter((f) => f.id !== id));
  // cascade: orphan stories & bugs are removed
  const stories = loadStories().filter((s) => s.featureId !== id);
  const storyIds = new Set(stories.map((s) => s.id));
  saveStories(stories);
  saveBugs(loadBugs().filter((b) => storyIds.has(b.storyId)));
}

// ────────────────────────────────────────────────────────────
// Story CRUD
export function upsertStory(s: Story): Story[] {
  const list = loadStories();
  const ix = list.findIndex((x) => x.id === s.id);
  const next =
    ix >= 0 ? [...list.slice(0, ix), s, ...list.slice(ix + 1)] : [s, ...list];
  saveStories(next);

  // bridge: mirror into board tasks
  const feature = getFeatureById(s.featureId);
  if (feature?.projectId) {
    syncStoryToBoard(s, feature.projectId);
  }
  return next;
}

export function getStoryById(id: StoryId): Story | null {
  return loadStories().find((s) => s.id === id) ?? null;
}

export function deleteStory(id: StoryId) {
  saveStories(loadStories().filter((s) => s.id !== id));
  saveBugs(loadBugs().filter((b) => b.storyId !== id));

  // bridge: remove matching board task
  removeBoardTaskForStory(id);
}

export function storiesByFeature(featureId: FeatureId): Story[] {
  return loadStories().filter((s) => s.featureId === featureId);
}

// Convenience
export function moveStory(id: StoryId, nextStatus: StoryStatus) {
  const s = getStoryById(id);
  if (!s) return;
  s.status = nextStatus;
  s.updatedAt = new Date().toISOString();
  upsertStory(s);
}

// ────────────────────────────────────────────────────────────
// Bug CRUD
export function upsertBug(b: Bug): Bug[] {
  const list = loadBugs();
  const ix = list.findIndex((x) => x.id === b.id);
  const next =
    ix >= 0 ? [...list.slice(0, ix), b, ...list.slice(ix + 1)] : [b, ...list];
  saveBugs(next);
  return next;
}

export function getBugById(id: BugId): Bug | null {
  return loadBugs().find((b) => b.id === id) ?? null;
}

export function deleteBug(id: BugId) {
  saveBugs(loadBugs().filter((b) => b.id !== id));
}

export function bugsByStory(storyId: StoryId): Bug[] {
  return loadBugs().filter((b) => b.storyId === storyId);
}

export function selectedProjectId(): string {
  return storage.get<string>(BOARD_NS, "selectedProjectId", "");
}

// ────────────────────────────────────────────────────────────
// Dashboard helpers
export function featureSummaries(): FeatureSummary[] {
  const features = loadFeatures();
  const stories = loadStories();
  const bugs = loadBugs();

  const storiesByFeat = new Map<FeatureId, Story[]>();
  stories.forEach((s) => {
    const arr = storiesByFeat.get(s.featureId) ?? [];
    arr.push(s);
    storiesByFeat.set(s.featureId, arr);
  });

  const bugCounts = new Map<StoryId, number>();
  bugs.forEach((b) =>
    bugCounts.set(b.storyId, (bugCounts.get(b.storyId) ?? 0) + 1)
  );

  return features.map((feature) => {
    const fs = storiesByFeat.get(feature.id) ?? [];
    const counts: Record<StoryId, number> = {};
    fs.forEach((s) => (counts[s.id] = bugCounts.get(s.id) ?? 0));
    return { feature, stories: fs, bugCountsByStory: counts };
  });
}

export function featuresByProject(projectId: string): Feature[] {
  if (!projectId) return [];
  return loadFeatures().filter((f) => f.projectId === projectId);
}
