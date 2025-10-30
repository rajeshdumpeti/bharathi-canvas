import React from "react";
import { Card, TextField } from "components/ui/index";

export const DatabasePipelineCard = ({ pipelines, patch, readonly }: any) => {
  if (readonly) {
    return (
      <Card title="Data Pipelines">
        {pipelines?.length ? (
          <ul className="text-sm space-y-2">
            {pipelines.map((p: any, i: number) => (
              <li key={i}>
                <strong>{p.name}</strong> — {p.source} → {p.destination} (
                {p.frequency})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">—</p>
        )}
      </Card>
    );
  }

  return (
    <Card title="Data Pipelines">
      {pipelines.map((p: any, i: number) => (
        <div key={i} className="border rounded p-3 mb-3">
          <TextField
            label="Name"
            value={p.name}
            onChange={(v) => {
              const updated = [...pipelines];
              updated[i] = { ...p, name: v };
              patch({ dataPipelines: updated });
            }}
          />
          <TextField
            label="Source"
            value={p.source}
            onChange={(v) => {
              const updated = [...pipelines];
              updated[i] = { ...p, source: v };
              patch({ dataPipelines: updated });
            }}
          />
          <TextField
            label="Destination"
            value={p.destination}
            onChange={(v) => {
              const updated = [...pipelines];
              updated[i] = { ...p, destination: v };
              patch({ dataPipelines: updated });
            }}
          />
        </div>
      ))}
    </Card>
  );
};
