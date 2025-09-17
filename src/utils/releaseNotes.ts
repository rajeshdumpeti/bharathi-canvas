// Lightweight types you can re-use in board & release-notes
export type Priority = "Low" | "Medium" | "High" | (string & {});
export type ReleaseGroup = "Features" | "Fixes" | "Improvements" | "Chores";

export type TaskLite = {
  id?: string | number;
  title?: string;
  priority?: Priority;
  labels?: Array<string>;
};

export type MarkdownOpts = {
  version: string; // e.g. "v1.2.3" or "1.2.3"
  date: string; // already formatted string (YYYY-MM-DD, etc.)
  tasks: TaskLite[];
  /** "type" (default, uses classifyTask) or "label" (uses first label) */
  groupBy?: "type" | "label";
  /** Emoji to decorate each section (override or extend) */
  emoji?: Partial<Record<ReleaseGroup, string>> & Record<string, string>;
};

export const DEFAULT_EMOJI: Record<ReleaseGroup, string> = {
  Features: "✨",
  Fixes: "🐛",
  Improvements: "⚙️",
  Chores: "🧹",
};

// ---------- classification & markdown ----------

/** Classify a task into a release-note group. */
export function classifyTask(task: TaskLite): ReleaseGroup {
  const labels = (task.labels ?? []).map((l) => String(l).toLowerCase());
  const has = (kw: string) => labels.some((l) => l.includes(kw));

  if (has("feature") || has("enhancement") || task.priority === "High")
    return "Features";
  if (has("bug") || has("fix") || has("hotfix")) return "Fixes";
  if (has("perf") || has("refactor") || has("ux") || has("docs"))
    return "Improvements";
  return "Chores";
}

/** Build a GitHub-friendly markdown from tasks. */
export function tasksToMarkdown({
  version,
  date,
  tasks,
  groupBy = "type",
  emoji = DEFAULT_EMOJI,
}: MarkdownOpts): string {
  // group tasks
  const groups = new Map<string, TaskLite[]>();
  const push = (k: string, t: TaskLite) =>
    groups.set(k, [...(groups.get(k) ?? []), t]);

  for (const t of tasks) {
    const key =
      groupBy === "label" ? (t.labels?.[0] ?? "Other") : classifyTask(t);
    push(key, t);
  }

  // header
  const header = `## ${normalizeVersion(version)} — ${date}\n`;

  // sections (stable alpha order by group label)
  const sections = [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([title, items]) => {
      const em = emoji[title as ReleaseGroup] ?? emoji[title] ?? "•";
      const lines = items
        .slice()
        .sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""))
        .map((t) => {
          const id =
            t.id != null ? ` (${String(t.id).replace(/^task-/, "#")})` : "";
          return `- ${em} ${t.title || "(untitled)"}${id}`;
        })
        .join("\n");
      return `\n### ${title}\n${lines}\n`;
    })
    .join("\n");

  return header + sections + "\n";
}

/** Semantic-ish bump: feature -> minor, else -> patch. Accepts vX.Y.Z or X.Y.Z. */
export function suggestNextVersion(
  prevVersion?: string,
  hasFeature = false
): string {
  const clean = (prevVersion ?? "").replace(/^v/i, "").trim();
  const parts = clean.split(".").map((n) => Number.parseInt(n, 10));
  let [maj, min, pat] = [0, 0, 0];

  if (parts.length === 3 && parts.every(Number.isFinite)) {
    [maj, min, pat] = parts as [number, number, number];
  }

  if (hasFeature) {
    min += 1;
    pat = 0;
  } else {
    pat += 1;
  }
  return `v${maj}.${min}.${pat}`;
}

// ---------- small internal helpers ----------

function normalizeVersion(v: string): string {
  const s = (v || "").trim();
  return /^v/i.test(s) ? s : `v${s}`;
}
