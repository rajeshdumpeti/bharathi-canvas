import React from "react";
import type { Idea } from "types/innovationLab";

export default function Recommendation({
  idea,
  onPatch,
}: {
  idea: Idea;
  onPatch: <K extends keyof Idea>(key: K, value: Idea[K]) => void;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <h3 className="mb-2 font-semibold">Recommendation</h3>
      <textarea
        rows={6}
        value={idea.recommendation ?? ""}
        onChange={(e) => onPatch("recommendation", e.target.value as any)}
        placeholder="Verdict and suggested next step."
        className="w-full rounded-md border px-3 py-2"
      />
    </section>
  );
}
