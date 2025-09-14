import React, { useEffect, useMemo, useState } from 'react';
import { useSearch } from '../../lib/search/SearchProvider';

export default function CommandPalette() {
    const { isOpen, close, query, setQuery, results, search } = useSearch();
    const flat = useMemo(
        () => results.flatMap(g => g.items.map(it => ({ ...it, _group: g.sourceLabel }))),
        [results]
    );
    const [index, setIndex] = useState(0);

    useEffect(() => { if (isOpen) setTimeout(() => document.getElementById('cmdk-input')?.focus(), 0); }, [isOpen]);

    useEffect(() => { if (isOpen) search(query); }, [isOpen, query, search]); // seed once opened
    useEffect(() => {
        const id = setTimeout(() => { if (isOpen) search(query); }, 120);
        return () => clearTimeout(id);
    }, [query, isOpen, search]);

    useEffect(() => setIndex(0), [results]);

    if (!isOpen) return null;

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, flat.length - 1)); }
        if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
        if (e.key === 'Enter') {
            e.preventDefault();
            const item = flat[index];
            if (item?.action) { close(); item.action(); }
        }
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={close} />
            <div className="absolute left-1/2 top-20 -translate-x-1/2 w-full max-w-2xl rounded-xl bg-white shadow-2xl overflow-hidden">
                <div className="border-b p-3">
                    <input
                        id="cmdk-input"
                        value={query ?? ''}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Search tasks, projects, documents, hub…"
                        className="w-full px-3 py-2 outline-none"
                    />
                </div>

                <div className="max-h-[60vh] overflow-auto">
                    {results.length === 0 && (
                        <div className="p-6 text-gray-500">No results. Try another search.</div>
                    )}

                    {results.map((group, gIdx) => (
                        <div key={group.sourceId} className="px-2 py-3">
                            <div className="px-2 text-xs font-semibold uppercase text-gray-500">{group.sourceLabel}</div>
                            <ul className="mt-1">
                                {group.items.map((item, i) => {
                                    const flatIdx = results.slice(0, gIdx).reduce((acc, g) => acc + g.items.length, 0) + i;
                                    const active = flatIdx === index;
                                    return (
                                        <li key={`${group.sourceId}-${item.id}`}>
                                            <button
                                                onClick={() => { item.action?.(); close(); }}
                                                onMouseEnter={() => setIndex(flatIdx)}
                                                className={`w-full text-left px-3 py-2 rounded-md ${active ? 'bg-blue-50' : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="text-sm font-medium">{item.title}</div>
                                                {item.subtitle && <div className="text-xs text-gray-500">{item.subtitle}</div>}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t px-3 py-2 text-[11px] text-gray-500 flex justify-between">
                    <span>Navigate with ↑ ↓, Enter to open</span>
                    <span>Press Esc to close</span>
                </div>
            </div>
        </div>
    );
}
