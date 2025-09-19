import React, { useMemo, useState } from "react";
import type { Idea, IdeaStatus, IdeaType, IdeaMilestone } from "types/ideas";
import ChipInput from "components/ui/ChipInput";

type Props = {
  idea: Idea;
  onSave: (updated: Idea) => void;
  onClose: () => void;
  onDelete?: (id: string) => void;
};

const typeOptions: IdeaType[] = [
  "Product",
  "Feature",
  "Tooling",
  "Research",
  "Infra",
];
const statusOptions: IdeaStatus[] = [
  "Draft",
  "Exploring",
  "Planned",
  "Building",
  "Shipped",
  "Archived",
];

export default function IdeaDetails({
  idea,
  onSave,
  onClose,
  onDelete,
}: Props) {
  const [form, setForm] = useState<Idea>(idea);
  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(idea),
    [form, idea]
  );

  const onChange = <K extends keyof Idea>(key: K, value: Idea[K]) =>
    setForm((f) => ({
      ...f,
      [key]: value,
      updatedAt: new Date().toISOString(),
    }));

  const addLink = () =>
    onChange("links", [...(form.links || []), { label: "", url: "" }]);

  const addMilestone = () =>
    onChange("milestones", [
      ...(form.milestones || []),
      { id: `ms-${Date.now()}`, name: "", goal: "", eta: "" } as IdeaMilestone,
    ]);

  const rmFrom = <K extends "links" | "milestones">(key: K, idx: number) =>
    onChange(key, (form[key] || []).filter((_, i) => i !== idx) as any);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Edit Idea</h3>
        <div className="flex gap-2">
          {onDelete && (
            <button
              onClick={() => onDelete(form.id)}
              className="px-3 py-2 rounded bg-red-600 text-white"
            >
              Delete
            </button>
          )}
          <button onClick={onClose} className="px-3 py-2 rounded border">
            Close
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={!dirty}
            className={`px-3 py-2 rounded ${dirty ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Top row */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">One-liner</label>
          <input
            value={form.oneLiner || ""}
            onChange={(e) => onChange("oneLiner", e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Short summary of the idea"
          />
        </div>
      </div>

      {/* Type / Status / Scores */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Type</label>
          <select
            value={form.ideaType}
            onChange={(e) => onChange("ideaType", e.target.value as IdeaType)}
            className="w-full rounded border px-3 py-2"
          >
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => onChange("status", e.target.value as IdeaStatus)}
            className="w-full rounded border px-3 py-2"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(["impact", "effort", "confidence"] as const).map((k) => (
            <div key={k}>
              <label className="block text-xs text-gray-600 mb-1 capitalize">
                {k}
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={(form[k] as number | undefined) ?? 3}
                onChange={(e) =>
                  onChange(
                    k,
                    Math.max(1, Math.min(5, Number(e.target.value) || 3)) as any
                  )
                }
                className="w-full rounded border px-2 py-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Tags</label>
        <ChipInput
          value={form.tags}
          onChange={(v) => onChange("tags", v)}
          placeholder="Add a tag"
        />
      </div>

      {/* Narrative sections */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Problem</label>
          <textarea
            rows={4}
            value={form.problem || ""}
            onChange={(e) => onChange("problem", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Core Approach
          </label>
          <textarea
            rows={4}
            value={form.coreApproach || ""}
            onChange={(e) => onChange("coreApproach", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Data needs</label>
          <textarea
            rows={3}
            value={form.dataNeeds || ""}
            onChange={(e) => onChange("dataNeeds", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Value notes
          </label>
          <textarea
            rows={3}
            value={form.valueNotes || ""}
            onChange={(e) => onChange("valueNotes", e.target.value)}
            className="w-full rounded border px-3 py-2"
          />
        </div>
      </div>

      {/* Links */}
      <section>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Links</h4>
          <button onClick={addLink} className="px-2 py-1 rounded border">
            Add link
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {(form.links || []).map((lnk, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-2">
              <input
                placeholder="Label"
                value={lnk.label || ""}
                onChange={(e) => {
                  const next = [...(form.links || [])];
                  next[i] = { ...next[i], label: e.target.value };
                  onChange("links", next);
                }}
                className="rounded border px-2 py-1"
              />
              <input
                placeholder="https://…"
                value={lnk.url}
                onChange={(e) => {
                  const next = [...(form.links || [])];
                  next[i] = { ...next[i], url: e.target.value };
                  onChange("links", next);
                }}
                className="rounded border px-2 py-1"
              />
              <div className="col-span-full">
                <button
                  onClick={() => rmFrom("links", i)}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Milestones</h4>
          <button onClick={addMilestone} className="px-2 py-1 rounded border">
            Add milestone
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {(form.milestones || []).map((ms, i) => (
            <div key={ms.id} className="grid md:grid-cols-3 gap-2">
              <input
                placeholder="Name"
                value={ms.name}
                onChange={(e) => {
                  const next = [...(form.milestones || [])];
                  next[i] = { ...next[i], name: e.target.value };
                  onChange("milestones", next);
                }}
                className="rounded border px-2 py-1"
              />
              <input
                placeholder="Goal"
                value={ms.goal}
                onChange={(e) => {
                  const next = [...(form.milestones || [])];
                  next[i] = { ...next[i], goal: e.target.value };
                  onChange("milestones", next);
                }}
                className="rounded border px-2 py-1"
              />
              <input
                type="date"
                value={(ms.eta || "").slice(0, 10)}
                onChange={(e) => {
                  const next = [...(form.milestones || [])];
                  next[i] = { ...next[i], eta: e.target.value };
                  onChange("milestones", next);
                }}
                className="rounded border px-2 py-1"
              />
              <div className="col-span-full">
                <button
                  onClick={() => rmFrom("milestones", i)}
                  className="text-sm text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Notes</label>
        <textarea
          rows={4}
          value={form.notes || ""}
          onChange={(e) => onChange("notes", e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>
    </div>
  );
}
