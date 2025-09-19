import React from "react";
import type { Idea } from "types/innovationLab";

export default function NarrativeSections({
  idea,
  onPatch,
}: {
  idea: Idea;
  onPatch: <K extends keyof Idea>(key: K, value: Idea[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Problem */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <h3 className="mb-2 font-semibold">Problem</h3>
        <textarea
          rows={5}
          value={idea.problem ?? ""}
          onChange={(e) => onPatch("problem", e.target.value as any)}
          placeholder="What problem are you solving?"
          className="w-full rounded-md border px-3 py-2"
        />
      </section>

      {/* Core approach */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <h3 className="mb-2 font-semibold">Core approach</h3>
        <textarea
          rows={5}
          value={idea.coreApproach ?? ""}
          onChange={(e) => onPatch("coreApproach", e.target.value as any)}
          placeholder="How will you solve it? (no AI integration yet)"
          className="w-full rounded-md border px-3 py-2"
        />
      </section>

      {/* Value / Why now */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <h3 className="mb-2 font-semibold">Value / Why now</h3>
        <textarea
          rows={5}
          value={idea.valueNotes ?? ""}
          onChange={(e) => onPatch("valueNotes", e.target.value as any)}
          placeholder="What’s the user/business value? Why is now the right time?"
          className="w-full rounded-md border px-3 py-2"
        />
      </section>

      {/* Risks */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
        <h3 className="mb-2 font-semibold">Risks</h3>
        <textarea
          rows={5}
          value={(idea.risks ?? []).join("\n")}
          onChange={(e) =>
            onPatch(
              "risks",
              e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean) as any
            )
          }
          placeholder="One risk per line"
          className="w-full rounded-md border px-3 py-2"
        />
      </section>
    </div>
  );
}
