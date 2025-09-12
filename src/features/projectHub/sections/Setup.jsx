import React, { useEffect, useMemo, useState } from 'react';
import useProjectHub from '../../../hooks/useProjectHub';
import SectionHeader from '../../../components/ui/SectionHeader';
import IconButton from '../../../components/ui/IconButton';
import ChipInput from '../../../components/ui/ChipInput';
import SecretText from '../../../components/ui/SecretText';
import { DEFAULT_SETUP } from '../constants/setupDefaults';
import { updateAt, removeAt } from '../../../utils/immutables';

/** NOTE:
 *  - Read mode = clean, card-like overview
 *  - Edit mode = structured forms
 *  - Data lives under project.sections.setup (persisted via context)
 */

export default function Setup() {
    const { selected, updateSection } = useProjectHub();

    const saved = useMemo(
        () =>
            selected?.sections?.setup && typeof selected.sections.setup === 'object'
                ? selected.sections.setup
                : DEFAULT_SETUP,
        [selected]
    );

    const [mode, setMode] = useState('read'); // 'read' | 'edit'
    const [form, setForm] = useState(DEFAULT_SETUP);

    useEffect(() => {
        setForm(saved || DEFAULT_SETUP);
        setMode('read');
    }, [saved, selected?.id]);

    const patch = (p) => setForm((f) => ({ ...f, ...p }));

    /* === READ MODE === */
    if (!selected) {
        return (
            <div className="rounded-lg border bg-white p-8 text-gray-600">
                Create or select a project on the left to configure <strong>Setup</strong>.
            </div>
        );
    }

    if (mode === 'read') {
        return (
            <div className="space-y-6">
                <SectionHeader
                    title="Setup Overview"
                    mode="read"
                    onEdit={() => setMode('edit')}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basics */}
                    <Card title="Basics">
                        <DL
                            rows={[
                                ['Repository', linkOrDash(form.repoUrl)],
                                ['Issue tracker', linkOrDash(form.issueTrackerUrl)],
                                ['Design doc', linkOrDash(form.designDocUrl)],
                                ['License', valueOrDash(form.license)],
                                ['Package manager', valueOrDash(form.packageManager)],
                                ['Node', valueOrDash(form.nodeVersion)],
                                ['Framework', valueOrDash(form.framework)],
                                ['Branching', valueOrDash(form.branchStrategy)],
                            ]}
                        />
                    </Card>

                    {/* Tech stack */}
                    <Card title="Tech stack">
                        {form.techStack?.length ? (
                            <div className="flex flex-wrap gap-2">
                                {form.techStack.map((t) => (
                                    <span key={t} className="px-2 py-1 rounded bg-gray-100 text-xs">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <Empty />
                        )}
                    </Card>

                    {/* Commands */}
                    <Card title="Commands">
                        {form.commands ? (
                            <pre className="bg-gray-50 rounded p-3 text-xs overflow-auto">
                                {JSON.stringify(form.commands, null, 2)}
                            </pre>
                        ) : (
                            <Empty />
                        )}
                    </Card>

                    {/* Tooling */}
                    <Card title="Tooling">
                        <DL
                            rows={[
                                ['Lint', valueOrDash(form.tooling?.lint)],
                                ['Format', valueOrDash(form.tooling?.format)],
                                ['Typecheck', valueOrDash(form.tooling?.typecheck)],
                            ]}
                        />
                    </Card>

                    {/* Environments */}
                    <Card className="lg:col-span-2" title="Environments">
                        {form.environments?.length ? (
                            <div className="grid md:grid-cols-3 gap-4">
                                {form.environments.map((env, i) => (
                                    <div key={i} className="rounded border p-3 text-sm">
                                        <div className="font-semibold mb-1">
                                            {env.name || `Env ${i + 1}`}
                                        </div>
                                        <div className="text-gray-500">App:</div>
                                        <div className="break-all">{linkOrDash(env.appUrl)}</div>
                                        <div className="text-gray-500 mt-1">API:</div>
                                        <div className="break-all">{linkOrDash(env.apiUrl)}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Empty />
                        )}
                    </Card>

                    {/* Env vars */}
                    <Card className="lg:col-span-2" title="Environment variables">
                        {form.envVars?.length ? (
                            <div className="overflow-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-gray-500">
                                            <th className="py-2 pr-3">Key</th>
                                            <th className="py-2 pr-3">Value</th>
                                            <th className="py-2 pr-3">Secret</th>
                                            <th className="py-2">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {form.envVars.map((v, i) => (
                                            <tr key={i} className="border-t">
                                                <td className="py-2 pr-3 font-mono">{v.key || '—'}</td>
                                                <td className="py-2 pr-3">
                                                    {v.secret ? (
                                                        <SecretText>{v.value}</SecretText>
                                                    ) : (
                                                        <span className="font-mono">{v.value || '—'}</span>
                                                    )}
                                                </td>
                                                <td className="py-2 pr-3">{v.secret ? 'Yes' : 'No'}</td>
                                                <td className="py-2">{v.description || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <Empty />
                        )}
                    </Card>

                    {/* Contacts */}
                    <Card className="lg:col-span-2" title="Contacts">
                        {form.contacts?.length ? (
                            <ul className="text-sm space-y-2">
                                {form.contacts.map((c, i) => (
                                    <li key={i}>
                                        <span className="font-medium">
                                            {c.role || 'Contact'}
                                        </span>{' '}
                                        {c.name ? `— ${c.name}` : ''}{' '}
                                        {c.email ? (
                                            <a
                                                className="text-blue-700 hover:underline"
                                                href={`mailto:${c.email}`}
                                            >
                                                {c.email}
                                            </a>
                                        ) : (
                                            ''
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Empty />
                        )}
                    </Card>
                </div>
            </div>
        );
    }

    /* === EDIT MODE === */
    const onSave = () => {
        updateSection('setup', form);
        setMode('read');
    };

    return (
        <div className="space-y-6">
            <SectionHeader
                title="Edit Setup"
                mode="edit"
                onCancel={() => {
                    setForm(saved);
                    setMode('read');
                }}
                onSave={onSave}
            />

            {/* Basics */}
            <Card title="Basics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        label="Repository URL"
                        value={form.repoUrl}
                        onChange={(v) => patch({ repoUrl: v })}
                        placeholder="https://github.com/you/repo"
                    />
                    <TextField
                        label="Issue tracker URL"
                        value={form.issueTrackerUrl}
                        onChange={(v) => patch({ issueTrackerUrl: v })}
                        placeholder="https://github.com/you/repo/issues"
                    />
                    <TextField
                        label="Design doc URL"
                        value={form.designDocUrl}
                        onChange={(v) => patch({ designDocUrl: v })}
                        placeholder="https://docs.google.com/…"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="License"
                            value={form.license}
                            onChange={(v) => patch({ license: v })}
                        />
                        <SelectField
                            label="Package manager"
                            value={form.packageManager}
                            onChange={(v) => patch({ packageManager: v })}
                            options={['npm', 'yarn', 'pnpm', 'bun']}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextField
                            label="Node version"
                            value={form.nodeVersion}
                            onChange={(v) => patch({ nodeVersion: v })}
                            placeholder="e.g. 20.x"
                        />
                        <TextField
                            label="Framework"
                            value={form.framework}
                            onChange={(v) => patch({ framework: v })}
                            placeholder="e.g. React + Vite"
                        />
                    </div>
                    <SelectField
                        label="Branch strategy"
                        value={form.branchStrategy}
                        onChange={(v) => patch({ branchStrategy: v })}
                        options={[
                            { label: 'Trunk-based', value: 'trunk' },
                            { label: 'GitFlow', value: 'gitflow' },
                            { label: 'None', value: 'none' },
                        ]}
                    />
                </div>
            </Card>

            {/* Tech stack */}
            <Card title="Tech stack">
                <ChipInput
                    value={form.techStack}
                    onChange={(v) => patch({ techStack: v })}
                    placeholder="Add a technology and press Enter"
                />
            </Card>

            {/* Commands */}
            <Card title="Commands">
                <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(form.commands).map(([k, v]) => (
                        <TextField
                            key={k}
                            label={k}
                            value={v}
                            onChange={(val) =>
                                patch({ commands: { ...form.commands, [k]: val } })
                            }
                            className="font-mono"
                        />
                    ))}
                </div>
            </Card>

            {/* Environments */}
            <Card title="Environments">
                <div className="grid md:grid-cols-3 gap-4">
                    {form.environments.map((env, i) => (
                        <div key={i} className="rounded border p-3 space-y-2">
                            <div className="flex items-center justify-between">
                                <input
                                    value={env.name}
                                    onChange={(e) =>
                                        patch({
                                            environments: updateAt(form.environments, i, {
                                                name: e.target.value,
                                            }),
                                        })
                                    }
                                    placeholder={`Env ${i + 1} name`}
                                    className="w-40 rounded border px-2 py-1"
                                />
                                <IconButton
                                    variant="ghost"
                                    onClick={() =>
                                        patch({ environments: removeAt(form.environments, i) })
                                    }
                                >
                                    Remove
                                </IconButton>
                            </div>
                            <TextField
                                label="App URL"
                                value={env.appUrl}
                                onChange={(v) =>
                                    patch({
                                        environments: updateAt(form.environments, i, {
                                            appUrl: v,
                                        }),
                                    })
                                }
                            />
                            <TextField
                                label="API URL"
                                value={env.apiUrl}
                                onChange={(v) =>
                                    patch({
                                        environments: updateAt(form.environments, i, {
                                            apiUrl: v,
                                        }),
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-3">
                    <IconButton
                        variant="neutral"
                        onClick={() =>
                            patch({
                                environments: [
                                    ...form.environments,
                                    { name: '', appUrl: '', apiUrl: '' },
                                ],
                            })
                        }
                    >
                        Add environment
                    </IconButton>
                </div>
            </Card>

            {/* Env vars */}
            <Card title="Environment variables">
                <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500">
                                <th className="py-2 pr-3">Key</th>
                                <th className="py-2 pr-3">Value</th>
                                <th className="py-2 pr-3">Secret</th>
                                <th className="py-2 pr-3">Description</th>
                                <th className="py-2" />
                            </tr>
                        </thead>
                        <tbody>
                            {form.envVars.map((row, i) => (
                                <tr key={i} className="border-t">
                                    <td className="py-2 pr-3">
                                        <input
                                            value={row.key}
                                            onChange={(e) =>
                                                patch({
                                                    envVars: updateAt(form.envVars, i, {
                                                        key: e.target.value,
                                                    }),
                                                })
                                            }
                                            className="w-full rounded border px-2 py-1 font-mono"
                                        />
                                    </td>
                                    <td className="py-2 pr-3">
                                        <input
                                            value={row.value}
                                            onChange={(e) =>
                                                patch({
                                                    envVars: updateAt(form.envVars, i, {
                                                        value: e.target.value,
                                                    }),
                                                })
                                            }
                                            className="w-full rounded border px-2 py-1 font-mono"
                                        />
                                    </td>
                                    <td className="py-2 pr-3">
                                        <select
                                            value={row.secret ? 'yes' : 'no'}
                                            onChange={(e) =>
                                                patch({
                                                    envVars: updateAt(form.envVars, i, {
                                                        secret: e.target.value === 'yes',
                                                    }),
                                                })
                                            }
                                            className="rounded border px-2 py-1"
                                        >
                                            <option value="no">No</option>
                                            <option value="yes">Yes</option>
                                        </select>
                                    </td>
                                    <td className="py-2 pr-3">
                                        <input
                                            value={row.description}
                                            onChange={(e) =>
                                                patch({
                                                    envVars: updateAt(form.envVars, i, {
                                                        description: e.target.value,
                                                    }),
                                                })
                                            }
                                            className="w-full rounded border px-2 py-1"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <IconButton
                                            variant="ghost"
                                            onClick={() =>
                                                patch({ envVars: removeAt(form.envVars, i) })
                                            }
                                        >
                                            Remove
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-3">
                    <IconButton
                        variant="neutral"
                        onClick={() =>
                            patch({
                                envVars: [
                                    ...form.envVars,
                                    { key: '', value: '', secret: false, description: '' },
                                ],
                            })
                        }
                    >
                        Add variable
                    </IconButton>
                </div>
            </Card>

            {/* Tooling */}
            <Card title="Tooling">
                <div className="grid md:grid-cols-3 gap-4">
                    <TextField
                        label="Lint"
                        value={form.tooling.lint}
                        onChange={(v) =>
                            patch({ tooling: { ...form.tooling, lint: v } })
                        }
                    />
                    <TextField
                        label="Format"
                        value={form.tooling.format}
                        onChange={(v) =>
                            patch({ tooling: { ...form.tooling, format: v } })
                        }
                    />
                    <TextField
                        label="Typecheck"
                        value={form.tooling.typecheck}
                        onChange={(v) =>
                            patch({ tooling: { ...form.tooling, typecheck: v } })
                        }
                    />
                </div>
            </Card>

            {/* Contacts */}
            <Card title="Contacts">
                <div className="space-y-3">
                    {form.contacts.map((c, i) => (
                        <div key={i} className="grid md:grid-cols-3 gap-3 items-start">
                            <TextField
                                label="Role"
                                value={c.role}
                                onChange={(v) =>
                                    patch({ contacts: updateAt(form.contacts, i, { role: v }) })
                                }
                                placeholder="Owner"
                            />
                            <TextField
                                label="Name"
                                value={c.name}
                                onChange={(v) =>
                                    patch({ contacts: updateAt(form.contacts, i, { name: v }) })
                                }
                            />
                            <div className="flex gap-2">
                                <TextField
                                    label="Email"
                                    value={c.email}
                                    onChange={(v) =>
                                        patch({
                                            contacts: updateAt(form.contacts, i, { email: v }),
                                        })
                                    }
                                    placeholder="email@domain.com"
                                    className="flex-1"
                                />
                                <IconButton
                                    variant="ghost"
                                    onClick={() =>
                                        patch({ contacts: removeAt(form.contacts, i) })
                                    }
                                >
                                    Remove
                                </IconButton>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-3">
                    <IconButton
                        variant="neutral"
                        onClick={() =>
                            patch({
                                contacts: [
                                    ...form.contacts,
                                    { role: '', name: '', email: '' },
                                ],
                            })
                        }
                    >
                        Add contact
                    </IconButton>
                </div>
            </Card>
        </div>
    );
}

/* ---------- small presentational helpers ---------- */

function Card({ title, children, className }) {
    return (
        <section className={`rounded border bg-white p-4 ${className || ''}`}>
            {title ? <h4 className="font-semibold mb-3">{title}</h4> : null}
            {children}
        </section>
    );
}

function DL({ rows = [] }) {
    return (
        <dl className="grid grid-cols-3 gap-y-2 text-sm">
            {rows.map(([dt, dd], i) => (
                <React.Fragment key={i}>
                    <dt className="text-gray-500">{dt}</dt>
                    <dd className="col-span-2">{dd}</dd>
                </React.Fragment>
            ))}
        </dl>
    );
}

function Empty() {
    return <p className="text-sm text-gray-500">—</p>;
}

function linkOrDash(href) {
    if (!href) return '—';
    return (
        <a
            className="text-blue-700 hover:underline break-all"
            href={href}
            target="_blank"
            rel="noreferrer"
        >
            {href}
        </a>
    );
}

function valueOrDash(v) {
    return v ? <span>{v}</span> : '—';
}

function TextField({ label, value, onChange, className, ...rest }) {
    return (
        <div>
            {label && (
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
            )}
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded border px-3 py-2 ${className || ''}`}
                {...rest}
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options = [] }) {
    const opts =
        typeof options[0] === 'string'
            ? options.map((o) => ({ label: o, value: o }))
            : options;

    return (
        <div>
            {label && (
                <label className="block text-sm text-gray-600 mb-1">{label}</label>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded border px-3 py-2"
            >
                {opts.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
