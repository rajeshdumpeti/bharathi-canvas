import React from "react";
import { Card, TextField, SelectField } from "components/ui/index";

export const DatabasePrimaryCard = ({ form, patch, readonly }: any) => {
  if (readonly) {
    return (
      <Card title="Primary Database">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Name:</strong> {form.name || "—"}
          </li>
          <li>
            <strong>Engine:</strong> {form.engine || "—"} ({form.version || "—"}
            )
          </li>
          <li>
            <strong>Purpose:</strong> {form.purpose || "—"}
          </li>
          <li>
            <strong>Region:</strong> {form.region || "—"}
          </li>
          <li>
            <strong>Replication:</strong> {form.replication?.mode || "—"} (
            {form.replication?.replicas || 0} replicas)
          </li>
          <li>
            <strong>Scaling:</strong> {form.scaling?.strategy || "—"}
          </li>
          <li>
            <strong>Backup:</strong> {form.backup?.frequency || "—"} (
            {form.backup?.retentionDays || "—"} days retention)
          </li>
        </ul>
      </Card>
    );
  }

  return (
    <Card title="Primary Database">
      <div className="grid md:grid-cols-2 gap-4">
        <TextField
          label="Name"
          value={form.name}
          onChange={(v) => patch({ name: v })}
        />
        <TextField
          label="Engine"
          value={form.engine}
          onChange={(v) => patch({ engine: v })}
        />
        <TextField
          label="Version"
          value={form.version}
          onChange={(v) => patch({ version: v })}
        />
        <TextField
          label="Purpose"
          value={form.purpose}
          onChange={(v) => patch({ purpose: v })}
        />
        <TextField
          label="Region"
          value={form.region}
          onChange={(v) => patch({ region: v })}
        />
        <SelectField
          label="Replication Mode"
          options={[
            { label: "Single-AZ", value: "Single-AZ" },
            { label: "Multi-AZ", value: "Multi-AZ" },
            { label: "Read Replicas", value: "Read Replicas" },
          ]}
          value={form.replication?.mode || ""}
          onChange={(value) =>
            patch({
              replication: { ...form.replication, mode: value },
            })
          }
        />

        <TextField
          label="Replicas"
          value={form.replication?.replicas || ""}
          onChange={(v) =>
            patch({
              replication: {
                ...form.replication,
                replicas: parseInt(v, 10) || 0,
              },
            })
          }
        />
        <TextField
          label="Backup Frequency"
          value={form.backup?.frequency || ""}
          onChange={(v) => patch({ backup: { ...form.backup, frequency: v } })}
        />
        <TextField
          label="Retention Days"
          value={form.backup?.retentionDays || ""}
          onChange={(v) =>
            patch({
              backup: { ...form.backup, retentionDays: parseInt(v, 10) || 0 },
            })
          }
        />
      </div>
    </Card>
  );
};
