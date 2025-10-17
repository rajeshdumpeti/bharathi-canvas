import React, { useEffect, useMemo, useState } from "react";
import useProjectHub from "../hooks/useProjectHub";
import IconButton from "../../../components/ui/IconButton";
import ChipInput from "../../../components/ui/typography/ChipInput";
import defaultDeploymentGuide from "../constants/defaultDeploymentGuide";

/* Local tiny helpers (kept simple & self-contained) */
const RowBtn = ({ onClick, children }) => (
    <button
        type="button"
        onClick={onClick}
        className="px-2 py-1 rounded border text-xs hover:bg-gray-50"
    >
        {children}
    </button>
);

function EnvVarTable({ value = [], onChange }) {
    const set = (i, patch) => {
        const copy = [...value];
        copy[i] = { ...copy[i], ...patch };
        onChange(copy);
    };
    const add = () =>
        onChange([...value, { key: "", value: "", secret: false }]);
    const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

    return (
        <div className="overflow-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500">
                        <th className="py-2 pr-3">Key</th>
                        <th className="py-2 pr-3">Value</th>
                        <th className="py-2 pr-3">Secret</th>
                        <th className="py-2" />
                    </tr>
                </thead>
                <tbody>
                    {value.map((row, i) => (
                        <tr key={i} className="border-t">
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1 font-mono"
                                    value={row.key}
                                    onChange={(e) => set(i, { key: e.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <input
                                    className="w-full rounded border px-2 py-1 font-mono"
                                    value={row.value}
                                    onChange={(e) => set(i, { value: e.target.value })}
                                />
                            </td>
                            <td className="py-2 pr-3">
                                <select
                                    className="rounded border px-2 py-1"
                                    value={row.secret ? "yes" : "no"}
                                    onChange={(e) => set(i, { secret: e.target.value === "yes" })}
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </td>
                            <td className="py-2">
                                <RowBtn onClick={() => remove(i)}>Remove</RowBtn>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3">
                <RowBtn onClick={add}>Add variable</RowBtn>
            </div>
        </div>
    );
}

export default function Deployment() {
    const { selected, updateSection } = useProjectHub();

    const saved = useMemo(
        () =>
            selected?.sections?.deployment &&
                typeof selected.sections.deployment === "object"
                ? selected.sections.deployment
                : defaultDeploymentGuide,
        [selected]
    );

    const [mode, setMode] = useState("read");
    const [form, setForm] = useState(defaultDeploymentGuide);

    useEffect(() => {
        setForm(saved || defaultDeploymentGuide);
        setMode("read");
    }, [saved, selected?.id]);

    const onChange = (patch) => setForm((f) => ({ ...f, ...patch }));
    const setEnv = (key, patch) =>
        onChange({
            environments: form.environments.map((e) =>
                e.key === key ? { ...e, ...patch } : e
            ),
        });

    const onSave = () => {
        updateSection("deployment", form);
        setMode("read");
    };

    if (!selected) {
        return (
            <div className="rounded-lg border bg-white p-8 text-gray-600">
                Create or select a project on the left to manage the{" "}
                <strong>Deployment guide</strong>.
            </div>
        );
    }

    /* READ MODE */
    if (mode === "read") {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Deployment guide</h3>
                    <IconButton onClick={() => setMode("edit")}>Edit</IconButton>
                </div>

                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Overview</h4>
                    <p className="text-sm whitespace-pre-line">
                        {form.overview || "—"}
                    </p>
                </div>

                <div className="rounded border bg-white p-4">
                    <h4 className="font-semibold mb-2">Global</h4>
                    <dl className="grid grid-cols-3 gap-y-2 text-sm">
                        <dt className="text-gray-500">Repository</dt>
                        <dd className="col-span-2 break-all">
                            {form.global.repository ? (
                                <a
                                    className="text-blue-700 hover:underline"
                                    href={form.global.repository}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {form.global.repository}
                                </a>
                            ) : (
                                "—"
                            )}
                        </dd>
                        <dt className="text-gray-500">Pipeline</dt>
                        <dd className="col-span-2">{form.global.pipeline || "—"}</dd>
                        <dt className="text-gray-500">Artifact registry</dt>
                        <dd className="col-span-2">
                            {form.global.artifactRegistry || "—"}
                        </dd>
                        <dt className="text-gray-500">Runtime</dt>
                        <dd className="col-span-2">{form.global.runtimeNotes || "—"}</dd>
                        <dt className="text-gray-500">On-call</dt>
                        <dd className="col-span-2">{form.global.onCallContact || "—"}</dd>
                    </dl>
                </div>

                {/* Environments */}
                {form.environments.map((env) => (
                    <div key={env.key} className="rounded border bg-white p-4 space-y-4">
                        <h4 className="font-semibold text-lg">{env.label}</h4>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="rounded border p-3">
                                <div className="text-xs text-gray-500 mb-1">App URL</div>
                                <div className="break-all">
                                    {env.domains.app ? (
                                        <a
                                            className="text-blue-700 hover:underline"
                                            href={env.domains.app}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {env.domains.app}
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mt-2 mb-1">API URL</div>
                                <div className="break-all">
                                    {env.domains.api ? (
                                        <a
                                            className="text-blue-700 hover:underline"
                                            href={env.domains.api}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {env.domains.api}
                                        </a>
                                    ) : (
                                        "—"
                                    )}
                                </div>
                            </div>

                            <div className="rounded border p-3">
                                <div className="font-semibold mb-2">Frontend</div>
                                <dl className="grid grid-cols-3 gap-y-1 text-sm">
                                    <dt className="text-gray-500">Build</dt>
                                    <dd className="col-span-2 font-mono">
                                        {env.frontend.buildCmd || "—"}
                                    </dd>
                                    <dt className="text-gray-500">Deploy</dt>
                                    <dd className="col-span-2 font-mono">
                                        {env.frontend.deployCmd || "—"}
                                    </dd>
                                    <dt className="text-gray-500">CDN</dt>
                                    <dd className="col-span-2">{env.frontend.cdn || "—"}</dd>
                                </dl>
                                {env.frontend.notes ? (
                                    <p className="text-xs text-gray-600 mt-2">{env.frontend.notes}</p>
                                ) : null}
                            </div>

                            <div className="rounded border p-3">
                                <div className="font-semibold mb-2">Backend</div>
                                <dl className="grid grid-cols-3 gap-y-1 text-sm">
                                    <dt className="text-gray-500">Runtime</dt>
                                    <dd className="col-span-2">{env.backend.runtime || "—"}</dd>
                                    <dt className="text-gray-500">Build</dt>
                                    <dd className="col-span-2 font-mono">
                                        {env.backend.buildCmd || "—"}
                                    </dd>
                                    <dt className="text-gray-500">Migrations</dt>
                                    <dd className="col-span-2 font-mono">
                                        {env.backend.migrationsCmd || "—"}
                                    </dd>
                                    <dt className="text-gray-500">Deploy</dt>
                                    <dd className="col-span-2 font-mono">
                                        {env.backend.deployCmd || "—"}
                                    </dd>
                                </dl>
                                {env.backend.notes ? (
                                    <p className="text-xs text-gray-600 mt-2">{env.backend.notes}</p>
                                ) : null}
                            </div>

                            <div className="rounded border p-3">
                                <div className="font-semibold mb-2">Database</div>
                                <dl className="grid grid-cols-3 gap-y-1 text-sm">
                                    <dt className="text-gray-500">Engine</dt>
                                    <dd className="col-span-2">{env.database.engine || "—"}</dd>
                                    <dt className="text-gray-500">Host</dt>
                                    <dd className="col-span-2 break-all">
                                        {env.database.host || "—"}
                                    </dd>
                                    <dt className="text-gray-500">Name</dt>
                                    <dd className="col-span-2">{env.database.name || "—"}</dd>
                                    <dt className="text-gray-500">Backups</dt>
                                    <dd className="col-span-2">
                                        {env.database.backupPolicy || "—"}
                                    </dd>
                                </dl>
                                {env.database.notes ? (
                                    <p className="text-xs text-gray-600 mt-2">{env.database.notes}</p>
                                ) : null}
                            </div>
                        </div>

                        <div className="rounded border p-3">
                            <div className="font-semibold mb-2">Environment variables</div>
                            {env.envVars?.length ? (
                                <div className="overflow-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="text-left text-gray-500">
                                                <th className="py-2 pr-3">Key</th>
                                                <th className="py-2 pr-3">Value</th>
                                                <th className="py-2 pr-3">Secret</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {env.envVars.map((v, i) => (
                                                <tr key={i} className="border-t">
                                                    <td className="py-2 pr-3 font-mono">{v.key || "—"}</td>
                                                    <td className="py-2 pr-3 font-mono">{v.value || "—"}</td>
                                                    <td className="py-2 pr-3">{v.secret ? "Yes" : "No"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">—</p>
                            )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="rounded border p-3">
                                <div className="font-semibold mb-2">Pre-deployment checks</div>
                                {(env.preChecks || []).length ? (
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        {env.preChecks.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">—</p>
                                )}
                            </div>

                            <div className="rounded border p-3">
                                <div className="font-semibold mb-2">Post-deployment checks</div>
                                {(env.postChecks || []).length ? (
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                        {env.postChecks.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">—</p>
                                )}
                            </div>

                            <div className="rounded border p-3">
                                <div className="font-semibold mb-2">Rollback</div>
                                <dl className="grid grid-cols-3 gap-y-1 text-sm">
                                    <dt className="text-gray-500">Strategy</dt>
                                    <dd className="col-span-2">{env.rollback.strategy || "—"}</dd>
                                    <dt className="text-gray-500">Command</dt>
                                    <dd className="col-span-2 font-mono">
                                        {env.rollback.command || "—"}
                                    </dd>
                                </dl>
                                {env.rollback.notes ? (
                                    <p className="text-xs text-gray-600 mt-2">{env.rollback.notes}</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        );
    }

    /* EDIT MODE */
    return (
        <form
            className="space-y-6"
            onSubmit={(e) => {
                e.preventDefault();
                onSave();
            }}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Edit Deployment guide</h3>
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
                    placeholder="Summarize how we deploy, verify, and roll back."
                />
            </section>

            <section className="rounded border bg-white p-4">
                <h4 className="font-semibold mb-3">Global</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        className="rounded border px-3 py-2"
                        placeholder="Repository URL"
                        value={form.global.repository}
                        onChange={(e) => onChange({ global: { ...form.global, repository: e.target.value } })}
                    />
                    <input
                        className="rounded border px-3 py-2"
                        placeholder="Pipeline (e.g. GH Actions workflow)"
                        value={form.global.pipeline}
                        onChange={(e) => onChange({ global: { ...form.global, pipeline: e.target.value } })}
                    />
                    <input
                        className="rounded border px-3 py-2"
                        placeholder="Artifact registry"
                        value={form.global.artifactRegistry}
                        onChange={(e) => onChange({ global: { ...form.global, artifactRegistry: e.target.value } })}
                    />
                    <input
                        className="rounded border px-3 py-2"
                        placeholder="Runtime notes"
                        value={form.global.runtimeNotes}
                        onChange={(e) => onChange({ global: { ...form.global, runtimeNotes: e.target.value } })}
                    />
                    <input
                        className="rounded border px-3 py-2 md:col-span-2"
                        placeholder="On-call contact (name/email/slack)"
                        value={form.global.onCallContact}
                        onChange={(e) => onChange({ global: { ...form.global, onCallContact: e.target.value } })}
                    />
                </div>
            </section>

            {form.environments.map((env) => (
                <section key={env.key} className="rounded border bg-white p-4 space-y-4">
                    <h4 className="font-semibold text-lg">{env.label}</h4>

                    {/* URLs */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <input
                            className="rounded border px-3 py-2"
                            placeholder="App URL"
                            value={env.domains.app}
                            onChange={(e) => setEnv(env.key, { domains: { ...env.domains, app: e.target.value } })}
                        />
                        <input
                            className="rounded border px-3 py-2"
                            placeholder="API URL"
                            value={env.domains.api}
                            onChange={(e) => setEnv(env.key, { domains: { ...env.domains, api: e.target.value } })}
                        />
                    </div>

                    {/* Frontend */}
                    <div className="rounded border p-3 space-y-2">
                        <div className="font-semibold">Frontend</div>
                        <div className="grid md:grid-cols-2 gap-3">
                            <input
                                className="rounded border px-3 py-2 font-mono"
                                placeholder="Build command"
                                value={env.frontend.buildCmd}
                                onChange={(e) =>
                                    setEnv(env.key, { frontend: { ...env.frontend, buildCmd: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2 font-mono"
                                placeholder="Deploy command"
                                value={env.frontend.deployCmd}
                                onChange={(e) =>
                                    setEnv(env.key, { frontend: { ...env.frontend, deployCmd: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2"
                                placeholder="Artifact (optional)"
                                value={env.frontend.artifact}
                                onChange={(e) =>
                                    setEnv(env.key, { frontend: { ...env.frontend, artifact: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2"
                                placeholder="CDN (optional)"
                                value={env.frontend.cdn}
                                onChange={(e) =>
                                    setEnv(env.key, { frontend: { ...env.frontend, cdn: e.target.value } })
                                }
                            />
                            <textarea
                                rows={2}
                                className="md:col-span-2 rounded border px-3 py-2"
                                placeholder="Notes"
                                value={env.frontend.notes}
                                onChange={(e) =>
                                    setEnv(env.key, { frontend: { ...env.frontend, notes: e.target.value } })
                                }
                            />
                        </div>
                    </div>

                    {/* Backend */}
                    <div className="rounded border p-3 space-y-2">
                        <div className="font-semibold">Backend</div>
                        <div className="grid md:grid-cols-2 gap-3">
                            <input
                                className="rounded border px-3 py-2"
                                placeholder="Runtime (e.g. FastAPI / Uvicorn)"
                                value={env.backend.runtime}
                                onChange={(e) =>
                                    setEnv(env.key, { backend: { ...env.backend, runtime: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2 font-mono"
                                placeholder="Build command"
                                value={env.backend.buildCmd}
                                onChange={(e) =>
                                    setEnv(env.key, { backend: { ...env.backend, buildCmd: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2 font-mono"
                                placeholder="Migrations command"
                                value={env.backend.migrationsCmd}
                                onChange={(e) =>
                                    setEnv(env.key, { backend: { ...env.backend, migrationsCmd: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2 font-mono"
                                placeholder="Deploy command"
                                value={env.backend.deployCmd}
                                onChange={(e) =>
                                    setEnv(env.key, { backend: { ...env.backend, deployCmd: e.target.value } })
                                }
                            />
                            <textarea
                                rows={2}
                                className="md:col-span-2 rounded border px-3 py-2"
                                placeholder="Notes"
                                value={env.backend.notes}
                                onChange={(e) =>
                                    setEnv(env.key, { backend: { ...env.backend, notes: e.target.value } })
                                }
                            />
                        </div>
                    </div>

                    {/* Database */}
                    <div className="rounded border p-3 space-y-2">
                        <div className="font-semibold">Database</div>
                        <div className="grid md:grid-cols-2 gap-3">
                            <input
                                className="rounded border px-3 py-2"
                                placeholder="Engine (e.g. PostgreSQL)"
                                value={env.database.engine}
                                onChange={(e) =>
                                    setEnv(env.key, { database: { ...env.database, engine: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2"
                                placeholder="Version"
                                value={env.database.version}
                                onChange={(e) =>
                                    setEnv(env.key, { database: { ...env.database, version: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2"
                                placeholder="Host"
                                value={env.database.host}
                                onChange={(e) =>
                                    setEnv(env.key, { database: { ...env.database, host: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2"
                                placeholder="DB name"
                                value={env.database.name}
                                onChange={(e) =>
                                    setEnv(env.key, { database: { ...env.database, name: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2"
                                placeholder="DB user"
                                value={env.database.user}
                                onChange={(e) =>
                                    setEnv(env.key, { database: { ...env.database, user: e.target.value } })
                                }
                            />
                            <input
                                className="rounded border px-3 py-2"
                                placeholder="Backup policy"
                                value={env.database.backupPolicy}
                                onChange={(e) =>
                                    setEnv(env.key, { database: { ...env.database, backupPolicy: e.target.value } })
                                }
                            />
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-600 mr-2">Read replicas</label>
                                <select
                                    className="rounded border px-2 py-1"
                                    value={env.database.readReplicas ? "yes" : "no"}
                                    onChange={(e) =>
                                        setEnv(env.key, {
                                            database: { ...env.database, readReplicas: e.target.value === "yes" },
                                        })
                                    }
                                >
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                            <textarea
                                rows={2}
                                className="md:col-span-2 rounded border px-3 py-2"
                                placeholder="Notes"
                                value={env.database.notes}
                                onChange={(e) =>
                                    setEnv(env.key, { database: { ...env.database, notes: e.target.value } })
                                }
                            />
                        </div>
                    </div>

                    {/* Env vars */}
                    <div className="rounded border p-3">
                        <div className="font-semibold mb-2">Environment variables</div>
                        <EnvVarTable
                            value={env.envVars}
                            onChange={(v) => setEnv(env.key, { envVars: v })}
                        />
                    </div>

                    {/* Checks */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="rounded border p-3">
                            <div className="font-semibold mb-2">Pre-deployment checks</div>
                            <ChipInput
                                value={env.preChecks || []}
                                onChange={(v) => setEnv(env.key, { preChecks: v })}
                                placeholder="Add check and press Enter"
                            />
                        </div>
                        <div className="rounded border p-3">
                            <div className="font-semibold mb-2">Post-deployment checks</div>
                            <ChipInput
                                value={env.postChecks || []}
                                onChange={(v) => setEnv(env.key, { postChecks: v })}
                                placeholder="Add check and press Enter"
                            />
                        </div>
                    </div>

                    {/* Rollback */}
                    <div className="rounded border p-3 grid md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Rollback strategy</label>
                            <input
                                className="w-full rounded border px-3 py-2"
                                value={env.rollback.strategy}
                                onChange={(e) =>
                                    setEnv(env.key, { rollback: { ...env.rollback, strategy: e.target.value } })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Rollback command</label>
                            <input
                                className="w-full rounded border px-3 py-2 font-mono"
                                value={env.rollback.command}
                                onChange={(e) =>
                                    setEnv(env.key, { rollback: { ...env.rollback, command: e.target.value } })
                                }
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-600 mb-1">Notes</label>
                            <textarea
                                rows={2}
                                className="w-full rounded border px-3 py-2"
                                value={env.rollback.notes}
                                onChange={(e) =>
                                    setEnv(env.key, { rollback: { ...env.rollback, notes: e.target.value } })
                                }
                            />
                        </div>
                    </div>
                </section>
            ))}
        </form>
    );
}
