// src/utils/columns.ts
import type { BoardColumn } from "types/board";
import {
  toStatusId,
  toColumnTitle,
  COLUMN_ORDER,
  NormalizedStatus,
} from "./statusUtils";

/**
 * Default board columns, used when project has no custom workflow.
 */
export const DEFAULT_COLUMNS: BoardColumn[] = COLUMN_ORDER.map((id) => ({
  id,
  title: toColumnTitle(id),
}));

/**
 * Normalizes raw project column data (from DB or API) into a clean,
 * unique, properly ordered array.
 */
export function normalizeColumns(raw?: any[]): BoardColumn[] {
  const seen = new Set<NormalizedStatus>();

  const base = (raw && raw.length > 0 ? raw : DEFAULT_COLUMNS)
    .map((c) => {
      const id = toStatusId(c.key ?? c.id ?? c.title);
      if (seen.has(id)) return null;
      seen.add(id);
      return { id, title: toColumnTitle(id) };
    })
    .filter(Boolean) as BoardColumn[];

  // Ensure all default columns exist (no missing states)
  for (const id of COLUMN_ORDER) {
    if (!seen.has(id)) {
      base.push({ id, title: toColumnTitle(id) });
    }
  }

  // Always sorted in correct order
  return base.sort(
    (a, b) =>
      COLUMN_ORDER.indexOf(a.id as NormalizedStatus) -
      COLUMN_ORDER.indexOf(b.id as NormalizedStatus)
  );
}
