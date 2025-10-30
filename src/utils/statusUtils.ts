// src/utils/statusUtils.ts
/**
 * Canonical status keys used across frontend + backend.
 */
export type NormalizedStatus = "to_do" | "in_progress" | "validation" | "done";

/**
 * Converts any label / title / key into a standardized backend status ID.
 * Examples:
 *  - "To Do" → "to_do"
 *  - "in-progress" → "in_progress"
 *  - "Validation" → "validation"
 *  - "Done" → "done"
 */
export function toStatusId(input?: string): NormalizedStatus {
  if (!input) return "to_do";

  const raw = input.toLowerCase().trim().replace(/[-\s]/g, "_");

  if (raw.includes("progress")) return "in_progress";
  if (raw.includes("validation") || raw.includes("qa")) return "validation";
  if (raw.includes("done") || raw.includes("complete")) return "done";
  if (raw.includes("to_do") || raw.includes("todo")) return "to_do";

  return "to_do";
}

/**
 * Converts a normalized status ID to its display name for UI labels.
 */
export function toColumnTitle(status: NormalizedStatus): string {
  switch (status) {
    case "to_do":
      return "To Do";
    case "in_progress":
      return "In Progress";
    case "validation":
      return "Validation";
    case "done":
      return "Done";
    default:
      return "To Do";
  }
}

/**
 * The canonical column order for the board.
 */
export const COLUMN_ORDER: NormalizedStatus[] = [
  "to_do",
  "in_progress",
  "validation",
  "done",
];

/**
 * Mapping used for rendering and reverse lookups.
 */
export const STATUS_LABELS: Record<NormalizedStatus, string> = {
  to_do: "To Do",
  in_progress: "In Progress",
  validation: "Validation",
  done: "Done",
};
