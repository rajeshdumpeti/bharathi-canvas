import React, { useEffect, useMemo, useState } from "react";
import useProjectHub from "../../../hooks/useProjectHub";
import IconButton from "../../../components/ui/IconButton";
import ChipInput from "../../../components/ui/ChipInput";

/** ---------- defaults (kept local for this section) ---------- */
const defaultLinks = {
    overview: "",
    bookmarks: [
        { label: 'Production', url: 'https://app.example.com', notes: '' }
    ],
    // Curated groups you’ll likely use; you can rename / add / remove in edit mode
    categories: [
        { name: "Repositories", links: [] },
        { name: "Documentation", links: [] },
        { name: "Design", links: [] },
        { name: "Monitoring", links: [] },
        { name: "Dashboards", links: [] },
        { name: "Services / Vendors", links: [] },
        { name: "Environments", links: [] },
    ],
    tags: [],
};

/** ---------- small reusable bits for this file ---------- */
const RowBtn = ({ onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className="px-2 py-1 rounded border text-xs hover:bg-gray-50"
    >
        {children}
    </button>
);

function TableEditor({ value = [], onChange, columns }) {
    const addEmpty = () =>
        onChange([...value, Object.fromEntries(columns.map((c) => [c.key, ""]))]);

    const set = (i, key, v) => {
        const copy = [...value];
        copy[i] = { ...copy[i], [key]: v };
        onChange(copy);
    };

    const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

    return (
        <div className="overflow-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500">
                        {columns.map((c) => (
                            <th key={c.key} className="py-2 pr-3">
                                {c.label}
                            </th>
                        ))}
                        <th className="py-2" />
                    </tr>
                </thead>
                <tbody>
                    {value.map((row, i) => (
                        <tr key={i} className="border-t">
                            {columns.map((c) => (
                                <td key={c.key} className="py-2 pr-3">
                                    <input
                                        className="w-full rounded border px-2 py-1"
                                        value={row[c.key] || ""}
                                        onChange={(e) => set(i, c.key, e.target.value)}
                                        placeholder={c.placeholder}
                                    />
                                </td>
                            ))}
                            <td className="py-2">
                                <RowBtn onClick={() => remove(i)}>Remove</RowBtn>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3">
                <RowBtn onClick={addEmpty}>Add</RowBtn>
            </div>
        </div>
    );
}

/** ---------- main component ---------- */
export default function Links() {
    const { selected, updateSection } = useProjectHub();

    const saved = useMemo(
        () =>
            selected?.sections?.links && typeof selected.sections.links === "object"
                ? selected.sections.links
                : defaultLinks,
        [selected]
    );

    const [mode, setMode] = useState("read"); // 'read' | 'edit'
    const [form, setForm] = useState(defaultLinks);

    useEffect(() => {
        setForm(saved || defaultLinks);
        setMode("read");
    }, [saved, selected?.id]);

    const onChange = (patch) => setForm((f) => ({ ...f, ...patch }));
    const onSave = () => {
        updateSection("links", form);
        setMode("read");
    };

    if (!selected) {
        return (
            <div className="rounded-lg border bg-white p-8 text-gray-600">
                Create or select a project on the left to manage <strong>Links</strong>.
            </div>
        );
    }

    /** ---------- READ MODE ---------- */
    if (mode === "read") {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Links</h3>
                    <IconButton onClick={() => setMode("edit")}>Edit</IconButton>
                </div>

                {/* Overview */}
                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Overview</h4>
                    <p className="text-sm whitespace-pre-line">
                        {form.overview || "—"}
                    </p>
                </div>

                {/* Quick bookmarks */}
                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Quick bookmarks</h4>
                    {form.bookmarks?.length ? (
                        <ul className="text-sm space-y-2">
                            {form.bookmarks.map((b, i) => (
                                <li key={i} className="break-words">
                                    <a
                                        className="text-blue-700 hover:underline"
                                        href={b.url || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {b.label || b.url || "Link"}
                                    </a>
                                    {b.notes ? <span className="text-gray-500"> — {b.notes}</span> : null}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">—</p>
                    )}
                </div>

                {/* Grouped categories */}
                <div className="space-y-6">
                    {form.categories?.map((cat, idx) => (
                        <div key={idx} className="rounded border bg-white p-4">
                            <h4 className="font-semibold mb-2">{cat.name || "Category"}</h4>
                            {cat.links?.length ? (
                                <ul className="text-sm space-y-2">
                                    {cat.links.map((l, i) => (
                                        <li key={i} className="break-words">
                                            <a
                                                className="text-blue-700 hover:underline"
                                                href={l.url || "#"}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {l.label || l.url || "Link"}
                                            </a>
                                            {l.notes ? (
                                                <span className="text-gray-500"> — {l.notes}</span>
                                            ) : null}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">—</p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Tags */}
                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Tags</h4>
                    {(form.tags || []).length ? (
                        <div className="flex flex-wrap gap-2">
                            {form.tags.map((t) => (
                                <span key={t} className="px-2 py-1 rounded bg-gray-100 text-xs">
                                    {t}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">—</p>
                    )}
                </div>
            </div>
        );
    }

    /** ---------- EDIT MODE ---------- */
    return (
        <form
            className="space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                onSave();
            }}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Edit Links</h3>
                <div className="flex gap-2">
                    <IconButton onClick={() => setMode("read")}>Cancel</IconButton>
                    <button
                        type="submit"
                        className="px-3 py-2 rounded bg-blue-600 text-white"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* Overview */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Overview</h4>
                <textarea
                    rows={3}
                    className="w-full rounded border px-3 py-2"
                    value={form.overview}
                    onChange={(e) => onChange({ overview: e.target.value })}
                    placeholder="What belongs here? e.g., where to find repos, docs, dashboards, service consoles…"
                />
            </section>

            {/* Bookmarks */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Quick bookmarks</h4>
                <TableEditor
                    value={form.bookmarks}
                    onChange={(v) => onChange({ bookmarks: v })}
                    columns={[
                        { key: "label", label: "Label", placeholder: "Production" },
                        { key: "url", label: "URL", placeholder: "https://…" },
                        { key: "notes", label: "Notes", placeholder: "What is this?" },
                    ]}
                />
            </section>

            {/* Categories */}
            <section className="rounded border bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Categories</h4>
                    <RowBtn
                        onClick={() =>
                            onChange({
                                categories: [...(form.categories || []), { name: "", links: [] }],
                            })
                        }
                    >
                        Add category
                    </RowBtn>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {(form.categories || []).map((cat, ci) => {
                        const setCat = (patch) => {
                            const copy = [...form.categories];
                            copy[ci] = { ...copy[ci], ...patch };
                            onChange({ categories: copy });
                        };
                        const addLink = () =>
                            setCat({
                                links: [
                                    ...(cat.links || []),
                                    { label: "", url: "", notes: "" },
                                ],
                            });
                        const setLink = (i, patch) => {
                            const links = [...(cat.links || [])];
                            links[i] = { ...links[i], ...patch };
                            setCat({ links });
                        };
                        const removeLink = (i) =>
                            setCat({ links: (cat.links || []).filter((_, idx) => idx !== i) });

                        return (
                            <div key={ci} className="rounded border p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <input
                                        className="w-64 rounded border px-2 py-1 font-semibold"
                                        value={cat.name}
                                        onChange={(e) => setCat({ name: e.target.value })}
                                        placeholder="Category name (e.g., Repositories)"
                                    />
                                    <RowBtn
                                        onClick={() =>
                                            onChange({
                                                categories: form.categories.filter((_, i) => i !== ci),
                                            })
                                        }
                                    >
                                        Remove
                                    </RowBtn>
                                </div>

                                {(cat.links || []).length === 0 ? (
                                    <button
                                        type="button"
                                        onClick={addLink}
                                        className="text-sm text-blue-700 hover:underline"
                                    >
                                        Add first link
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        {(cat.links || []).map((l, li) => (
                                            <div key={li} className="grid md:grid-cols-3 gap-2">
                                                <input
                                                    className="rounded border px-2 py-1"
                                                    value={l.label}
                                                    onChange={(e) => setLink(li, { label: e.target.value })}
                                                    placeholder="Label (e.g., Frontend)"
                                                />
                                                <input
                                                    className="rounded border px-2 py-1"
                                                    value={l.url}
                                                    onChange={(e) => setLink(li, { url: e.target.value })}
                                                    placeholder="https://…"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        className="flex-1 rounded border px-2 py-1"
                                                        value={l.notes || ""}
                                                        onChange={(e) => setLink(li, { notes: e.target.value })}
                                                        placeholder="Notes (optional)"
                                                    />
                                                    <RowBtn onClick={() => removeLink(li)}>Remove</RowBtn>
                                                </div>
                                            </div>
                                        ))}
                                        <RowBtn onClick={addLink}>Add link</RowBtn>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Tags */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Tags</h4>
                <ChipInput
                    value={form.tags || []}
                    onChange={(v) => onChange({ tags: v })}
                    placeholder="Add a tag and press Enter"
                />
            </section>
        </form>
    );
}
