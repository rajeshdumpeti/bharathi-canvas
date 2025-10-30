// src/features/projectHub/sections/database/DatabaseReadView.tsx
import React from "react";
import { SectionHeader, Card, Alert } from "components/ui/index";

export const DatabaseReadView = ({ form, onEdit, alert, onCloseAlert }) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <SectionHeader
        title="Database Overview"
        subtitle="Explore all primary, secondary, and AI-related data stores in the system."
        actionLabel="Edit"
        onActionClick={onEdit}
      />

      {alert && (
        <Alert type={alert.type} message={alert.msg} onClose={onCloseAlert} />
      )}

      {/* ---- Overview ---- */}
      <Card title="Overview">
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {form.overview || "—"}
        </p>
      </Card>

      {/* ---- Primary Database ---- */}
      <Card title="Primary Database">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Name:</strong> {form.primaryDB?.name || "—"}
          </li>
          <li>
            <strong>Engine:</strong> {form.primaryDB?.engine || "—"} (
            {form.primaryDB?.version || "—"})
          </li>
          <li>
            <strong>Purpose:</strong> {form.primaryDB?.purpose || "—"}
          </li>
          <li>
            <strong>Region:</strong> {form.primaryDB?.region || "—"}
          </li>
          <li>
            <strong>Replication:</strong>{" "}
            {form.primaryDB?.replication?.mode || "—"} (
            {form.primaryDB?.replication?.replicas || 0} replicas)
          </li>
          <li>
            <strong>Scaling:</strong> {form.primaryDB?.scaling?.strategy || "—"}
          </li>
          <li>
            <strong>Backup:</strong> {form.primaryDB?.backup?.frequency || "—"}{" "}
            ({form.primaryDB?.backup?.retentionDays || "—"} days retention)
          </li>
          <li>
            <strong>Encryption:</strong> At Rest -{" "}
            {form.primaryDB?.encryption?.atRest ? "Yes" : "No"}, In Transit -{" "}
            {form.primaryDB?.encryption?.inTransit ? "Yes" : "No"}
          </li>
        </ul>
      </Card>

      {/* ---- Secondary Databases ---- */}
      <Card title="Secondary Databases">
        {form.secondaryDBs?.length ? (
          <ul className="text-sm space-y-2">
            {form.secondaryDBs.map((db: any, i: number) => (
              <li key={i}>
                <strong>{db.name}</strong> — {db.engine} ({db.version}) —{" "}
                {db.purpose}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>

      {/* ---- AI Databases ---- */}
      <Card title="AI Databases">
        {form.aiDatabases?.length ? (
          <div className="space-y-4">
            {form.aiDatabases.map((ai: any, i: number) => (
              <div key={i} className="rounded border p-3 bg-gray-50">
                <p className="font-medium text-sm">
                  {ai.name} ({ai.engine})
                </p>
                <ul className="text-sm space-y-1 mt-1">
                  <li>
                    <strong>Purpose:</strong> {ai.purpose || "—"}
                  </li>
                  {ai.integration && (
                    <>
                      <li>
                        <strong>Framework:</strong> {ai.integration.framework}
                      </li>
                      <li>
                        <strong>Embedding Model:</strong>{" "}
                        {ai.integration.embeddingModel}
                      </li>
                      <li>
                        <strong>Vector Size:</strong>{" "}
                        {ai.integration.vectorSize}
                      </li>
                    </>
                  )}
                  {ai.storeType && (
                    <li>
                      <strong>Store Type:</strong> {ai.storeType}
                    </li>
                  )}
                  {ai.storageBackend && (
                    <li>
                      <strong>Storage Backend:</strong> {ai.storageBackend}
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>

      {/* ---- Governance ---- */}
      <Card title="Data Governance & Access Control">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Retention Policy:</strong>{" "}
            {form.governance?.piiHandling?.retentionPolicy || "—"}
          </li>
          <li>
            <strong>Masked Fields:</strong>{" "}
            {form.governance?.piiHandling?.maskedFields?.join(", ") || "—"}
          </li>
          <li>
            <strong>Audit Logging:</strong>{" "}
            {form.governance?.auditLogging?.enabled ? "Enabled" : "Disabled"}
          </li>
          <li>
            <strong>Roles:</strong>{" "}
            {form.governance?.accessControl?.roles?.join(", ") || "—"}
          </li>
          <li>
            <strong>Policies:</strong>{" "}
            {form.governance?.accessControl?.policies?.join(", ") || "—"}
          </li>
        </ul>
      </Card>

      {/* ---- Performance ---- */}
      <Card title="Performance & Optimization">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Indexing:</strong>{" "}
            {form.performance?.indexingStrategy?.join(", ") || "—"}
          </li>
          <li>
            <strong>Caching Layer:</strong>{" "}
            {form.performance?.cachingLayer || "—"}
          </li>
          <li>
            <strong>Query Optimizer:</strong> {form.performance?.queryOptimizer}
          </li>
          <li>
            <strong>Vacuum Policy:</strong>{" "}
            {form.performance?.vacuumPolicy || "—"}
          </li>
        </ul>
      </Card>

      {/* ---- Disaster Recovery ---- */}
      <Card title="Disaster Recovery">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Strategy:</strong> {form.disasterRecovery?.strategy || "—"}
          </li>
          <li>
            <strong>RPO:</strong> {form.disasterRecovery?.rpo || "—"}
          </li>
          <li>
            <strong>RTO:</strong> {form.disasterRecovery?.rto || "—"}
          </li>
          <li>
            <strong>Failover Region:</strong>{" "}
            {form.disasterRecovery?.failoverRegion || "—"}
          </li>
          <li>
            <strong>Last Drill:</strong>{" "}
            {form.disasterRecovery?.lastDrill || "—"}
          </li>
        </ul>
      </Card>

      {/* ---- Data Pipelines ---- */}
      <Card title="Data Pipelines">
        {form.dataPipelines?.length ? (
          <ul className="text-sm space-y-2">
            {form.dataPipelines.map((p: any, i: number) => (
              <li key={i}>
                <strong>{p.name}</strong> — {p.source} → {p.destination} (
                {p.frequency})
                {p.transformation?.length && (
                  <div className="text-gray-500">
                    Transformations: {p.transformation.join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>
    </div>
  );
};
