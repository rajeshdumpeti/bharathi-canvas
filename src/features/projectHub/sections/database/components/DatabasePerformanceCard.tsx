import React from "react";
import { Card, TextField } from "components/ui/index";

export const DatabasePerformanceCard = ({
  performance,
  patch,
  readonly,
}: any) => {
  if (readonly) {
    return (
      <Card title="Performance & Optimization">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Indexing:</strong>{" "}
            {performance.indexingStrategy?.join(", ") || "—"}
          </li>
          <li>
            <strong>Caching Layer:</strong> {performance.cachingLayer || "—"}
          </li>
          <li>
            <strong>Query Optimizer:</strong> {performance.queryOptimizer}
          </li>
        </ul>
      </Card>
    );
  }

  return (
    <Card title="Performance Tuning">
      <TextField
        label="Caching Layer"
        value={performance.cachingLayer}
        onChange={(v) =>
          patch({ performance: { ...performance, cachingLayer: v } })
        }
      />
      <TextField
        label="Query Optimizer"
        value={performance.queryOptimizer}
        onChange={(v) =>
          patch({ performance: { ...performance, queryOptimizer: v } })
        }
      />
    </Card>
  );
};
