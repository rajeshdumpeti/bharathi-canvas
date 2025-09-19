import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiDownload, FiSave, FiTrash2 } from "react-icons/fi";
import type { Idea, IdeaStatus, IdeaType } from "types/innovationLab";
import {
  getIdeaById,
  upsertIdea,
  deleteIdea,
  ideaToMarkdown,
} from "./ideaStorage";

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

function TagInput({
  value,
  onChange,
  placeholder = "Add tag and press Enter",
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
      <div className="flex flex-wrap gap-2 mb-2">
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
      <span className="w-24 text-sm text-gray-600">{label}</span>
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
      {hint ? <span className="text-xs text-gray-400 ml-1">{hint}</span> : null}
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
      // ensure defaults for new fields
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
    <div className="h-full w-full">
      <div className="mx-auto w-full max-w-5xl p-4 space-y-4">
        {/* Top bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-50"
              onClick={() => navigate("/ideas")}
            >
              <FiArrowLeft /> Back
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-gray-50"
              onClick={onExportMd}
              title="Export Markdown"
            >
              <FiDownload /> Export
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
              onClick={save}
            >
              <FiSave /> Save
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
              onClick={onDelete}
            >
              <FiTrash2 /> Delete
            </button>
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-16">Status</span>
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
              <span className="text-sm text-gray-600 w-16">Type</span>
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

            <div className="flex items-center gap-2 justify-between">
              <span className="text-sm text-gray-600">ICE score</span>
              <Chip>{ice}</Chip>
            </div>
          </div>
        </div>

        {/* Scoring */}
        <div className="rounded-lg border bg-white p-4 space-y-3">
          <h3 className="font-semibold mb-1">Prioritization</h3>
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
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-2">Tags</h3>
          <TagInput
            value={idea.tags || []}
            onChange={(v) => patch("tags", v)}
            placeholder="Add a tag and press Enter (e.g., 'education', 'ai', 'mvp')"
          />
        </div>

        {/* Sections */}
        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-lg border bg-white p-4">
            <h3 className="font-semibold mb-2">Problem</h3>
            <textarea
              rows={5}
              value={idea.problem ?? ""}
              onChange={(e) => patch("problem", e.target.value)}
              placeholder="What problem are you solving?"
              className="w-full rounded-md border px-3 py-2"
            />
          </section>

          <section className="rounded-lg border bg-white p-4">
            <h3 className="font-semibold mb-2">Core approach</h3>
            <textarea
              rows={5}
              value={idea.coreApproach ?? ""}
              onChange={(e) => patch("coreApproach", e.target.value)}
              placeholder="How will you solve it? (no AI integration yet)"
              className="w-full rounded-md border px-3 py-2"
            />
          </section>

          <section className="rounded-lg border bg-white p-4">
            <h3 className="font-semibold mb-2">Value / Why now</h3>
            <textarea
              rows={5}
              value={idea.valueNotes ?? ""}
              onChange={(e) => patch("valueNotes", e.target.value)}
              placeholder="What’s the user/business value? Why is now the right time?"
              className="w-full rounded-md border px-3 py-2"
            />
          </section>

          <section className="rounded-lg border bg-white p-4">
            <h3 className="font-semibold mb-2">Risks</h3>
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

        {/* NEW: Target Audience */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-2">Target audience</h3>
          <TagInput
            value={idea.targetAudience ?? []}
            onChange={(v) => patch("targetAudience", v)}
            placeholder="Add a persona/segment and press Enter (e.g., 'CBSE students', 'Parents', 'School admins')"
          />
        </div>

        {/* NEW: Business Model */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-2">Business model</h3>
          <textarea
            rows={6}
            value={idea.businessModel ?? ""}
            onChange={(e) => patch("businessModel", e.target.value)}
            placeholder="Describe value proposition, pricing, channels, costs, and how this becomes a business."
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* NEW: SWOT */}
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-3">SWOT analysis</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-1">Strengths</h4>
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
              <h4 className="font-medium mb-1">Weaknesses</h4>
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
              <h4 className="font-medium mb-1">Opportunities</h4>
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
              <h4 className="font-medium mb-1">Threats</h4>
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
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-2">Links</h3>
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
            className="w-full rounded-md border px-3 py-2 font-mono text-sm"
          />
        </div>
        {/* footer tip */}
        <p className="text-xs text-gray-400 text-center">
          Changes update the draft locally; click <b>Save</b> to persist.
        </p>
      </div>
    </div>
  );
};

export default DetailView;
