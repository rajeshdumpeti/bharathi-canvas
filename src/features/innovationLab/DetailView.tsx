import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { exportIdeaAsPdf } from "./pdf/exportIdeaPdf";
import type { Idea, IdeaStatus, IdeaType } from "types/innovationLab";
import {
  getIdeaById,
  upsertIdea,
  deleteIdea,
  ideaToMarkdown,
} from "./ideaStorage";

/** sections */
import TopBar from "./detail/TopBar";
import TitleMeta from "./detail/TitleMeta";
import Prioritization from "./detail/Prioritization";
import TagsSection from "./detail/TagsSection";
import NarrativeSections from "./detail/NarrativeSections";
import RequirementsEditor from "./detail/RequirementsEditor";
import BudgetEditor from "./detail/BudgetEditor";
import FeasibilityEditor from "./detail/FeasibilityEditor";
import Recommendation from "./detail/Recommendation";
import RevenueSection from "./detail/RevenueSection";
import StepsEditor from "./detail/StepsEditor";

/* constants */
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

/* --- helpers --- */
function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const DetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [notFound, setNotFound] = useState(false);

  /* initial load */
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

  /* derived ICE */
  const ice = useMemo(() => {
    if (!idea) return 0;
    return (idea.impact ?? 0) + (idea.confidence ?? 0) - (idea.effort ?? 0);
  }, [idea]);

  /* patch helper */
  const patch = <K extends keyof Idea>(key: K, value: Idea[K]) => {
    if (!idea) return;
    setIdea({
      ...idea,
      [key]: value,
      updatedAt: new Date().toISOString(),
    });
  };

  /* actions */
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
            className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
            onClick={() => navigate("/ideas")}
          >
            Back to Innovation Lab
          </button>
        </div>
      </div>
    );
  }

  if (!idea) return null;

  return (
    <div className="h-full w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 space-y-5">
        <TopBar
          onBack={() => navigate("/ideas")}
          onExportMd={onExportMd}
          onExportPdf={onExportPdf}
          onSave={save}
          onDelete={onDelete}
        />

        <TitleMeta
          idea={idea}
          ice={ice}
          statuses={STATUSES}
          types={TYPES}
          onPatch={patch}
        />

        <Prioritization idea={idea} onPatch={patch} />

        <TagsSection idea={idea} onPatch={patch} />

        <NarrativeSections idea={idea} onPatch={patch} />

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Technical requirements</h3>
          <RequirementsEditor
            items={idea.technicalRequirements}
            onChange={(next) => patch("technicalRequirements", next as any)}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Budget breakdown</h3>
          <BudgetEditor
            value={idea.budget}
            onChange={(next) => patch("budget", next as any)}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Solo developer feasibility</h3>
          <FeasibilityEditor
            value={idea.solo}
            onChange={(next) => patch("solo", next as any)}
          />
        </div>

        {/* Recommendation + Revenue side-by-side */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Recommendation idea={idea} onPatch={patch} />
          <RevenueSection idea={idea} onPatch={patch} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Step-by-step approach</h3>
          <StepsEditor
            items={idea.steps}
            onChange={(next) => patch("steps", next as any)}
          />
        </div>

        {/* Target audience */}
        <TagsSection idea={idea} onPatch={patch} />

        {/* Business model */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
          <h3 className="mb-2 font-semibold">Business model</h3>
          <textarea
            rows={6}
            value={idea.businessModel ?? ""}
            onChange={(e) => patch("businessModel", e.target.value as any)}
            placeholder="Describe value proposition, pricing, channels, costs, and how this becomes a business."
            className="w-full rounded-md border px-3 py-2"
          />
        </section>

        {/* SWOT is usually in its own section in your folder; if you already split it, keep that import instead */}
        {/* Links are inside TitleMeta or a separate section depending on your implementation */}

        <p className="text-center text-xs text-gray-400">
          Changes update the draft locally; click <b>Save</b> to persist.
        </p>
      </div>
    </div>
  );
};

export default DetailView;
