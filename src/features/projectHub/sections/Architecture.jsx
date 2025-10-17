// src/features/projectHub/sections/Architecture.jsx
import React, { useEffect, useMemo, useState } from "react";
import useProjectHub from "../hooks/useProjectHub";
import IconButton from "../../../components/ui/IconButton";
import ChipInput from "../../../components/ui/typography/ChipInput";
import architectureDefault from "../constants/architectureDefault";

const RowBtn = ({ onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className="px-2 py-1 rounded border text-xs hover:bg-gray-50"
    >
        {children}
    </button>
);

/* ---------- small table editors ---------- */
function ServicesEditor({ value = [], onChange }) {
    const add = () =>
        onChange([
            ...value,
            { name: "", language: "", runtime: "", repoUrl: "", owner: "" },
        ]);
    const set = (i, patch) => {
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
                        <th className="py-2 pr-3">Name</th>
                        <th className="py-2 pr-3">Language</th>
                        <th className="py-2 pr-3">Runtime</th>
                        <th className="py-2 pr-3">Repo</th>
                        <th className="py-2 pr-3">Owner</th>
                        <th className="py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {value.map((s, i) => (
                        <tr key={i} className="border-t">
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1"
                                    value={s.name}
                                    onChange={(e) => set(i, { name: e.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1"
                                    value={s.language}
                                    onChange={(e) => set(i, { language: e.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1"
                                    value={s.runtime}
                                    onChange={(e) => set(i, { runtime: e.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1"
                                    value={s.repoUrl}
                                    onChange={(e) => set(i, { repoUrl: e.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1"
                                    value={s.owner}
                                    onChange={(e) => set(i, { owner: e.target.value })}
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
                <RowBtn onClick={add}>Add service</RowBtn>
            </div>
        </div>
    );
}

function ApiEditor({ value = [], onChange }) {
    const add = () =>
        onChange([
            ...value,
            {
                name: "",
                method: "GET",
                path: "",
                auth: "None",
                service: "",
                description: "",
            },
        ]);
    const set = (i, patch) => {
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
                        <th className="py-2 pr-3">Name</th>
                        <th className="py-2 pr-3">Method</th>
                        <th className="py-2 pr-3">Path</th>
                        <th className="py-2 pr-3">Auth</th>
                        <th className="py-2 pr-3">Service</th>
                        <th className="py-2 pr-3">Description</th>
                        <th className="py-2"></th>
                    </tr>
                </thead>
                <tbody>
                    {value.map((a, i) => (
                        <tr key={i} className="border-t">
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1"
                                    value={a.name}
                                    onChange={(e) => set(i, { name: e.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <select
                                    className="rounded border px-2 py-1"
                                    value={a.method}
                                    onChange={(e) => set(i, { method: e.target.value })}
                                >
                                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                                        <option key={m}>{m}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1 font-mono"
                                    value={a.path}
                                    onChange={(e) => set(i, { path: e.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <select
                                    className="rounded border px-2 py-1"
                                    value={a.auth}
                                    onChange={(e) => set(i, { auth: e.target.value })}
                                >
                                    {["None", "API Key", "OAuth2", "JWT"].map((m) => (
                                        <option key={m}>{m}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1"
                                    value={a.service}
                                    onChange={(e) => set(i, { service: e.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1"
                                    value={a.description}
                                    onChange={(e) => set(i, { description: e.target.value })}
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
                <RowBtn onClick={add}>Add API</RowBtn>
            </div>
        </div>
    );
}

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

/* ---------- main ---------- */
export default function Architecture() {
    const { selected, updateSection } = useProjectHub();

    const saved = useMemo(
        () =>
            selected?.sections?.architecture &&
                typeof selected.sections.architecture === "object"
                ? selected.sections.architecture
                : architectureDefault,
        [selected]
    );

    const [mode, setMode] = useState("read"); // 'read' | 'edit'
    const [form, setForm] = useState(architectureDefault);

    useEffect(() => {
        setForm(saved || architectureDefault);
        setMode("read");
    }, [saved, selected?.id]);

    const onChange = (patch) => setForm((f) => ({ ...f, ...patch }));
    const onSave = () => {
        updateSection("architecture", form);
        setMode("read");
    };

    if (!selected) {
        return (
            <div className="rounded-lg border bg-white p-8 text-gray-600">
                Create or select a project on the left to manage{" "}
                <strong>Architecture</strong>.
            </div>
        );
    }

    /* ---------- READ MODE ---------- */
    if (mode === "read") {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Architecture</h3>
                    <IconButton onClick={() => setMode("edit")}>Edit</IconButton>
                </div>

                {/* Overview & Diagrams */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Overview</h4>
                        <p className="text-sm whitespace-pre-line">
                            {form.overview || "—"}
                        </p>
                    </div>
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Diagrams</h4>
                        {form.diagrams?.length ? (
                            <ul className="text-sm list-disc pl-5">
                                {form.diagrams.map((d, i) => (
                                    <li key={i}>
                                        {d.label ? `${d.label}: ` : ""}
                                        {d.url ? (
                                            <a
                                                className="text-blue-700 hover:underline break-all"
                                                href={d.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {d.url}
                                            </a>
                                        ) : (
                                            "—"
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>
                </div>

                {/* Key resources */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Services</h4>
                        {form.services?.length ? (
                            <ul className="text-sm space-y-2">
                                {form.services.map((s, i) => (
                                    <li key={i} className="break-words">
                                        <span className="font-medium">{s.name || "Service"}</span>{" "}
                                        — {s.language || "?"} @ {s.runtime || "?"}
                                        {s.repoUrl && (
                                            <>
                                                {" "}
                                                (<a
                                                    className="text-blue-700 hover:underline"
                                                    href={s.repoUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    repo
                                                </a>
                                                )
                                            </>
                                        )}
                                        {s.owner ? ` — ${s.owner}` : ""}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>

                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Data stores</h4>
                        {form.dataStores?.length ? (
                            <ul className="text-sm space-y-2">
                                {form.dataStores.map((d, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{d.name || "Store"}</span>{" "}
                                        — {d.type || "Type"} {d.version ? `(${d.version})` : ""} —{" "}
                                        {d.purpose || "—"}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>
                </div>

                {/* APIs */}
                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">APIs</h4>
                    {form.apis?.length ? (
                        <div className="overflow-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500">
                                        <th className="py-2 pr-3">Name</th>
                                        <th className="py-2 pr-3">Method</th>
                                        <th className="py-2 pr-3">Path</th>
                                        <th className="py-2 pr-3">Auth</th>
                                        <th className="py-2 pr-3">Service</th>
                                        <th className="py-2 pr-3">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.apis.map((a, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="py-2 pr-3">{a.name || "—"}</td>
                                            <td className="py-2 pr-3">{a.method || "—"}</td>
                                            <td className="py-2 pr-3 font-mono">{a.path || "—"}</td>
                                            <td className="py-2 pr-3">{a.auth || "—"}</td>
                                            <td className="py-2 pr-3">{a.service || "—"}</td>
                                            <td className="py-2 pr-3">{a.description || "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">—</p>
                    )}
                </div>

                {/* Other lists */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Queues / streams</h4>
                        {form.queues?.length ? (
                            <ul className="text-sm list-disc pl-5">
                                {form.queues.map((q, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{q.name || "Queue"}</span> —{" "}
                                        {q.tech || "Tech"} — {q.purpose || "—"}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>

                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">3rd-party dependencies</h4>
                        {form.thirdParty?.length ? (
                            <ul className="text-sm list-disc pl-5">
                                {form.thirdParty.map((t, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{t.name || "Vendor"}</span> —{" "}
                                        {t.purpose || "—"}{" "}
                                        {t.docsUrl && (
                                            <a
                                                className="text-blue-700 hover:underline break-all ml-1"
                                                href={t.docsUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                docs
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>
                </div>

                {/* Ops & security */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Observability</h4>
                        <dl className="grid grid-cols-3 gap-y-2 text-sm">
                            <dt className="text-gray-500">Logs</dt>
                            <dd className="col-span-2">{form.observability.logs || "—"}</dd>
                            <dt className="text-gray-500">Metrics</dt>
                            <dd className="col-span-2">
                                {form.observability.metrics || "—"}
                            </dd>
                            <dt className="text-gray-500">Tracing</dt>
                            <dd className="col-span-2">
                                {form.observability.tracing || "—"}
                            </dd>
                            <dt className="text-gray-500">Dashboards</dt>
                            <dd className="col-span-2 break-all">
                                {form.observability.dashboardsUrl ? (
                                    <a
                                        className="text-blue-700 hover:underline"
                                        href={form.observability.dashboardsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {form.observability.dashboardsUrl}
                                    </a>
                                ) : (
                                    "—"
                                )}
                            </dd>
                            <dt className="text-gray-500">Alerts</dt>
                            <dd className="col-span-2 break-all">
                                {form.observability.alertsUrl ? (
                                    <a
                                        className="text-blue-700 hover:underline"
                                        href={form.observability.alertsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {form.observability.alertsUrl}
                                    </a>
                                ) : (
                                    "—"
                                )}
                            </dd>
                        </dl>
                    </div>

                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Security</h4>
                        <dl className="grid grid-cols-3 gap-y-2 text-sm">
                            <dt className="text-gray-500">At rest</dt>
                            <dd className="col-span-2">
                                {form.security.encryptionAtRest ? "Yes" : "No"}
                            </dd>
                            <dt className="text-gray-500">In transit</dt>
                            <dd className="col-span-2">
                                {form.security.encryptionInTransit ? "Yes" : "No"}
                            </dd>
                            <dt className="text-gray-500">Threat model</dt>
                            <dd className="col-span-2 break-all">
                                {form.security.threatModelUrl ? (
                                    <a
                                        className="text-blue-700 hover:underline"
                                        href={form.security.threatModelUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {form.security.threatModelUrl}
                                    </a>
                                ) : (
                                    "—"
                                )}
                            </dd>
                            <dt className="text-gray-500">Retention</dt>
                            <dd className="col-span-2">
                                {form.security.dataRetentionNotes || "—"}
                            </dd>
                            <dt className="text-gray-500">CORS</dt>
                            <dd className="col-span-2">{form.security.corsPolicy || "—"}</dd>
                            <dt className="text-gray-500">CSP</dt>
                            <dd className="col-span-2">{form.security.cspNotes || "—"}</dd>
                        </dl>
                    </div>
                </div>

                {/* Availability & scaling */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Availability</h4>
                        <ul className="text-sm">
                            <li>SLA: {form.availability.sla || "—"}</li>
                            <li>SLO: {form.availability.slo || "—"}</li>
                            <li>RPO: {form.availability.rpo || "—"}</li>
                            <li>RTO: {form.availability.rto || "—"}</li>
                        </ul>
                    </div>
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Scaling</h4>
                        <ul className="text-sm">
                            <li>Strategy: {form.scaling.strategy || "—"}</li>
                            <li>Autoscaling: {form.scaling.autoScaling ? "Yes" : "No"}</li>
                            <li>Notes: {form.scaling.notes || "—"}</li>
                        </ul>
                    </div>
                </div>

                {/* Decisions & Risks */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Architecture decisions</h4>
                        {form.decisions?.length ? (
                            <ul className="text-sm list-disc pl-5">
                                {form.decisions.map((d, i) => (
                                    <li key={i}>
                                        <span className="font-medium">
                                            {d.date ? `${d.date}: ` : ""}
                                            {d.title || "Decision"}
                                        </span>{" "}
                                        — {d.status || "Status"}{" "}
                                        {d.link && (
                                            <a
                                                className="text-blue-700 hover:underline ml-1 break-all"
                                                href={d.link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                link
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>

                    <div className="rounded border bg-white p-4">
                        <h4 className="font-semibold mb-2">Risks</h4>
                        {form.risks?.length ? (
                            <ul className="text-sm list-disc pl-5">
                                {form.risks.map((r, i) => (
                                    <li key={i}>
                                        <span className="font-medium">{r.risk || "Risk"}</span> —{" "}
                                        {r.mitigation || "Mitigation TBD"}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">—</p>
                        )}
                    </div>
                </div>

                {/* Tags */}
                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Tags</h4>
                    {form.tags?.length ? (
                        <div className="flex flex-wrap gap-2">
                            {form.tags.map((t) => (
                                <span
                                    key={t}
                                    className="px-2 py-1 rounded bg-gray-100 text-xs"
                                >
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
                <h3 className="text-xl font-semibold">Edit Architecture</h3>
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

            {/* Overview & diagrams */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Overview</h4>
                <textarea
                    rows={4}
                    className="w-full rounded border px-3 py-2"
                    value={form.overview}
                    onChange={(e) => onChange({ overview: e.target.value })}
                    placeholder="Brief description of the system, key components and how they interact…"
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Diagrams</h4>
                <SimpleListEditor
                    value={form.diagrams}
                    onChange={(v) => onChange({ diagrams: v })}
                    columns={[
                        { key: "label", label: "Label" },
                        { key: "url", label: "URL" },
                    ]}
                />
            </section>

            {/* Services */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Services</h4>
                <ServicesEditor
                    value={form.services}
                    onChange={(v) => onChange({ services: v })}
                />
            </section>

            {/* APIs */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">APIs</h4>
                <ApiEditor value={form.apis} onChange={(v) => onChange({ apis: v })} />
            </section>

            {/* Data stores */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Data stores</h4>
                <SimpleListEditor
                    value={form.dataStores}
                    onChange={(v) => onChange({ dataStores: v })}
                    columns={[
                        { key: "name", label: "Name" },
                        { key: "type", label: "Type" },
                        { key: "version", label: "Version" },
                        { key: "purpose", label: "Purpose" },
                    ]}
                />
            </section>

            {/* Queues / streams */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Queues / streams</h4>
                <SimpleListEditor
                    value={form.queues}
                    onChange={(v) => onChange({ queues: v })}
                    columns={[
                        { key: "name", label: "Name" },
                        { key: "tech", label: "Tech" },
                        { key: "purpose", label: "Purpose" },
                    ]}
                />
            </section>

            {/* Third-party */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">3rd-party dependencies</h4>
                <SimpleListEditor
                    value={form.thirdParty}
                    onChange={(v) => onChange({ thirdParty: v })}
                    columns={[
                        { key: "name", label: "Name" },
                        { key: "purpose", label: "Purpose" },
                        { key: "docsUrl", label: "Docs URL" },
                    ]}
                />
            </section>

            {/* Observability */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Observability</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Logs</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.observability.logs}
                            onChange={(e) =>
                                onChange({
                                    observability: {
                                        ...form.observability,
                                        logs: e.target.value,
                                    },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Metrics</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.observability.metrics}
                            onChange={(e) =>
                                onChange({
                                    observability: {
                                        ...form.observability,
                                        metrics: e.target.value,
                                    },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Tracing</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.observability.tracing}
                            onChange={(e) =>
                                onChange({
                                    observability: {
                                        ...form.observability,
                                        tracing: e.target.value,
                                    },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Dashboards URL
                        </label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.observability.dashboardsUrl}
                            onChange={(e) =>
                                onChange({
                                    observability: {
                                        ...form.observability,
                                        dashboardsUrl: e.target.value,
                                    },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Alerts URL
                        </label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.observability.alertsUrl}
                            onChange={(e) =>
                                onChange({
                                    observability: {
                                        ...form.observability,
                                        alertsUrl: e.target.value,
                                    },
                                })
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Security */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Security</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!form.security.encryptionAtRest}
                            onChange={(e) =>
                                onChange({
                                    security: {
                                        ...form.security,
                                        encryptionAtRest: e.target.checked,
                                    },
                                })
                            }
                        />
                        <span className="text-sm">Encryption at rest</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!form.security.encryptionInTransit}
                            onChange={(e) =>
                                onChange({
                                    security: {
                                        ...form.security,
                                        encryptionInTransit: e.target.checked,
                                    },
                                })
                            }
                        />
                        <span className="text-sm">Encryption in transit</span>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Threat model URL
                        </label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.security.threatModelUrl}
                            onChange={(e) =>
                                onChange({
                                    security: {
                                        ...form.security,
                                        threatModelUrl: e.target.value,
                                    },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Data retention notes
                        </label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.security.dataRetentionNotes}
                            onChange={(e) =>
                                onChange({
                                    security: {
                                        ...form.security,
                                        dataRetentionNotes: e.target.value,
                                    },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            CORS policy
                        </label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.security.corsPolicy}
                            onChange={(e) =>
                                onChange({
                                    security: { ...form.security, corsPolicy: e.target.value },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">CSP</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.security.cspNotes}
                            onChange={(e) =>
                                onChange({
                                    security: { ...form.security, cspNotes: e.target.value },
                                })
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Availability & Scaling */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Availability</h4>
                <div className="grid md:grid-cols-4 gap-4">
                    {["sla", "slo", "rpo", "rto"].map((k) => (
                        <div key={k}>
                            <label className="block text-sm text-gray-600 mb-1 uppercase">
                                {k}
                            </label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={form.availability[k] || ""}
                                onChange={(e) =>
                                    onChange({
                                        availability: {
                                            ...form.availability,
                                            [k]: e.target.value,
                                        },
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Scaling</h4>
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Strategy
                        </label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={form.scaling.strategy}
                            onChange={(e) =>
                                onChange({
                                    scaling: { ...form.scaling, strategy: e.target.value },
                                })
                            }
                        >
                            <option>Horizontal</option>
                            <option>Vertical</option>
                            <option>Mixed</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={!!form.scaling.autoScaling}
                            onChange={(e) =>
                                onChange({
                                    scaling: { ...form.scaling, autoScaling: e.target.checked },
                                })
                            }
                        />
                        <span className="text-sm">Enable autoscaling</span>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Notes</label>
                        <input
                            className="w-full rounded border px-3 py-2"
                            value={form.scaling.notes}
                            onChange={(e) =>
                                onChange({
                                    scaling: { ...form.scaling, notes: e.target.value },
                                })
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Decisions, Risks, Tags */}
            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Architecture decisions (ADR)</h4>
                <SimpleListEditor
                    value={form.decisions}
                    onChange={(v) => onChange({ decisions: v })}
                    columns={[
                        { key: "date", label: "Date" },
                        { key: "title", label: "Title" },
                        { key: "status", label: "Status" },
                        { key: "link", label: "Link" },
                    ]}
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Risks</h4>
                <SimpleListEditor
                    value={form.risks}
                    onChange={(v) => onChange({ risks: v })}
                    columns={[
                        { key: "risk", label: "Risk" },
                        { key: "mitigation", label: "Mitigation" },
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
