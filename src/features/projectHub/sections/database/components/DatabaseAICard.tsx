import React from "react";
import { Card, TextField } from "components/ui/index";

export const DatabaseAICard = ({ aiDatabases, patch, readonly }: any) => {
  if (readonly) {
    return (
      <Card title="AI Databases">
        {aiDatabases?.length ? (
          <ul className="text-sm space-y-2">
            {aiDatabases.map((db: any, i: number) => (
              <li key={i}>
                <strong>{db.name}</strong> — {db.engine} ({db.version})
                <div className="text-gray-600">
                  {db.purpose} | Model: {db.integration?.embeddingModel}
                </div>
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
    <Card title="AI Databases">
      {aiDatabases.map((db: any, i: number) => (
        <div key={i} className="border p-3 rounded mb-4">
          <TextField
            label="Name"
            value={db.name}
            onChange={(v) => {
              const updated = [...aiDatabases];
              updated[i] = { ...db, name: v };
              patch({ aiDatabases: updated });
            }}
          />
          <TextField
            label="Engine"
            value={db.engine}
            onChange={(v) => {
              const updated = [...aiDatabases];
              updated[i] = { ...db, engine: v };
              patch({ aiDatabases: updated });
            }}
          />
          <TextField
            label="Purpose"
            value={db.purpose}
            onChange={(v) => {
              const updated = [...aiDatabases];
              updated[i] = { ...db, purpose: v };
              patch({ aiDatabases: updated });
            }}
          />
        </div>
      ))}
    </Card>
  );
};
