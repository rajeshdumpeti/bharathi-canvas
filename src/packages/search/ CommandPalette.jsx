import React, { useEffect } from 'react';

export default function CommandPalette({ open, onClose }) {
    useEffect(() => {
        const h = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                onClose?.(false); // you can toggle from parent
            }
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [onClose]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/40">
            <div className="mx-auto mt-24 max-w-xl rounded-lg bg-white p-4 shadow-xl">
                <input
                    autoFocus
                    className="w-full rounded border px-3 py-2"
                    placeholder="Type to search (coming soon)…"
                />
            </div>
        </div>
    );
}
