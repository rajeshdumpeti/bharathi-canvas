import React from "react";
import { SelectField, TextField, Button } from "components/ui/index";

interface Api {
  name: string;
  method: string;
  path: string;
  auth: string;
  service: string;
  description: string;
}

interface ApiEditorProps {
  value: Api[];
  onChange: (v: Api[]) => void;
}

export const ApiEditor: React.FC<ApiEditorProps> = ({
  value = [],
  onChange,
}) => {
  const add = () =>
    onChange([
      ...value,
      {
        name: "",
        method: "GET",
        path: "",
        auth: "None",
        service: "",
        description: "",
      },
    ]);

  const set = (i: number, patch: Partial<Api>) => {
    const copy = [...value];
    copy[i] = { ...copy[i], ...patch };
    onChange(copy);
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm border rounded">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-xs">
            {[
              "Name",
              "Method",
              "Path",
              "Auth",
              "Service",
              "Description",
              "",
            ].map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map((a, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">
                <TextField
                  size="sm"
                  value={a.name}
                  onChange={(v) => set(i, { name: v })}
                />
              </td>
              <td className="p-2">
                <SelectField
                  size="sm"
                  value={a.method}
                  onChange={(v) => set(i, { method: v })}
                  options={["GET", "POST", "PUT", "PATCH", "DELETE"]}
                />
              </td>
              <td className="p-2">
                <TextField
                  size="sm"
                  className="font-mono"
                  value={a.path}
                  onChange={(v) => set(i, { path: v })}
                />
              </td>
              <td className="p-2">
                <SelectField
                  size="sm"
                  value={a.auth}
                  onChange={(v) => set(i, { auth: v })}
                  options={["None", "API Key", "OAuth2", "JWT"]}
                />
              </td>
              <td className="p-2">
                <TextField
                  size="sm"
                  value={a.service}
                  onChange={(v) => set(i, { service: v })}
                />
              </td>
              <td className="p-2">
                <TextField
                  size="sm"
                  value={a.description}
                  onChange={(v) => set(i, { description: v })}
                />
              </td>
              <td className="p-2 text-right">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => remove(i)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        <Button type="button" size="sm" variant="primary" onClick={add}>
          + Add API
        </Button>
      </div>
    </div>
  );
};
