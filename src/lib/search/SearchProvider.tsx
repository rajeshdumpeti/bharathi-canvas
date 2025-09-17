import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

export type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  action?: () => void;
  sourceId?: string;
  sourceLabel?: string;
};

export type SafeGet = <T>(key: string, fallback: T) => T;
export type SourceFn = (
  q: string,
  helpers: { safeGet: SafeGet }
) => SearchItem[];
export interface RegisterSource {
  (id: string, label: string, fn: SourceFn): () => void;
}
export interface SearchContext {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  results: SearchItem[];
  registerSource: RegisterSource;
  search: (q: string) => void;
}

const SearchCtx = createContext<SearchContext | undefined>(undefined);
export function useSearch(): SearchContext {
  const ctx = useContext(SearchCtx);
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>");
  return ctx;
}

type SourceDef = { id: string; label: string; fn: SourceFn };
const shallowSameList = (a: SearchItem[], b: SearchItem[]) =>
  a === b ||
  (a.length === b.length &&
    a.every(
      (x, i) =>
        x.id === b[i].id &&
        x.sourceId === b[i].sourceId &&
        x.title === b[i].title &&
        x.subtitle === b[i].subtitle
    ));

export default function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);

  const sourcesRef = useRef<Map<string, SourceDef>>(new Map());

  /** stable register */
  const registerSource: RegisterSource = useCallback((id, label, fn) => {
    sourcesRef.current.set(id, { id, label, fn });
    return () => {
      sourcesRef.current.delete(id);
    };
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  /** Helper for sources */
  const safeGet: SafeGet = useCallback((key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      const val = raw ? JSON.parse(raw) : fallback;
      return (val ?? fallback) as typeof fallback;
    } catch {
      return fallback;
    }
  }, []);

  /** idempotent search */
  const search = useCallback(
    (qRaw: string) => {
      const q = (qRaw || "").trim();

      // only set query if it actually changed
      setQuery((prev) => (prev === q ? prev : q));

      const items: SearchItem[] = Array.from(
        sourcesRef.current.values()
      ).flatMap((src) => {
        try {
          const out = src.fn(q, { safeGet }) || [];
          return out.map((i) => ({
            ...i,
            sourceId: i.sourceId ?? src.id,
            sourceLabel: i.sourceLabel ?? src.label,
          }));
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn(`[search] source "${src.label}" failed:`, err);
          return [];
        }
      });

      // only update if list is actually different
      setResults((prev) => (shallowSameList(prev, items) ? prev : items));
    },
    [safeGet]
  );

  // Open palette and seed results once
  const open = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => search(query || ""), 0);
  }, [query, search]);

  // ⌘K / Ctrl+K to open; Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e) return;
      const key = (e.key || "").toLowerCase();
      const meta = !!(e.metaKey || e.ctrlKey);
      if (meta && key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
        return;
      }
      if (key === "escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const value: SearchContext = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      query,
      setQuery,
      results,
      registerSource,
      search,
    }),
    [isOpen, open, close, toggle, query, results, registerSource, search]
  );

  return <SearchCtx.Provider value={value}>{children}</SearchCtx.Provider>;
}
