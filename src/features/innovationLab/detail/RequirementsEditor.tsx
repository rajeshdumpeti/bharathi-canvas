import React from "react";
import type {
  TechnicalRequirement,
  TechReqCategory,
} from "types/innovationLab";

const CATEGORIES: TechReqCategory[] = [
  "Frontend",
  "Backend",
  "ML",
  "Infra",
  "Data",
  "Integration",
  "Compliance",
  "Other",
];

export default function RequirementsEditor({
  items,
  onChange,
}: {
  items: TechnicalRequirement[] | undefined;
  onChange: (next: TechnicalRequirement[]) => void;
}) {
  const list = items ?? [];
  const update = (idx: number, patch: Partial<TechnicalRequirement>) => {
    const next = [...list];
    next[idx] = { required: true, ...next[idx], ...patch };
    onChange(next);
  };
  const add = () =>
    onChange([
      ...list,
      { name: "", required: true, category: "Backend" as TechReqCategory },
    ]);
  const remove = (idx: number) => onChange(list.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {list.length === 0 ? (
        <p className="text-sm text-gray-500">No items yet.</p>
      ) : (
        list.map((r, i) => (
          <div
            key={i}
            className="rounded-md border p-3 grid grid-cols-1 sm:grid-cols-12 gap-2"
          >
            <input
              value={r.name}
              onChange={(e) => update(i, { name: e.target.value })}
              placeholder="Requirement (e.g., Postgres, WebSockets)"
              className="sm:col-span-4 rounded-md border px-3 py-2"
            />
            <select
              value={r.category || "Backend"}
              onChange={(e) =>
                update(i, { category: e.target.value as TechReqCategory })
              }
              className="sm:col-span-3 rounded-md border px-3 py-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={r.required !== false}
                onChange={(e) => update(i, { required: e.target.checked })}
              />
              Required
            </label>
            <div className="sm:col-span-10">
              <input
                value={r.detail ?? ""}
                onChange={(e) => update(i, { detail: e.target.value })}
                placeholder="Notes (optional)"
                className="mt-2 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="sm:col-span-2 flex items-end justify-end">
              <button
                onClick={() => remove(i)}
                className="rounded-md border px-3 py-2 text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
      <button
        onClick={add}
        className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
      >
        Add requirement
      </button>
    </div>
  );
}
