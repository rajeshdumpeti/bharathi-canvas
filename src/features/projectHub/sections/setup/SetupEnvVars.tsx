import React from "react";
import { Card, Empty, TextField, IconButton } from "components/ui/index";
import { updateAt, removeAt } from "utils/immutables";

interface Props {
  form: any;
  patch?: (p: any) => void;
  readonly?: boolean;
}

export const SetupEnvVars: React.FC<Props> = ({ form, patch, readonly }) => {
  if (readonly) {
    return (
      <Card title="Environment Variables">
        {form.envVars?.length ? (
          <table className="min-w-full text-sm border-t">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2 pr-3">Key</th>
                <th className="py-2 pr-3">Value</th>
                <th className="py-2 pr-3">Secret</th>
                <th className="py-2">Description</th>
              </tr>
            </thead>
            <tbody>
              {form.envVars.map((v: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-3 font-mono">{v.key || "—"}</td>
                  <td className="py-2 pr-3 font-mono">
                    {v.secret ? "••••••" : v.value || "—"}
                  </td>
                  <td className="py-2 pr-3">{v.secret ? "Yes" : "No"}</td>
                  <td className="py-2">{v.description || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Empty text="No environment variables defined." />
        )}
      </Card>
    );
  }

  return (
    <Card title="Environment Variables">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-3">Key</th>
            <th className="py-2 pr-3">Value</th>
            <th className="py-2 pr-3">Secret</th>
            <th className="py-2 pr-3">Description</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {form.envVars.map((row: any, i: number) => (
            <tr key={i} className="border-t">
              <td className="py-2 pr-3">
                <TextField
                  value={row.key}
                  onChange={(v) =>
                    patch?.({ envVars: updateAt(form.envVars, i, { key: v }) })
                  }
                />
              </td>
              <td className="py-2 pr-3">
                <TextField
                  value={row.value}
                  onChange={(v) =>
                    patch?.({
                      envVars: updateAt(form.envVars, i, { value: v }),
                    })
                  }
                />
              </td>
              <td className="py-2 pr-3">
                <select
                  value={row.secret ? "yes" : "no"}
                  onChange={(e) =>
                    patch?.({
                      envVars: updateAt(form.envVars, i, {
                        secret: e.target.value === "yes",
                      }),
                    })
                  }
                  className="rounded border px-2 py-1"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </td>
              <td className="py-2 pr-3">
                <TextField
                  value={row.description}
                  onChange={(v) =>
                    patch?.({
                      envVars: updateAt(form.envVars, i, { description: v }),
                    })
                  }
                />
              </td>
              <td className="py-2">
                <IconButton
                  variant="ghost"
                  onClick={() =>
                    patch?.({ envVars: removeAt(form.envVars, i) })
                  }
                >
                  Remove
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <IconButton
          variant="neutral"
          onClick={() =>
            patch?.({
              envVars: [
                ...form.envVars,
                { key: "", value: "", secret: false, description: "" },
              ],
            })
          }
        >
          Add variable
        </IconButton>
      </div>
    </Card>
  );
};
