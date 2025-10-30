import React from "react";
import { SectionHeader, Card, Alert, Badge } from "components/ui/index";

interface LinksReadViewProps {
  form: any;
  onEdit: () => void;
  alert?: { type: "success" | "error"; msg: string } | null;
  onCloseAlert?: () => void;
  title?: string;
  description?: string;
}

export const LinksReadView: React.FC<LinksReadViewProps> = ({
  form,
  onEdit,
  alert,
  onCloseAlert,
  title = "Project Links",
  description = "Centralized repository for all project resources and documentation.",
}) => {
  console.log("Repo data:", form);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <SectionHeader
        title={title}
        subtitle={description}
        actionLabel="Edit"
        onActionClick={onEdit}
      />

      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.msg}
          onClose={onCloseAlert}
          className="animate-slideUp"
        />
      )}

      {/* Repositories */}
      <Card title="Repositories">
        {form.repositories?.length ? (
          <div className="divide-y divide-gray-100">
            {form.repositories.map((repo: any, i: number) => (
              <div key={i} className="py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{repo.name}</p>
                    <p className="text-xs text-gray-500">{repo.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-600">
                      <span>Branch: {repo.branchStrategy || "—"}</span>
                      <span>Owner: {repo.owner || "—"}</span>
                      {repo.environment && (
                        <Badge
                          label={repo.environment.name}
                          color={
                            repo.environment === "Prod"
                              ? "green"
                              : repo.environment === "Staging"
                                ? "yellow"
                                : "gray"
                          }
                        />
                      )}
                    </div>
                  </div>
                  {repo.url ? (
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Open →
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">No link</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No repositories linked yet.
          </p>
        )}
      </Card>

      {/* Documentation */}
      <Card title="Documentation">
        {form.documentation?.length ? (
          <ul className="space-y-2 text-sm">
            {form.documentation.map((doc: any, i: number) => (
              <li
                key={i}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <span className="font-medium text-gray-800">{doc.type}</span>{" "}
                  <span className="text-gray-500">— {doc.description}</span>
                  {doc.owner && (
                    <div className="text-xs text-gray-400 mt-1">
                      Owner: {doc.owner}
                    </div>
                  )}
                </div>
                {doc.url ? (
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-gray-400">No link</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No documentation added.
          </p>
        )}
      </Card>

      {/* Dashboards */}
      <Card title="Dashboards & Monitoring">
        {form.dashboards?.length ? (
          <ul className="space-y-2 text-sm">
            {form.dashboards.map((d: any, i: number) => (
              <li
                key={i}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <span className="font-medium">{d.tool}</span>{" "}
                  <span className="text-gray-500">— {d.description}</span>
                  <div className="flex gap-2 text-xs text-gray-500 mt-1">
                    {d.environment && (
                      <Badge
                        label={d.environment.name}
                        color={
                          d.environment === "Prod"
                            ? "green"
                            : d.environment === "Staging"
                              ? "yellow"
                              : "gray"
                        }
                      />
                    )}
                  </div>
                </div>
                {d.url ? (
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open
                  </a>
                ) : (
                  <span className="text-gray-400">No link</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No dashboards configured yet.
          </p>
        )}
      </Card>

      {/* Cloud */}
      <Card title="Cloud & Infrastructure">
        {form.cloud?.length ? (
          <ul className="space-y-2 text-sm">
            {form.cloud.map((c: any, i: number) => (
              <li
                key={i}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <span className="font-medium">{c.provider}</span> —{" "}
                  {c.resource || "—"}
                  <div className="text-xs text-gray-500 mt-1">
                    {c.accessType || "—"} | {c.environment || "—"}
                  </div>
                </div>
                {c.url ? (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open
                  </a>
                ) : (
                  <span className="text-gray-400">No link</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No cloud or infra links added yet.
          </p>
        )}
      </Card>

      {/* Knowledge Base */}
      <Card title="Knowledge Base">
        {form.knowledgeBase?.length ? (
          <ul className="space-y-2 text-sm">
            {form.knowledgeBase.map((k: any, i: number) => (
              <li
                key={i}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <span className="font-medium">{k.resource}</span>{" "}
                  <span className="text-gray-500">— {k.description}</span>
                  {k.owner && (
                    <div className="text-xs text-gray-400 mt-1">
                      Owner: {k.owner}
                    </div>
                  )}
                </div>
                {k.url ? (
                  <a
                    href={k.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-gray-400">No link</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No knowledge base links added.
          </p>
        )}
      </Card>
    </div>
  );
};
