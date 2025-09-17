import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  action?: () => void;
  // Optional metadata if you want to show grouping/badges later:
  sourceId?: string;
  sourceLabel?: string;
};

export type SafeGet = <T>(key: string, fallback: T) => T;

export type SourceFn = (
  q: string,
  helpers: { safeGet: SafeGet }
) => SearchItem[]; // keep sync for now

export interface RegisterSource {
  (id: string, label: string, fn: SourceFn): () => void; // returns unregister
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

export default function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]); // flat list from all sources

  // id -> { id, label, fn }
  const sourcesRef = useRef<Map<string, SourceDef>>(new Map());

  /** Register a search source; returns an unregister function */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const registerSource: RegisterSource = (id, label, fn) => {
    sourcesRef.current.set(id, { id, label, fn });
    return () => sourcesRef.current.delete(id);
  };

  const close = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };
  const toggle = () => setIsOpen((v) => !v);

  /** Helper given to sources to safely read localStorage JSON */
  const safeGet: SafeGet = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      const val = raw ? JSON.parse(raw) : fallback;
      return (val ?? fallback) as typeof fallback;
    } catch {
      return fallback;
    }
  };

  /** Run a search across all registered sources (sync) */
  const search = React.useCallback((qRaw: string) => {
    const q = (qRaw || "").trim();
    setQuery(q);

    const items: SearchItem[] = Array.from(sourcesRef.current.values()).flatMap(
      (src) => {
        try {
          const out = src.fn(q, { safeGet }) || [];
          // Optionally stamp source metadata (useful for UIs later)
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
      }
    );

    setResults(items);
  }, []);

  // Open palette and seed results so it isn't empty on first paint
  const open = React.useCallback(() => {
    setIsOpen(true);
    // Let any onOpen animations/layout happen, then seed
    setTimeout(() => search(query || ""), 0);
  }, [query, search]);

  // Keyboard: ⌘K / Ctrl+K to open; Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e || (e as any).isComposing) return;
      const key = (e.key || "").toLowerCase();
      const meta = !!(e.metaKey || e.ctrlKey);

      if (meta && key === "k") {
        e.preventDefault();
        toggle();
        return;
      }
      if (key === "escape") {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    [isOpen, open, query, results, registerSource, search]
  );

  return <SearchCtx.Provider value={value}>{children}</SearchCtx.Provider>;
}
