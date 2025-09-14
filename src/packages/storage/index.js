const k = (ns, key) => `${ns}:${key}`;

export const storage = {
    get(ns, key, fallback = null) {
        try {
            const raw = localStorage.getItem(k(ns, key));
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },
    set(ns, key, value) {
        localStorage.setItem(k(ns, key), JSON.stringify(value));
    },
    remove(ns, key) {
        localStorage.removeItem(k(ns, key));
    },
    clear(ns) {
        const p = `${ns}:`;
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key.startsWith(p)) localStorage.removeItem(key);
        }
    },
};
// Suggested namespaces used below:
export const BOARD_NS = 'board';
export const HUB_NS = 'hub';
export const DOCS_NS = 'docs';
export const RN_NS = 'releaseNotes';
