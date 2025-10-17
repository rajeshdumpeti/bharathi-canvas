import React from "react";
import { Card, TextField } from "components/ui/index";

export const DatabaseGovernanceCard = ({
  governance,
  patch,
  readonly,
}: any) => {
  if (readonly) {
    return (
      <Card title="Data Governance & Compliance">
        <ul className="text-sm space-y-1">
          <li>
            <strong>Retention Policy:</strong>{" "}
            {governance?.piiHandling?.retentionPolicy || "—"}
          </li>
          <li>
            <strong>Masked Fields:</strong>{" "}
            {governance?.piiHandling?.maskedFields?.join(", ") || "—"}
          </li>
          <li>
            <strong>Audit Logging:</strong>{" "}
            {governance?.auditLogging?.enabled ? "Enabled" : "Disabled"}
          </li>
        </ul>
      </Card>
    );
  }

  return (
    <Card title="Data Governance">
      <div className="grid md:grid-cols-2 gap-4">
        <TextField
          label="Retention Policy"
          value={governance.piiHandling?.retentionPolicy}
          onChange={(v) =>
            patch({
              governance: {
                ...governance,
                piiHandling: { ...governance.piiHandling, retentionPolicy: v },
              },
            })
          }
        />
        <TextField
          label="Masked Fields (comma separated)"
          value={governance.piiHandling?.maskedFields?.join(", ")}
          onChange={(v) =>
            patch({
              governance: {
                ...governance,
                piiHandling: {
                  ...governance.piiHandling,
                  maskedFields: v.split(",").map((s) => s.trim()),
                },
              },
            })
          }
        />
      </div>
    </Card>
  );
};
