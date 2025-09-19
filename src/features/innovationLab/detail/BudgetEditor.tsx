import React from "react";
import type { Idea } from "types/innovationLab";
import { TagInput } from "./ui";

export default function BudgetEditor({
  value,
  onChange,
}: {
  value: Idea["budget"];
  onChange: (next: NonNullable<Idea["budget"]>) => void;
}) {
  const v = value ?? {
    currency: "₹",
    freeOptions: [],
    oneTimeCosts: [],
    monthlyCosts: [],
    oneTimeTotal: 0,
    monthlyTotal: 0,
    notes: "",
  };
  const patch = (p: Partial<typeof v>) => onChange({ ...v, ...p });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          value={v.currency ?? ""}
          onChange={(e) => patch({ currency: e.target.value })}
          placeholder="Currency (₹ / $ / €)"
          className="rounded-md border px-3 py-2"
        />
        <input
          type="number"
          value={v.oneTimeTotal ?? 0}
          onChange={(e) => patch({ oneTimeTotal: Number(e.target.value) || 0 })}
          placeholder="One-time total"
          className="rounded-md border px-3 py-2"
        />
        <input
          type="number"
          value={v.monthlyTotal ?? 0}
          onChange={(e) => patch({ monthlyTotal: Number(e.target.value) || 0 })}
          placeholder="Monthly total"
          className="rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <h4 className="mb-1 font-medium">Free options</h4>
        <TagInput
          value={v.freeOptions ?? []}
          onChange={(next) => patch({ freeOptions: next })}
          placeholder="Add a free library/service and press Enter"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="mb-1 font-medium">One-time costs</h4>
          <TagInput
            value={v.oneTimeCosts ?? []}
            onChange={(next) => patch({ oneTimeCosts: next })}
            placeholder="Add a one-time cost item"
          />
        </div>
        <div>
          <h4 className="mb-1 font-medium">Monthly costs</h4>
          <TagInput
            value={v.monthlyCosts ?? []}
            onChange={(next) => patch({ monthlyCosts: next })}
            placeholder="Add a monthly cost item"
          />
        </div>
      </div>

      <textarea
        rows={3}
        value={v.notes ?? ""}
        onChange={(e) => patch({ notes: e.target.value })}
        placeholder="Budget notes (optional)"
        className="w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}
