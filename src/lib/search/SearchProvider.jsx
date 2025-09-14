import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

const SearchCtx = createContext(undefined);

export function useSearch() {
    const ctx = useContext(SearchCtx);
    if (!ctx) throw new Error('useSearch must be used within <SearchProvider>');
    return ctx;
}

export default function SearchProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]); // flat array of items from all sources

    // id -> { id, label, fn } where fn = (q, helpers) => items[]
    const sourcesRef = useRef(new Map());

    /** Register a search source; returns an unregister function */
    const registerSource = (id, label, fn) => {
        sourcesRef.current.set(id, { id, label, fn });
        return () => sourcesRef.current.delete(id);
    };

    const close = () => { setIsOpen(false); setQuery(''); setResults([]); };
    const toggle = () => setIsOpen(v => !v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const open = () => {
        setIsOpen(true);
        // seed results so the palette isn't empty when it opens
        setTimeout(() => search(query || ''), 0);
    };

    /** Helper given to sources to safely read localStorage JSON */
    const safeGet = (key, fallback = []) => {
        try {
            const raw = localStorage.getItem(key);
            const val = raw ? JSON.parse(raw) : fallback;
            return val ?? fallback;
        } catch {
            return fallback;
        }
    };

    /** Run a search across all registered sources */
    const search = React.useCallback((qRaw) => {
        const q = (qRaw || '').trim();
        setQuery(q);

        const items = Array.from(sourcesRef.current.values()).flatMap(src => {
            try {
                const out = src.fn(q, { safeGet }) || [];
                return Array.isArray(out) ? out : [];
            } catch (err) {
                // eslint-disable-next-line no-console
                console.warn(`[search] source "${src.label}" failed:`, err);
                return [];
            }
        });

        setResults(items);
    }, []);

    // Keyboard: ⌘K / Ctrl+K to open; Esc to close
    useEffect(() => {
        const onKey = (e) => {
            if (!e || e.isComposing) return;
            const key = (e.key || '').toLowerCase();
            const meta = !!(e.metaKey || e.ctrlKey);

            if (meta && key === 'k') {
                e.preventDefault();
                toggle();
                return;
            }
            if (key === 'escape') {
                e.preventDefault();
                close();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const value = useMemo(() => ({
        isOpen, open, close, toggle,
        query, setQuery,
        results,
        registerSource,
        search,          // <-- exposed for CommandPalette
    }), [isOpen, query, results, search, open]);

    return <SearchCtx.Provider value={value}>{children}</SearchCtx.Provider>;
}
