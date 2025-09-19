import React from "react";
import type { Idea } from "types/innovationLab";
import { NumberChip, TagInput } from "./ui";

export default function FeasibilityEditor({
  value,
  onChange,
}: {
  value: Idea["solo"];
  onChange: (next: NonNullable<Idea["solo"]>) => void;
}) {
  const v = value ?? {
    difficulty: 0,
    feasibility: 0,
    timelineWeeks: 0,
    pros: [],
    challenges: [],
  };
  const patch = (p: Partial<typeof v>) => onChange({ ...v, ...p });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <NumberChip
          label="Difficulty"
          value={v.difficulty}
          onChange={(n) => patch({ difficulty: n })}
          hint="0–5"
        />
        <NumberChip
          label="Feasibility"
          value={v.feasibility}
          onChange={(n) => patch({ feasibility: n })}
          hint="0–5"
        />
        <div className="flex items-center gap-2">
          <span className="w-28 text-sm text-gray-600">Timeline</span>
          <input
            type="number"
            value={v.timelineWeeks ?? 0}
            onChange={(e) =>
              patch({ timelineWeeks: Number(e.target.value) || 0 })
            }
            className="w-28 rounded-md border px-3 py-2"
          />
          <span className="text-sm text-gray-600">weeks</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="mb-1 font-medium">Pros</h4>
          <TagInput
            value={v.pros ?? []}
            onChange={(next) => patch({ pros: next })}
            placeholder="Add a pro and press Enter"
          />
        </div>
        <div>
          <h4 className="mb-1 font-medium">Challenges</h4>
          <TagInput
            value={v.challenges ?? []}
            onChange={(next) => patch({ challenges: next })}
            placeholder="Add a challenge and press Enter"
          />
        </div>
      </div>
    </div>
  );
}
