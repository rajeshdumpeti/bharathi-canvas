import React from "react";
import type { Idea } from "types/innovationLab";
import { NumberChip } from "./ui";

export default function Prioritization({
  idea,
  onPatch,
}: {
  idea: Idea;
  onPatch: <K extends keyof Idea>(key: K, value: Idea[K]) => void;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <h3 className="mb-1 font-semibold">Prioritization</h3>
      <NumberChip
        label="Impact"
        value={idea.impact}
        onChange={(n) => onPatch("impact", n as any)}
        hint="0–5"
      />
      <NumberChip
        label="Confidence"
        value={idea.confidence}
        onChange={(n) => onPatch("confidence", n as any)}
        hint="0–5"
      />
      <NumberChip
        label="Effort"
        value={idea.effort}
        onChange={(n) => onPatch("effort", n as any)}
        hint="0–5 (lower is better)"
      />
    </div>
  );
}
