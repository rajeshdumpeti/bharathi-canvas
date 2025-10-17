import React from "react";
import { Button, TextField } from "components/ui/index";

interface Service {
  name: string;
  language: string;
  runtime: string;
  repoUrl: string;
  owner: string;
}

interface ServicesEditorProps {
  value: Service[];
  onChange: (v: Service[]) => void;
}

export const ServicesEditor: React.FC<ServicesEditorProps> = ({
  value = [],
  onChange,
}) => {
  const add = () =>
    onChange([
      ...value,
      { name: "", language: "", runtime: "", repoUrl: "", owner: "" },
    ]);

  const set = (i: number, patch: Partial<Service>) => {
    const copy = [...value];
    copy[i] = { ...copy[i], ...patch };
    onChange(copy);
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm border rounded">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            {["Name", "Language", "Runtime", "Repo", "Owner", ""].map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium text-xs">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map((s, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">
                <TextField
                  size="sm"
                  value={s.name}
                  onChange={(v) => set(i, { name: v })}
                />
              </td>
              <td className="p-2">
                <TextField
                  size="sm"
                  value={s.language}
                  onChange={(v) => set(i, { language: v })}
                />
              </td>
              <td className="p-2">
                <TextField
                  size="sm"
                  value={s.runtime}
                  onChange={(v) => set(i, { runtime: v })}
                />
              </td>
              <td className="p-2">
                <TextField
                  size="sm"
                  value={s.repoUrl}
                  onChange={(v) => set(i, { repoUrl: v })}
                />
              </td>
              <td className="p-2">
                <TextField
                  size="sm"
                  value={s.owner}
                  onChange={(v) => set(i, { owner: v })}
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
          + Add Service
        </Button>
      </div>
    </div>
  );
};
