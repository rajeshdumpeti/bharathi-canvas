import React from "react";
import { Button, TextField } from "components/ui/index";

interface Column {
  key: string;
  label: string;
}

interface SimpleListEditorProps<T extends Record<string, any>> {
  value: T[];
  onChange: (v: T[]) => void;
  columns: Column[];
}

export const SimpleListEditor = <T extends Record<string, any>>({
  value = [],
  onChange,
  columns,
}: SimpleListEditorProps<T>) => {
  const add = () =>
    onChange([
      ...value,
      Object.fromEntries(columns.map((c) => [c.key, ""])) as T,
    ]);

  const set = (i: number, key: string, val: any) => {
    const copy = [...value];
    copy[i] = { ...copy[i], [key]: val };
    onChange(copy);
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm border rounded">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-xs">
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-left font-medium">
                {c.label}
              </th>
            ))}
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {value.map((row, i) => (
            <tr key={i} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="p-2">
                  <TextField
                    size="sm"
                    value={row[c.key] ?? ""}
                    onChange={(v) => set(i, c.key, v)}
                  />
                </td>
              ))}
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
          + Add Row
        </Button>
      </div>
    </div>
  );
};
