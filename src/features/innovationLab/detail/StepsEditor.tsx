import React from "react";
import type { StepItem } from "types/innovationLab";

export default function StepsEditor({
  items,
  onChange,
}: {
  items: StepItem[] | undefined;
  onChange: (next: StepItem[]) => void;
}) {
  const list = items ?? [];
  const add = () =>
    onChange([
      ...list,
      { id: Math.random().toString(36).slice(2, 9), text: "", done: false },
    ]);
  const update = (idx: number, patch: Partial<StepItem>) => {
    const next = [...list];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };
  const remove = (idx: number) => onChange(list.filter((_, i) => i !== idx));

  return (
    <div className="space-y-3">
      {list.length === 0 ? (
        <p className="text-sm text-gray-500">No steps yet.</p>
      ) : (
        list.map((s, i) => (
          <div
            key={s.id}
            className="flex items-center gap-2 rounded-md border p-2"
          >
            <input
              type="checkbox"
              checked={!!s.done}
              onChange={(e) => update(i, { done: e.target.checked })}
            />
            <input
              value={s.text}
              onChange={(e) => update(i, { text: e.target.value })}
              placeholder={`Step ${i + 1}`}
              className="flex-1 rounded-md border px-3 py-2"
            />
            <button
              onClick={() => remove(i)}
              className="rounded-md border px-3 py-2 text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))
      )}
      <button
        onClick={add}
        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
      >
        Add step
      </button>
    </div>
  );
}
