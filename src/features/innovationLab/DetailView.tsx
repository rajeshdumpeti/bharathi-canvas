// src/features/innovationLab/DetailView.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiSave, FiTrash2 } from "react-icons/fi";
import { exportIdeaAsPdf } from "./pdf/exportIdeaPdf";
import type {
  Idea,
  IdeaStatus,
  IdeaType,
  TechnicalRequirement,
  TechReqCategory,
  StepItem,
} from "types/innovationLab";
import {
  getIdeaById,
  upsertIdea,
  deleteIdea,
  ideaToMarkdown,
} from "./ideaStorage";

/* --------------------- constants --------------------- */
const STATUSES: IdeaStatus[] = [
  "Draft",
  "Exploring",
  "Planned",
  "Building",
  "Shipped",
  "Archived",
];
const TYPES: IdeaType[] = [
  "Product",
  "Feature",
  "Tooling",
  "Research",
  "Infra",
];
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

/* --------------------- small helpers --------------------- */
function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
      {children}
    </span>
  );
}

/** Generic tag editor (string[]) */
function TagInput({
  value,
  onChange,
  placeholder = "Add item and press Enter",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  const add = (t: string) => {
    const v = t.trim();
    if (!v) return;
    if (value.includes(v)) return;
    onChange([...value, v]);
    setDraft("");
  };
  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-2">
        {value.map((t) => (
          <Chip key={t}>
            {t}
            <button
              className="ml-1 text-gray-400 hover:text-gray-700"
              onClick={() => onChange(value.filter((x) => x !== t))}
              type="button"
              aria-label={`Remove ${t}`}
              title="Remove"
            >
              ×
            </button>
          </Chip>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          }
        }}
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}

function NumberChip({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number | undefined;
  onChange: (n: number) => void;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-28 text-sm text-gray-600">{label}</span>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value ?? 0}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="flex-1"
      />
      <Chip>{value ?? 0}/5</Chip>
      {hint ? <span className="ml-1 text-xs text-gray-400">{hint}</span> : null}
    </div>
  );
}

/* --------------------- Section editors --------------------- */

function RequirementsEditor({
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

function BudgetEditor({
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

function FeasibilityEditor({
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

function StepsEditor({
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
        className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
      >
        Add step
      </button>
    </div>
  );
}

/* --------------------- main view --------------------- */
const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [notFound, setNotFound] = useState(false);

  // initial load
  useEffect(() => {
    if (!id) return;
    const rec = getIdeaById(id);
    if (!rec) {
      setNotFound(true);
    } else {
      setIdea({
        ...rec,
        swot: rec.swot ?? {
          strengths: [],
          weaknesses: [],
          opportunities: [],
          threats: [],
        },
        businessModel: rec.businessModel ?? "",
        targetAudience: rec.targetAudience ?? [],
        technicalRequirements: rec.technicalRequirements ?? [],
        budget: rec.budget ?? undefined,
        solo: rec.solo ?? undefined,
        recommendation: rec.recommendation ?? "",
        revenuePotential:
          typeof rec.revenuePotential === "number" ? rec.revenuePotential : 0,
        steps: rec.steps ?? [],
      });
    }
  }, [id]);

  // derived ICE score
  const ice = useMemo(() => {
    const i = idea;
    if (!i) return 0;
    return (i.impact ?? 0) + (i.confidence ?? 0) - (i.effort ?? 0);
  }, [idea]);

  const patch = <K extends keyof Idea>(key: K, value: Idea[K]) => {
    if (!idea) return;
    const next: Idea = {
      ...idea,
      [key]: value,
      updatedAt: new Date().toISOString(),
    };
    setIdea(next);
  };

  const save = () => {
    if (!idea) return;
    upsertIdea(idea);
    navigate("/ideas");
  };

  const onExportMd = () => {
    if (!idea) return;
    const md = ideaToMarkdown(idea);
    const safe = (idea.title || "idea").replace(/[^\w.-]+/g, "_");
    downloadText(`${safe}.md`, md);
  };

  const onExportPdf = () => {
    if (!idea) return;
    exportIdeaAsPdf(idea);
  };

  const onDelete = () => {
    if (!idea) return;
    const ok = window.confirm("Delete this idea? This cannot be undone.");
    if (!ok) return;
    deleteIdea(idea.id);
    navigate("/ideas");
  };

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-3xl p-4">
        <div className="rounded-lg border bg-white p-6">
          <p className="text-gray-700">Idea not found.</p>
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-50"
            onClick={() => navigate("/ideas")}
          >
            <FiArrowLeft /> Back to Innovation Lab
          </button>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 space-y-5">
        {/* Top bar */}
        <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 mb-1 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100 px-4 sm:px-6 py-2">
          <div className="mx-auto max-w-5xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-gray-700 hover:bg-white shadow-sm"
                onClick={() => navigate("/ideas")}
              >
                <FiArrowLeft /> Back
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-gray-700 hover:bg-white shadow-sm"
                onClick={onExportMd}
                title="Export Markdown"
              >
                <FiDownload /> Export
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-gray-700 hover:bg-white shadow-sm"
                onClick={onExportPdf}
                title="Download PDF"
              >
                <FiDownload /> Download PDF
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-2 text-white shadow-sm hover:from-indigo-700 hover:to-blue-700 active:translate-y-[1px]"
                onClick={save}
              >
                <FiSave /> Save
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-2 text-rose-700 hover:bg-rose-100 border border-rose-100"
                onClick={onDelete}
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Title & meta */}
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <input
            value={idea.title}
            onChange={(e) => patch("title", e.target.value)}
            placeholder="Idea title"
            className="w-full text-2xl font-semibold outline-none"
          />
          <input
            value={idea.oneLiner ?? ""}
            onChange={(e) => patch("oneLiner", e.target.value)}
            placeholder="One-liner (what/why in one sentence)"
            className="w-full rounded-md border px-3 py-2"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <span className="w-16 text-sm text-gray-600">Status</span>
              <select
                value={idea.status}
                onChange={(e) => patch("status", e.target.value as IdeaStatus)}
                className="flex-1 rounded-md border px-2 py-2"
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-16 text-sm text-gray-600">Type</span>
              <select
                value={idea.ideaType}
                onChange={(e) => patch("ideaType", e.target.value as IdeaType)}
                className="flex-1 rounded-md border px-2 py-2"
              >
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-gray-600">ICE score</span>
              <Chip>{ice}</Chip>
            </div>
          </div>
        </div>

        {/* Prioritization */}
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <h3 className="mb-1 font-semibold">Prioritization</h3>
          <NumberChip
            label="Impact"
            value={idea.impact}
            onChange={(n) => patch("impact", n)}
            hint="0–5"
          />
          <NumberChip
            label="Confidence"
            value={idea.confidence}
            onChange={(n) => patch("confidence", n)}
            hint="0–5"
          />
          <NumberChip
            label="Effort"
            value={idea.effort}
            onChange={(n) => patch("effort", n)}
            hint="0–5 (lower is better)"
          />
        </div>

        {/* Tags */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Tags</h3>
          <TagInput
            value={idea.tags || []}
            onChange={(v) => patch("tags", v)}
            placeholder="Add a tag and press Enter (e.g., 'education', 'ai', 'mvp')"
          />
        </div>

        {/* Problem / Approach / Value / Risks */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="mb-2 font-semibold">Problem</h3>
            <textarea
              rows={5}
              value={idea.problem ?? ""}
              onChange={(e) => patch("problem", e.target.value)}
              placeholder="What problem are you solving?"
              className="w-full rounded-md border px-3 py-2"
            />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="mb-2 font-semibold">Core approach</h3>
            <textarea
              rows={5}
              value={idea.coreApproach ?? ""}
              onChange={(e) => patch("coreApproach", e.target.value)}
              placeholder="How will you solve it? (no AI integration yet)"
              className="w-full rounded-md border px-3 py-2"
            />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="mb-2 font-semibold">Value / Why now</h3>
            <textarea
              rows={5}
              value={idea.valueNotes ?? ""}
              onChange={(e) => patch("valueNotes", e.target.value)}
              placeholder="What’s the user/business value? Why is now the right time?"
              className="w-full rounded-md border px-3 py-2"
            />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="mb-2 font-semibold">Risks</h3>
            <textarea
              rows={5}
              value={(idea.risks ?? []).join("\n")}
              onChange={(e) =>
                patch(
                  "risks",
                  e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              placeholder="One risk per line"
              className="w-full rounded-md border px-3 py-2"
            />
          </section>
        </div>

        {/* Technical requirements */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Technical requirements</h3>
          <RequirementsEditor
            items={idea.technicalRequirements}
            onChange={(next) => patch("technicalRequirements", next)}
          />
        </div>

        {/* Budget */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Budget breakdown</h3>
          <BudgetEditor
            value={idea.budget}
            onChange={(next) => patch("budget", next)}
          />
        </div>

        {/* Solo developer feasibility */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Solo developer feasibility</h3>
          <FeasibilityEditor
            value={idea.solo}
            onChange={(next) => patch("solo", next)}
          />
        </div>

        {/* Recommendation + Revenue */}
        {/* Recommendation + Revenue */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
            <h3 className="mb-2 font-semibold">Recommendation</h3>
            <textarea
              rows={6}
              value={idea.recommendation ?? ""}
              onChange={(e) => patch("recommendation", e.target.value)}
              placeholder="Verdict and suggested next step."
              className="w-full rounded-md border px-3 py-2"
            />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="font-semibold">Revenue potential</h3>

            {/* 1) Quick presets (real-world) */}
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Tiny niche",
                  v: 1,
                  hint: "Hobby / side-project scale",
                },
                {
                  label: "Long tail",
                  v: 2,
                  hint: "Small TAM, many users needed",
                },
                { label: "Niche B2B", v: 3, hint: "Clear buyer, modest ACV" },
                { label: "SMB SaaS", v: 4, hint: "Recurring, scalable" },
                { label: "Enterprise", v: 5, hint: "High ACV, long sales" },
                {
                  label: "Platform/Network",
                  v: 5,
                  hint: "Marketplace / API / infra",
                },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => patch("revenuePotential", p.v as any)}
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

            {/* 2) Slider */}
            <NumberChip
              label="Score"
              value={idea.revenuePotential}
              onChange={(n) => patch("revenuePotential", n)}
              hint="0–5"
            />

            {/* 3) Quick signals */}
            <div>
              <h4 className="mb-1 text-sm font-medium text-gray-700">
                Revenue signals (tags)
              </h4>
              <TagInput
                value={idea.revenueSignals ?? []}
                onChange={(v) => patch("revenueSignals", v as any)}
                placeholder="Add signals like 'Usage-based', 'High LTV', 'Low CAC', 'Enterprise', 'Self-serve', 'Marketplace'"
              />
            </div>

            {/* 4) Notes */}
            <textarea
              rows={3}
              value={idea.revenueNotes ?? ""}
              onChange={(e) => patch("revenueNotes", e.target.value as any)}
              placeholder="Notes: pricing model, ACV, CAC/Payback, LTV, sales motion…"
              className="w-full rounded-md border px-3 py-2"
            />
          </section>
        </div>

        {/* Steps */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Step-by-step approach</h3>
          <StepsEditor
            items={idea.steps}
            onChange={(next) => patch("steps", next)}
          />
        </div>

        {/* Target audience / Business model / SWOT */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Target audience</h3>
          <TagInput
            value={idea.targetAudience ?? []}
            onChange={(v) => patch("targetAudience", v)}
            placeholder="Add a persona/segment and press Enter (e.g., 'CBSE students', 'Parents', 'School admins')"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Business model</h3>
          <textarea
            rows={6}
            value={idea.businessModel ?? ""}
            onChange={(e) => patch("businessModel", e.target.value)}
            placeholder="Describe value proposition, pricing, channels, costs, and how this becomes a business."
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-3 font-semibold">SWOT analysis</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-1 font-medium">Strengths</h4>
              <TagInput
                value={idea.swot?.strengths ?? []}
                onChange={(v) =>
                  patch("swot", {
                    strengths: v,
                    weaknesses: idea.swot?.weaknesses ?? [],
                    opportunities: idea.swot?.opportunities ?? [],
                    threats: idea.swot?.threats ?? [],
                  } as Idea["swot"])
                }
                placeholder="Add a strength and press Enter"
              />
            </div>
            <div>
              <h4 className="mb-1 font-medium">Weaknesses</h4>
              <TagInput
                value={idea.swot?.weaknesses ?? []}
                onChange={(v) =>
                  patch("swot", {
                    strengths: idea.swot?.strengths ?? [],
                    weaknesses: v,
                    opportunities: idea.swot?.opportunities ?? [],
                    threats: idea.swot?.threats ?? [],
                  } as Idea["swot"])
                }
                placeholder="Add a weakness and press Enter"
              />
            </div>
            <div>
              <h4 className="mb-1 font-medium">Opportunities</h4>
              <TagInput
                value={idea.swot?.opportunities ?? []}
                onChange={(v) =>
                  patch("swot", {
                    strengths: idea.swot?.strengths ?? [],
                    weaknesses: idea.swot?.weaknesses ?? [],
                    opportunities: v,
                    threats: idea.swot?.threats ?? [],
                  } as Idea["swot"])
                }
                placeholder="Add an opportunity and press Enter"
              />
            </div>
            <div>
              <h4 className="mb-1 font-medium">Threats</h4>
              <TagInput
                value={idea.swot?.threats ?? []}
                onChange={(v) =>
                  patch("swot", {
                    strengths: idea.swot?.strengths ?? [],
                    weaknesses: idea.swot?.weaknesses ?? [],
                    opportunities: idea.swot?.opportunities ?? [],
                    threats: v,
                  } as Idea["swot"])
                }
                placeholder="Add a threat and press Enter"
              />
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Links</h3>
          <textarea
            rows={4}
            value={(idea.links ?? [])
              .map((l) => `${l.label ?? ""}|${l.url}`)
              .join("\n")}
            onChange={(e) =>
              patch(
                "links",
                e.target.value
                  .split("\n")
                  .map((row) => row.trim())
                  .filter(Boolean)
                  .map((row) => {
                    const [label, url] = row.split("|");
                    return {
                      label: label?.trim() || undefined,
                      url: (url || label || "").trim(),
                    };
                  })
              )
            }
            placeholder="Each line: Label|https://example.com  (Label optional)"
            className="w-full Rounded-md border px-3 py-2 font-mono text-sm"
          />
        </div>

        <p className="text-center text-xs text-gray-400">
          Changes update the draft locally; click <b>Save</b> to persist.
        </p>
      </div>
    </div>
  );
};

export default DetailView;
