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

// ────────────────────────────────────────────────────────────
// Keys
const K_FEATURES = "features";
const K_STORIES = "stories";
const K_BUGS = "bugs";

// ---- Bridge: Board <-> Features -------------------------------------------

type BoardTask = {
  id: string;
  project: string;
  storyId?: string; // human id like US234567
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

// event helpers
function broadcastFeatures() {
  window.dispatchEvent(new Event("features:changed"));
}

function readTasks(): BoardTask[] {
  return storage.get<BoardTask[]>(BOARD_NS, "tasks", []);
}
function writeTasks(next: BoardTask[]) {
  storage.set(BOARD_NS, "tasks", next);
  window.dispatchEvent(new Event("board:tasksUpdated"));
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

  // story may carry a human id (US234567) in an extra field
  const humanId =
    (story as any)?.storyId ||
    // fallback: keep compatibility with older data by using the internal id
    (story.id as string);

  const ix = tasks.findIndex((t) => t.storyId === humanId);

  const base: BoardTask = {
    id: ix >= 0 ? tasks[ix].id : `task-${Date.now()}`,
    project: projectId,
    storyId: humanId,
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
}

// Remove a board task when a story is deleted
export function removeBoardTaskForStory(storyIdOrHumanId: StoryId) {
  const tasks = readTasks().filter((t) => t.storyId !== storyIdOrHumanId);
  writeTasks(tasks);
}

// From a board task, ensure a Story exists under a feature
export function syncTaskToStory(task: BoardTask, featureId: FeatureId) {
  const existing = loadStories().find(
    (s) =>
      (s as any)?.storyId === task.storyId ||
      (!task.storyId && s.id === (task as any).storyId)
  );

  const now = new Date().toISOString();

  // We need a human US id for the story if task doesn't have one yet
  const feature = getFeatureById(featureId);
  const projectId = feature?.projectId || "";

  const ensureHumanId = () => task.storyId || nextUsId(projectId); // generate if missing

  const s: Story =
    existing ??
    ({
      id: task.storyId ? `story_${Date.now()}` : `story_${Date.now()}`,
      storyId: ensureHumanId(), // store for future lookups
      featureId,
      title: task.title || "Untitled",
      status: T2S[task.status] ?? "To Do",
      createdAt: task.createdAt || now,
      updatedAt: now,
      points: null,
    } as any);

  // keep status/title in sync
  s.status = T2S[task.status] ?? "To Do";
  s.title = task.title || s.title;
  s.updatedAt = now;
  upsertStory(s);

  // if Story was newly created or task didn't have the human id, remember it on the task
  if (task.storyId !== (s as any).storyId) {
    const tasks = readTasks().map((t) =>
      t.id === task.id ? { ...t, storyId: (s as any).storyId } : t
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
  broadcastFeatures();
}

export function loadStories(): Story[] {
  return storage.get<Story[]>(BOARD_NS, K_STORIES, []);
}
export function saveStories(list: Story[]) {
  storage.set(BOARD_NS, K_STORIES, list);
  broadcastFeatures();
}

export function loadBugs(): Bug[] {
  return storage.get<Bug[]>(BOARD_NS, K_BUGS, []);
}
export function saveBugs(list: Bug[]) {
  storage.set(BOARD_NS, K_BUGS, list);
  broadcastFeatures();
}

// ────────────────────────────────────────────────────────────
// ID
const uid = (p: string) =>
  `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Per-project Story ID sequence (starts at 234567) → US234567
function nextUsId(projectId: string) {
  const map = storage.get<Record<string, number>>(BOARD_NS, "storySeq", {});
  const current = Number(map[projectId] || 234567);
  const id = `US${current}`;
  map[projectId] = current + 1;
  storage.set(BOARD_NS, "storySeq", map);
  return id;
}

// ────────────────────────────────────────────────────────────
// Seeds
export function newFeatureSeed(
  projectId: string,
  name = "New Feature"
): Feature {
  const now = new Date().toISOString();
  return {
    id: uid("feat"),
    projectId,
    name,
    createdAt: now,
    updatedAt: now,
    tags: [],
  };
}

export function getFeatureById(id: FeatureId): Feature | null {
  return loadFeatures().find((f) => f.id === id) ?? null;
}

export function newStorySeed(featureId: FeatureId, title = "New Story"): Story {
  const now = new Date().toISOString();
  const f = getFeatureById(featureId);
  const projectId = f?.projectId || "";
  const humanId = nextUsId(projectId); // US###### visible id

  return {
    id: uid("story"),
    // store human id alongside for cross-refs (kept as extra field)
    ...({ storyId: humanId } as any),
    featureId,
    title,
    status: "To Do",
    createdAt: now,
    updatedAt: now,
    points: null,
  };
}

// ────────────────────────────────────────────────────────────
/** Feature CRUD */
export function upsertFeature(f: Feature): Feature[] {
  const list = loadFeatures();
  const ix = list.findIndex((x) => x.id === f.id);
  const next =
    ix >= 0 ? [...list.slice(0, ix), f, ...list.slice(ix + 1)] : [f, ...list];
  saveFeatures(next);
  return next;
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
/** Story CRUD */
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
  const all = loadStories();
  const doomed = all.find((s) => s.id === id);
  saveStories(all.filter((s) => s.id !== id));
  saveBugs(loadBugs().filter((b) => b.storyId !== id));

  // bridge: remove matching board task by human id if we have it, else by internal id
  const human = (doomed as any)?.storyId || id;
  removeBoardTaskForStory(human);
}

// Convenience by internal id
export function moveStory(id: StoryId, nextStatus: StoryStatus) {
  const s = getStoryById(id);
  if (!s) return;
  s.status = nextStatus;
  s.updatedAt = new Date().toISOString();
  upsertStory(s);
}

// Convenience by human id (US######) — used by BoardView
export function deleteStoryById(humanId: string) {
  const s = loadStories().find((x) => (x as any)?.storyId === humanId);
  if (s) deleteStory(s.id);
}

export function moveStoryByStoryId(
  humanId: string,
  nextStatus: "To Do" | "In Progress" | "Validation" | "Done"
) {
  const s = loadStories().find((x) => (x as any)?.storyId === humanId);
  if (!s) return;
  moveStory(s.id, nextStatus);
}

// Queries
export function storiesByFeature(featureId: FeatureId): Story[] {
  return loadStories().filter((s) => s.featureId === featureId);
}

// ────────────────────────────────────────────────────────────
/** Bug CRUD */
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
