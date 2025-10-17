import React from "react";
import { Card, TextField } from "components/ui/index";

export const DatabaseRecoveryCard = ({ recovery, patch, readonly }: any) => {
  if (readonly) {
    return (
      <Card title="Disaster Recovery">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Strategy:</strong> {recovery.strategy || "—"}
          </li>
          <li>
            <strong>RPO:</strong> {recovery.rpo || "—"}
          </li>
          <li>
            <strong>RTO:</strong> {recovery.rto || "—"}
          </li>
          <li>
            <strong>Failover Region:</strong> {recovery.failoverRegion || "—"}
          </li>
        </ul>
      </Card>
    );
  }

  return (
    <Card title="Disaster Recovery">
      <div className="grid md:grid-cols-2 gap-4">
        <TextField
          label="Strategy"
          value={recovery.strategy}
          onChange={(v) => patch({ recovery: { ...recovery, strategy: v } })}
        />
        <TextField
          label="RPO"
          value={recovery.rpo}
          onChange={(v) => patch({ recovery: { ...recovery, rpo: v } })}
        />
        <TextField
          label="RTO"
          value={recovery.rto}
          onChange={(v) => patch({ recovery: { ...recovery, rto: v } })}
        />
        <TextField
          label="Failover Region"
          value={recovery.failoverRegion}
          onChange={(v) =>
            patch({ recovery: { ...recovery, failoverRegion: v } })
          }
        />
      </div>
    </Card>
  );
};
