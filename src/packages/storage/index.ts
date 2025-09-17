// Strongly-typed localStorage helpers with namespacing.
// No behavior changes vs. the JS version.

export const BOARD_NS = "board" as const;
export const HUB_NS = "hub" as const;
export const DOCS_NS = "docs" as const;
export const RN_NS = "releaseNotes" as const;

export type StorageNamespace =
  | typeof BOARD_NS
  | typeof HUB_NS
  | typeof DOCS_NS
  | typeof RN_NS;

const k = (ns: StorageNamespace, key: string) => `${ns}:${key}`;

// Define overloads outside the object
function get<T>(ns: StorageNamespace, key: string): T | null;
function get<T>(ns: StorageNamespace, key: string, fallback: T): T;
function get<T>(ns: StorageNamespace, key: string, fallback?: T): T | null {
  try {
    const raw = localStorage.getItem(k(ns, key));
    if (raw == null) return (fallback ?? null) as T | null;
    return JSON.parse(raw) as T;
  } catch {
    return (fallback ?? null) as T | null;
  }
}

export const storage = {
  get, // Reference the standalone get function
  set<T>(ns: StorageNamespace, key: string, value: T): void {
    localStorage.setItem(k(ns, key), JSON.stringify(value));
  },
  remove(ns: StorageNamespace, key: string): void {
    localStorage.removeItem(k(ns, key));
  },
  clear(ns: StorageNamespace): void {
    const prefix = `${ns}:`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) localStorage.removeItem(key);
    }
  },
} as const;
