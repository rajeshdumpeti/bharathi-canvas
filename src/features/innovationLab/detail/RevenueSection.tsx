import React from "react";
import type { Idea } from "types/innovationLab";
import { NumberChip, TagInput } from "./ui";

const PRESETS = [
  { label: "Tiny niche", v: 1, hint: "Hobby / side-project scale" },
  { label: "Long tail", v: 2, hint: "Small TAM, many users needed" },
  { label: "Niche B2B", v: 3, hint: "Clear buyer, modest ACV" },
  { label: "SMB SaaS", v: 4, hint: "Recurring, scalable" },
  { label: "Enterprise", v: 5, hint: "High ACV, long sales" },
  { label: "Platform/Network", v: 5, hint: "Marketplace / API / infra" },
];

export default function RevenueSection({
  idea,
  onPatch,
}: {
  idea: Idea;
  onPatch: <K extends keyof Idea>(key: K, value: Idea[K]) => void;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
      <h3 className="font-semibold">Revenue potential</h3>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onPatch("revenuePotential", p.v as any)}
            title={p.hint}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              (idea.revenuePotential ?? 0) === p.v
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Slider */}
      <NumberChip
        label="Score"
        value={idea.revenuePotential}
        onChange={(n) => onPatch("revenuePotential", n as any)}
        hint="0–5"
      />

      {/* Signals */}
      <div>
        <h4 className="mb-1 text-sm font-medium text-gray-700">
          Revenue signals (tags)
        </h4>
        <TagInput
          value={idea.revenueSignals ?? []}
          onChange={(v) => onPatch("revenueSignals", v as any)}
          placeholder="Add signals like 'Usage-based', 'High LTV', 'Low CAC', 'Enterprise', 'Self-serve', 'Marketplace'"
        />
      </div>

      {/* Notes */}
      <textarea
        rows={3}
        value={idea.revenueNotes ?? ""}
        onChange={(e) => onPatch("revenueNotes", e.target.value as any)}
        placeholder="Notes: pricing model, ACV, CAC/Payback, LTV, sales motion…"
        className="w-full rounded-md border px-3 py-2"
      />
    </section>
  );
}
