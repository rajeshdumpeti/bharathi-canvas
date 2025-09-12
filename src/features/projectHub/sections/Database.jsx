// src/features/projectHub/sections/Database.jsx
import React, { useEffect, useMemo, useState } from "react";
import useProjectHub from "../../../hooks/useProjectHub";
import IconButton from "../../../components/ui/IconButton";
import ChipInput from "../../../components/ui/ChipInput";
import databaseDefault from "../constants/databaseDefault";

/* utilities */
const RowBtn = ({ onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className="px-2 py-1 rounded border text-xs hover:bg-gray-50"
    >
        {children}
    </button>
);

function SimpleListEditor({ value = [], onChange, columns }) {
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

/* a compact Entities editor
   - fieldsString: "id:uuid!, project_id:uuid, title:text"
   - indexesString: "tasks_pkey(id), idx_tasks_project(project_id)"
*/
function EntitiesEditor({ value = [], onChange }) {
    const add = () =>
        onChange([
            ...value,
            {
                name: "",
                table: "",
                description: "",
                fields: [],
                indexes: [],
            },
        ]);

    const toFieldsString = (fields = []) =>
        fields
            .map((f) => `${f.name}:${f.type}${f.nullable === false || f.pk ? "!" : ""}`)
            .join(", ");

    const fromFieldsString = (s) =>
        (s || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
            .map((pair) => {
                const [n, tRaw] = pair.split(":").map((v) => (v || "").trim());
                const req = (tRaw || "").endsWith("!");
                const type = req ? tRaw.slice(0, -1) : tRaw;
                return { name: n, type, nullable: !req };
            });

    const toIndexesString = (idx = []) =>
        idx
            .map((i) => `${i.name}(${i.columns || ""})`)
            .join(", ");

    const fromIndexesString = (s) =>
        (s || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
            .map((chunk) => {
                const name = chunk.split("(")[0]?.trim();
                const columns = chunk.match(/\((.*)\)/)?.[1]?.trim() || "";
                return { name, columns, type: "" };
            });

    const setRow = (i, patch) => {
        const copy = [...value];
        copy[i] = { ...copy[i], ...patch };
        onChange(copy);
    };
    const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

    return (
        <div className="overflow-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2 pr-3">Entity</th>
                        <th className="py-2 pr-3">Table</th>
                        <th className="py-2 pr-3">Description</th>
                        <th className="py-2 pr-3">Fields</th>
                        <th className="py-2 pr-3">Indexes</th>
                        <th className="py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {value.map((e, i) => (
                        <tr key={i} className="border-t align-top">
                            <td className="py-2 pr-3">
                                <input
                                    className="w-40 rounded border px-2 py-1"
                                    value={e.name}
                                    onChange={(ev) => setRow(i, { name: ev.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-40 rounded border px-2 py-1 font-mono"
                                    value={e.table}
                                    onChange={(ev) => setRow(i, { table: ev.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-64 rounded border px-2 py-1"
                                    value={e.description || ""}
                                    onChange={(ev) => setRow(i, { description: ev.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-72 rounded border px-2 py-1 font-mono"
                                    placeholder="id:uuid!, project_id:uuid, title:text"
                                    value={toFieldsString(e.fields)}
                                    onChange={(ev) => setRow(i, { fields: fromFieldsString(ev.target.value) })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-72 rounded border px-2 py-1 font-mono"
                                    placeholder="tasks_pkey(id), idx_tasks_project(project_id)"
                                    value={toIndexesString(e.indexes)}
                                    onChange={(ev) => setRow(i, { indexes: fromIndexesString(ev.target.value) })}
                                />
                            </td>
                            <td className="py-2">
                                <RowBtn onClick={() => remove(i)}>Remove</RowBtn>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3">
                <RowBtn onClick={add}>Add entity</RowBtn>
            </div>
        </div>
    );
}

/* ---------- main section ---------- */
export default function Database() {
    const { selected, updateSection } = useProjectHub();

    const saved = useMemo(
        () =>
            selected?.sections?.database &&
                typeof selected.sections.database === "object"
                ? selected.sections.database
                : databaseDefault,
        [selected]
    );

    const [mode, setMode] = useState("read");
    const [form, setForm] = useState(databaseDefault);

    useEffect(() => {
        setForm(saved || databaseDefault);
        setMode("read");
    }, [saved, selected?.id]);

    const onChange = (patch) => setForm((f) => ({ ...f, ...patch }));
    const onSave = () => {
        updateSection("database", form);
        setMode("read");
    };

    if (!selected) {
        return (
            <div className="rounded-lg border bg-white p-8 text-gray-600">
                Create or select a project on the left to manage <strong>Database</strong>.
            </div>
        );
    }

    /* ---------- READ MODE ---------- */
    if (mode === "read") {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Database</h3>
                    <IconButton onClick={() => setMode("edit")}>Edit</IconButton>
                </div>

                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Overview</h4>
                    <p className="text-sm whitespace-pre-line">{form.overview || "—"}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Engines</h4>
                        {form.engines?.length ? (
                            <ul className="text-sm space-y-2">
                                {form.engines.map((e, i) => (
                                    <li key={i} className="break-words">
                                        <span className="font-medium">{e.label || "Engine"}</span>{" "}
                                        — {e.type || "Type"} {e.version ? `(${e.version})` : ""} —{" "}
                                        {e.host || ""}{e.port ? `:${e.port}` : ""} {e.dbName ? `/${e.dbName}` : ""}
                                        {e.url && (
                                            <>
                                                {" "}(
                                                <a
                                                    className="text-blue-700 hover:underline"
                                                    href={e.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    url
                                                </a>
                                                )
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>

                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Schemas</h4>
                        {form.schemas?.length ? (
                            <ul className="text-sm list-disc pl-5">
                                {form.schemas.map((s, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{s.name || "Schema"}</span>{" "}
                                        — {s.description || "—"}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>
                </div>

                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Entities</h4>
                    {form.entities?.length ? (
                        <div className="overflow-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500">
                                        <th className="py-2 pr-3">Entity</th>
                                        <th className="py-2 pr-3">Table</th>
                                        <th className="py-2 pr-3">Fields</th>
                                        <th className="py-2 pr-3">Indexes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.entities.map((e, i) => (
                                        <tr key={i} className="border-t align-top">
                                            <td className="py-2 pr-3">
                                                <span className="font-medium">{e.name || "—"}</span>
                                                <div className="text-gray-500">{e.description || ""}</div>
                                            </td>
                                            <td className="py-2 pr-3 font-mono">{e.table || "—"}</td>
                                            <td className="py-2 pr-3">
                                                {(e.fields || []).length
                                                    ? e.fields.map((f) => `${f.name}:${f.type}${f.nullable === false || f.pk ? "!" : ""}`).join(", ")
                                                    : "—"}
                                            </td>
                                            <td className="py-2 pr-3">
                                                {(e.indexes || []).length
                                                    ? e.indexes.map((ix) => `${ix.name}(${ix.columns})`).join(", ")
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">—</p>
                    )}
                </div>

                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Relationships</h4>
                    {form.relationships?.length ? (
                        <ul className="text-sm list-disc pl-5">
                            {form.relationships.map((r, i) => (
                                <li key={i}>
                                    {r.from || "?"} → {r.to || "?"} ({r.type || "relation"}){" "}
                                    {r.onDelete ? `onDelete=${r.onDelete}` : ""}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">—</p>
                    )}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Backups</h4>
                        <ul className="text-sm">
                            <li>Enabled: {form.backups.enabled ? "Yes" : "No"}</li>
                            <li>Schedule: {form.backups.schedule || "—"}</li>
                            <li>Retention: {form.backups.retentionDays || "—"} days</li>
                            <li>Location: {form.backups.location || "—"}</li>
                            <li>Restore tests: {form.backups.restoreTestCadence || "—"}</li>
                        </ul>
                    </div>
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Performance</h4>
                        <ul className="text-sm">
                            <li>Pool: {form.performance.poolMin}-{form.performance.poolMax}</li>
                            <li>Timeout: {form.performance.timeoutMs} ms</li>
                            <li>Read replicas: {form.performance.readReplicas}</li>
                            <li>Partitioning: {form.performance.partitioning || "—"}</li>
                            <li>Sharding: {form.performance.sharding || "—"}</li>
                            <li>Caching: {form.performance.cachingLayer || "—"}</li>
                        </ul>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Security</h4>
                        <ul className="text-sm">
                            <li>At rest: {form.security.atRest ? "Yes" : "No"}</li>
                            <li>In transit: {form.security.inTransit ? "Yes" : "No"}</li>
                            <li>RLS: {form.security.rowLevelSecurity ? "Enabled" : "Disabled"}</li>
                            <li>Access model: {form.security.accessModel || "—"}</li>
                            <li>PII tables: {(form.security.piiTables || []).join(", ") || "—"}</li>
                        </ul>
                    </div>
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Data retention</h4>
                        {form.dataRetention?.length ? (
                            <ul className="text-sm list-disc pl-5">
                                {form.dataRetention.map((r, i) => (
                                    <li key={i}>
                                        {r.table || "table"} — {r.retention || "—"} {r.policy ? `(${r.policy})` : ""}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>
                </div>

                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Queries of interest</h4>
                    {form.queriesOfInterest?.length ? (
                        <ul className="text-sm space-y-3">
                            {form.queriesOfInterest.map((q, i) => (
                                <li key={i}>
                                    <div className="font-medium">{q.name || "Query"}</div>
                                    <pre className="bg-gray-50 rounded p-2 text-xs overflow-auto">
                                        {q.sql || ""}
                                    </pre>
                                    {q.notes && <div className="text-gray-500 text-xs mt-1">{q.notes}</div>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">—</p>
                    )}
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Migrations</h4>
                        <ul className="text-sm">
                            <li>Tool: {form.migrations.tool || "—"}</li>
                            <li>Path: {form.migrations.path || "—"}</li>
                            <li>Notes: {form.migrations.notes || "—"}</li>
                        </ul>
                    </div>
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Incidents</h4>
                        {form.incidents?.length ? (
                            <ul className="text-sm list-disc pl-5">
                                {form.incidents.map((r, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{r.date || "date"}</span> — {r.summary || "—"}
                                        {r.actionItems ? ` (actions: ${r.actionItems})` : ""}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>
                </div>

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

    /* ---------- EDIT MODE ---------- */
    return (
        <form
            className="space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                onSave();
            }}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Edit Database</h3>
                <div className="flex gap-2">
                    <IconButton onClick={() => setMode("read")}>Cancel</IconButton>
                    <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">
                        Save
                    </button>
                </div>
            </div>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Overview</h4>
                <textarea
                    rows={3}
                    className="w-full rounded border px-3 py-2"
                    value={form.overview}
                    onChange={(e) => onChange({ overview: e.target.value })}
                    placeholder="High-level DB strategy, OLTP/OLAP split, multi-tenant notes…"
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Engines</h4>
                <SimpleListEditor
                    value={form.engines}
                    onChange={(v) => onChange({ engines: v })}
                    columns={[
                        { key: "label", label: "Label" },
                        { key: "type", label: "Type" },
                        { key: "version", label: "Version" },
                        { key: "host", label: "Host" },
                        { key: "port", label: "Port" },
                        { key: "dbName", label: "DB" },
                        { key: "user", label: "User" },
                        { key: "url", label: "URL" },
                    ]}
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Schemas</h4>
                <SimpleListEditor
                    value={form.schemas}
                    onChange={(v) => onChange({ schemas: v })}
                    columns={[
                        { key: "name", label: "Name" },
                        { key: "description", label: "Description" },
                    ]}
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Entities</h4>
                <EntitiesEditor
                    value={form.entities}
                    onChange={(v) => onChange({ entities: v })}
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Relationships</h4>
                <SimpleListEditor
                    value={form.relationships}
                    onChange={(v) => onChange({ relationships: v })}
                    columns={[
                        { key: "from", label: "From" },
                        { key: "to", label: "To" },
                        { key: "type", label: "Type" },
                        { key: "onDelete", label: "onDelete" },
                    ]}
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Migrations</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Tool</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.migrations.tool}
                            onChange={(e) => onChange({ migrations: { ...form.migrations, tool: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Path</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.migrations.path}
                            onChange={(e) => onChange({ migrations: { ...form.migrations, path: e.target.value } })}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-sm text-gray-600 mb-1">Notes</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.migrations.notes}
                            onChange={(e) => onChange({ migrations: { ...form.migrations, notes: e.target.value } })}
                        />
                    </div>
                </div>
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Performance</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Pool min</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.performance.poolMin}
                            onChange={(e) => onChange({ performance: { ...form.performance, poolMin: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Pool max</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.performance.poolMax}
                            onChange={(e) => onChange({ performance: { ...form.performance, poolMax: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Timeout (ms)</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.performance.timeoutMs}
                            onChange={(e) => onChange({ performance: { ...form.performance, timeoutMs: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Read replicas</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.performance.readReplicas}
                            onChange={(e) => onChange({ performance: { ...form.performance, readReplicas: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Partitioning</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.performance.partitioning}
                            onChange={(e) => onChange({ performance: { ...form.performance, partitioning: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Sharding</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.performance.sharding}
                            onChange={(e) => onChange({ performance: { ...form.performance, sharding: e.target.value } })}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-sm text-gray-600 mb-1">Caching layer</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.performance.cachingLayer}
                            onChange={(e) => onChange({ performance: { ...form.performance, cachingLayer: e.target.value } })}
                        />
                    </div>
                </div>
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Backups</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!form.backups.enabled}
                            onChange={(e) => onChange({ backups: { ...form.backups, enabled: e.target.checked } })}
                        />
                        <span className="text-sm">Enabled</span>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Schedule</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.backups.schedule}
                            onChange={(e) => onChange({ backups: { ...form.backups, schedule: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Retention (days)</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.backups.retentionDays}
                            onChange={(e) => onChange({ backups: { ...form.backups, retentionDays: e.target.value } })}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-sm text-gray-600 mb-1">Location</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.backups.location}
                            onChange={(e) => onChange({ backups: { ...form.backups, location: e.target.value } })}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-sm text-gray-600 mb-1">Restore test cadence</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.backups.restoreTestCadence}
                            onChange={(e) => onChange({ backups: { ...form.backups, restoreTestCadence: e.target.value } })}
                        />
                    </div>
                </div>
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Data retention</h4>
                <SimpleListEditor
                    value={form.dataRetention}
                    onChange={(v) => onChange({ dataRetention: v })}
                    columns={[
                        { key: "table", label: "Table" },
                        { key: "retention", label: "Retention" },
                        { key: "policy", label: "Policy/notes" },
                    ]}
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Security</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!form.security.atRest}
                            onChange={(e) => onChange({ security: { ...form.security, atRest: e.target.checked } })}
                        />
                        <span className="text-sm">Encryption at rest</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!form.security.inTransit}
                            onChange={(e) => onChange({ security: { ...form.security, inTransit: e.target.checked } })}
                        />
                        <span className="text-sm">Encryption in transit</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!form.security.rowLevelSecurity}
                            onChange={(e) => onChange({ security: { ...form.security, rowLevelSecurity: e.target.checked } })}
                        />
                        <span className="text-sm">Row-level security</span>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Access model</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.security.accessModel}
                            onChange={(e) => onChange({ security: { ...form.security, accessModel: e.target.value } })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">PII tables</label>
                        <ChipInput
                            value={form.security.piiTables || []}
                            onChange={(v) => onChange({ security: { ...form.security, piiTables: v } })}
                            placeholder="Add table and press Enter"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Queries of interest</h4>
                <SimpleListEditor
                    value={form.queriesOfInterest}
                    onChange={(v) => onChange({ queriesOfInterest: v })}
                    columns={[
                        { key: "name", label: "Name" },
                        { key: "sql", label: "SQL" },
                        { key: "notes", label: "Notes" },
                    ]}
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Incidents</h4>
                <SimpleListEditor
                    value={form.incidents}
                    onChange={(v) => onChange({ incidents: v })}
                    columns={[
                        { key: "date", label: "Date" },
                        { key: "summary", label: "Summary" },
                        { key: "actionItems", label: "Action items" },
                    ]}
                />
            </section>

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
