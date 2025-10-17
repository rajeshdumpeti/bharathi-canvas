import React from "react";
import { SectionHeader, Alert, Card, Badge } from "components/ui/index";

export const DeploymentGuideReadView = ({
  form,
  onEdit,
  alert,
  onCloseAlert,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionHeader
        title="Deployment Guide"
        subtitle="Document CI/CD setup, environments, and release strategies."
        actionLabel="Edit"
        onActionClick={onEdit}
      />

      {alert && (
        <Alert
          type={alert.type}
          message={alert.msg}
          onClose={onCloseAlert}
          className="animate-slideUp"
        />
      )}

      {/* Overview */}
      <Card title="Overview">
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {form.overview || "No overview provided."}
        </p>
      </Card>

      {/* Environments */}
      <Card title="Environments">
        {form.environments?.length ? (
          <div className="grid md:grid-cols-2 gap-4">
            {form.environments.map((env, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{env.name}</h4>
                  <Badge
                    color={
                      env.name === "Production"
                        ? "green"
                        : env.name === "Staging"
                          ? "yellow"
                          : "gray"
                    }
                  >
                    {env.infraType || "—"}
                  </Badge>
                </div>

                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Branch:</span>{" "}
                  {env.branch || "—"}
                </p>

                <p className="text-xs text-gray-600">
                  <span className="font-semibold">URL:</span>{" "}
                  {env.url ? (
                    <a
                      href={env.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {env.url}
                    </a>
                  ) : (
                    "—"
                  )}
                </p>

                {env.notes && (
                  <p className="text-xs text-gray-500 mt-1">{env.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No environments documented.
          </p>
        )}
      </Card>

      {/* CI/CD Pipeline */}
      <Card title="CI/CD Pipeline">
        <p className="text-sm text-gray-700 mb-2">
          <strong>Tool:</strong> {form.ciCd?.tool || "—"}
        </p>

        {form.ciCd?.pipelineUrl && (
          <p className="text-sm text-blue-600 hover:underline mb-2">
            <a href={form.ciCd.pipelineUrl} target="_blank" rel="noreferrer">
              View Pipeline →
            </a>
          </p>
        )}

        <p className="text-sm text-gray-700">
          <strong>Triggers:</strong>{" "}
          {form.ciCd?.deployTriggers?.length
            ? form.ciCd.deployTriggers.join(", ")
            : "—"}
        </p>

        <p className="text-sm text-gray-700">
          <strong>Rollback Strategy:</strong>{" "}
          {form.ciCd?.rollbackStrategy || "—"}
        </p>
      </Card>

      {/* Scripts */}
      <Card title="Deployment Scripts">
        {form.scripts?.length ? (
          <ul className="text-sm space-y-1">
            {form.scripts.map((s, i) => (
              <li key={i}>
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {s.command}
                </code>{" "}
                — {s.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm italic">
            No deployment scripts added.
          </p>
        )}
      </Card>

      {/* Monitoring */}
      <Card title="Monitoring & Alerts">
        <p className="text-sm">
          <strong>Tools:</strong>{" "}
          {form.monitoring?.tools?.length
            ? form.monitoring.tools.join(", ")
            : "—"}
        </p>

        {form.monitoring?.dashboards?.length > 0 && (
          <div className="mt-2">
            <p className="font-medium text-sm">Dashboards:</p>
            <ul className="text-sm list-disc ml-5 space-y-1">
              {form.monitoring.dashboards.map((d, i) => (
                <li key={i}>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {d.name || d.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Notes */}
      <Card title="Additional Notes">
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {form.notes || "No additional notes."}
        </p>
      </Card>
    </div>
  );
};
