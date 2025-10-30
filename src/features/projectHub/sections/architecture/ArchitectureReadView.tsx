import React from "react";
import { SectionHeader, Alert, Card } from "components/ui/index";

export const ArchitectureReadView = ({ form, onEdit, alert, onCloseAlert }) => {
  console.log("form", form);
  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionHeader
        title="Architecture"
        subtitle="Comprehensive system overview including services, data flow, infrastructure, and integrations."
        actionLabel="Edit"
        onActionClick={onEdit}
      />

      {alert && (
        <Alert type={alert.type} message={alert.msg} onClose={onCloseAlert} />
      )}

      {/* ===== Overview & Diagrams ===== */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Overview">
          <p className="text-sm whitespace-pre-line">{form.overview || "—"}</p>
        </Card>

        <Card title="Diagrams">
          {form.diagrams?.length ? (
            <ul className="list-disc pl-5 text-sm space-y-1">
              {form.diagrams.map((d: any, i: number) => (
                <li key={i}>
                  {d.label && `${d.label}: `}
                  {d.url ? (
                    <a
                      href={d.url}
                      className="text-blue-600 hover:underline break-all"
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
            <p className="text-gray-500 text-sm">—</p>
          )}
        </Card>
      </div>

      {/* ===== Core Components ===== */}
      <Card title="Services">
        {form.services?.length ? (
          <ul className="text-sm space-y-1">
            {form.services.map((s: any, i: number) => (
              <li key={i}>
                <strong>{s.name || "Service"}</strong> — {s.language || "—"} /{" "}
                {s.runtime || "—"}
                {s.repoUrl && (
                  <a
                    href={s.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1 text-blue-600 hover:underline"
                  >
                    repo
                  </a>
                )}
                {s.owner && ` — ${s.owner}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>

      <Card title="APIs">
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
                {form.apis.map((a: any, i: number) => (
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
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Data Stores">
          {form.dataStores?.length ? (
            <ul className="text-sm space-y-1">
              {form.dataStores.map((d: any, i: number) => (
                <li key={i}>
                  <strong>{d.name || "Store"}</strong> — {d.type || "Type"}{" "}
                  {d.version && `(${d.version})`} — {d.purpose || "—"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">—</p>
          )}
        </Card>

        <Card title="Queues / Streams">
          {form.queues?.length ? (
            <ul className="text-sm list-disc pl-5 space-y-1">
              {form.queues.map((q: any, i: number) => (
                <li key={i}>
                  <strong>{q.name || "Queue"}</strong> — {q.tech || "Tech"} —{" "}
                  {q.purpose || "—"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">—</p>
          )}
        </Card>
      </div>

      {/* ===== Integrations & Infra ===== */}
      <Card title="Integrations">
        {form.integrations?.length ? (
          <ul className="text-sm list-disc pl-5 space-y-1">
            {form.integrations.map((int: any, i: number) => (
              <li key={i}>
                <strong>{int.name}</strong> — {int.type} via {int.protocol} (
                {int.auth}) — {int.purpose || "—"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>

      <Card title="Infrastructure">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Cloud:</strong> {form.infrastructure.cloudProvider || "—"} (
            {form.infrastructure.region || "—"})
          </li>
          <li>
            <strong>Compute:</strong> {form.infrastructure.compute || "—"}
          </li>
          <li>
            <strong>Storage:</strong>{" "}
            {form.infrastructure.storage?.join(", ") || "—"}
          </li>
          <li>
            <strong>Networking:</strong>{" "}
            {form.infrastructure.networking?.join(", ") || "—"}
          </li>
          <li>
            <strong>IaC:</strong> {form.infrastructure.infraAsCode || "—"}
          </li>
        </ul>
      </Card>

      {/* ===== Monitoring, Performance & Security ===== */}
      <Card title="Performance & Capacity">
        <ul className="text-sm space-y-1">
          <li>Expected Users: {form.performance.expectedUsers || "—"}</li>
          <li>Peak RPS: {form.performance.peakRPS || "—"}</li>
          <li>Response Target: {form.performance.responseTimeTarget || "—"}</li>
          <li>Scaling Strategy: {form.performance.scalingStrategy || "—"}</li>
          <li>
            Bottlenecks: {form.performance.bottlenecks?.join(", ") || "—"}
          </li>
        </ul>
      </Card>

      <Card title="Security & Compliance">
        <ul className="text-sm space-y-1">
          <li>At Rest: {form.security.encryptionAtRest ? "Yes" : "No"}</li>
          <li>
            In Transit: {form.security.encryptionInTransit ? "Yes" : "No"}
          </li>
          <li>Threat Model: {form.security.threatModelUrl || "—"}</li>
          <li>Retention: {form.security.dataRetentionNotes || "—"}</li>
          <li>CORS: {form.security.corsPolicy || "—"}</li>
          <li>CSP: {form.security.cspNotes || "—"}</li>
          <li>
            Standards: {form.compliance.standards?.join(", ") || "—"} (
            {form.compliance.dataClassification || "—"})
          </li>
        </ul>
      </Card>

      {/* ===== Decisions, Risks, Tags ===== */}
      <Card title="Architecture Decisions">
        {form.decisions?.length ? (
          <ul className="text-sm list-disc pl-5 space-y-1">
            {form.decisions.map((d: any, i: number) => (
              <li key={i}>
                <strong>{d.title}</strong> ({d.status || "Pending"}) —{" "}
                {d.reason || "—"}{" "}
                {d.link && (
                  <a
                    href={d.link}
                    className="ml-1 text-blue-600 hover:underline"
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
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>

      <Card title="Risks & Mitigations">
        {form.risks?.length ? (
          <ul className="text-sm list-disc pl-5 space-y-1">
            {form.risks.map((r: any, i: number) => (
              <li key={i}>
                <strong>{r.risk || "—"}</strong> — {r.mitigation || "—"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>

      <Card title="Tags">
        {form.tags?.length ? (
          <div className="flex flex-wrap gap-2">
            {form.tags.map((t: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 rounded bg-gray-100 text-xs font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>
    </div>
  );
};
