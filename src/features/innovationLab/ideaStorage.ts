// src/features/innovationLab/ideaStorage.ts
import { storage, IDEAS_NS } from "packages/storage";
import type { Idea } from "types/innovationLab";

const KEY = "items";

export function loadIdeas(): Idea[] {
  return storage.get<Idea[]>(IDEAS_NS, KEY, []);
}
export function saveIdeas(list: Idea[]) {
  storage.set(IDEAS_NS, KEY, list);
}
export function getIdeaById(id: string): Idea | null {
  return loadIdeas().find((i) => i.id === id) ?? null;
}
export function upsertIdea(idea: Idea): Idea[] {
  const list = loadIdeas();
  const ix = list.findIndex((i) => i.id === idea.id);
  const next =
    ix >= 0
      ? [...list.slice(0, ix), idea, ...list.slice(ix + 1)]
      : [idea, ...list];
  saveIdeas(next);
  return next;
}
export function deleteIdea(id: string) {
  saveIdeas(loadIdeas().filter((i) => i.id !== id));
}

/** Factory: new idea with sane defaults for all new sections */
export function newIdeaSeed(): Idea {
  const now = new Date().toISOString();
  return {
    id: `idea_${Date.now()}`,
    title: "",
    tags: [],
    ideaType: "Feature",
    status: "Draft",
    oneLiner: "",
    impact: 0,
    effort: 0,
    confidence: 0,

    // NEW sections
    technicalRequirements: [],
    budget: {
      currency: "₹",
      freeOptions: [],
      oneTimeCosts: [],
      monthlyCosts: [],
      oneTimeTotal: 0,
      monthlyTotal: 0,
      notes: "",
    },
    solo: {
      difficulty: 0,
      feasibility: 0,
      timelineWeeks: 0,
      pros: [],
      challenges: [],
    },
    recommendation: "",
    revenuePotential: 0,
    steps: [],
    revenueNotes: "",
    revenueSignals: [],

    // existing narrative
    problem: "",
    coreApproach: "",
    valueNotes: "",
    risks: [],

    // business-facing
    businessModel: "",
    targetAudience: [],
    swot: {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    },

    createdAt: now,
    updatedAt: now,
  };
}

/** Lightweight Markdown exporter covering all sections we have now */
export function ideaToMarkdown(i: Idea): string {
  const ice = (i.impact ?? 0) + (i.confidence ?? 0) - (i.effort ?? 0);

  const sw = i.swot ?? {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };

  const techBlock =
    (i.technicalRequirements?.length ?? 0) > 0
      ? [
          "## Technical requirements",
          "",
          ...(i.technicalRequirements || []).map((r) => {
            const cat = r.category ? ` _(${r.category})_` : "";
            const req = r.required === false ? " (optional)" : "";
            const detail = r.detail ? ` — ${r.detail}` : "";
            return `- ${r.name}${cat}${req}${detail}`;
          }),
          "",
        ].join("\n")
      : "";

  const budget = i.budget ?? {};
  const budgetBlock =
    (budget.freeOptions?.length ||
      budget.oneTimeCosts?.length ||
      budget.monthlyCosts?.length ||
      budget.notes) &&
    [
      "## Budget breakdown",
      "",
      budget.freeOptions?.length
        ? `**Free options**\n${budget.freeOptions.map((x) => `- ${x}`).join("\n")}\n`
        : "",
      budget.oneTimeCosts?.length
        ? `**One-time costs**${budget.oneTimeTotal ? ` (≈ ${budget.currency ?? ""}${budget.oneTimeTotal})` : ""}\n${budget.oneTimeCosts
            .map((x) => `- ${x}`)
            .join("\n")}\n`
        : "",
      budget.monthlyCosts?.length
        ? `**Monthly costs**${budget.monthlyTotal ? ` (≈ ${budget.currency ?? ""}${budget.monthlyTotal}/mo)` : ""}\n${budget.monthlyCosts
            .map((x) => `- ${x}`)
            .join("\n")}\n`
        : "",
      budget.notes ? `${budget.notes}\n` : "",
      "",
    ]
      .filter(Boolean)
      .join("");

  const solo = i.solo ?? {};
  const soloBlock =
    solo.difficulty ||
    solo.feasibility ||
    solo.timelineWeeks ||
    (solo.pros?.length ?? 0) ||
    (solo.challenges?.length ?? 0)
      ? [
          "## Solo developer feasibility",
          "",
          `- Difficulty: ${solo.difficulty ?? 0}/5`,
          `- Feasibility: ${solo.feasibility ?? 0}/5`,
          `- Timeline: ~${solo.timelineWeeks ?? 0} weeks`,
          solo.pros?.length
            ? `\n**Pros**\n${solo.pros.map((p) => `- ${p}`).join("\n")}\n`
            : "",
          solo.challenges?.length
            ? `**Challenges**\n${solo.challenges.map((c) => `- ${c}`).join("\n")}\n`
            : "",
          "",
        ].join("\n")
      : "";

  const recommendationBlock = i.recommendation
    ? `## Recommendation\n${i.recommendation}\n`
    : "";

  const revenueBlock =
    typeof i.revenuePotential === "number" ||
    (i.revenueSignals?.length ?? 0) > 0 ||
    (i.revenueNotes?.trim()?.length ?? 0) > 0
      ? [
          "## Revenue potential",
          "",
          typeof i.revenuePotential === "number"
            ? `**Score:** ${i.revenuePotential}/5\n`
            : "",
          (i.revenueSignals?.length ?? 0) > 0
            ? `**Signals**\n${i.revenueSignals!.map((s) => `- ${s}`).join("\n")}\n`
            : "",
          i.revenueNotes ? `${i.revenueNotes}\n` : "",
          "",
        ].join("\n")
      : "";

  const stepsBlock =
    (i.steps?.length ?? 0) > 0
      ? [
          "## Step-by-step approach",
          "",
          ...(i.steps || []).map(
            (s, idx) => `- [${s.done ? "x" : " "}] ${idx + 1}. ${s.text}`
          ),
          "",
        ].join("\n")
      : "";

  const swotBlock =
    sw.strengths.length ||
    sw.weaknesses.length ||
    sw.opportunities.length ||
    sw.threats.length
      ? [
          "## SWOT",
          "",
          "### Strengths",
          sw.strengths.length
            ? sw.strengths.map((s) => `- ${s}`).join("\n")
            : "- —",
          "",
          "### Weaknesses",
          sw.weaknesses.length
            ? sw.weaknesses.map((s) => `- ${s}`).join("\n")
            : "- —",
          "",
          "### Opportunities",
          sw.opportunities.length
            ? sw.opportunities.map((s) => `- ${s}`).join("\n")
            : "- —",
          "",
          "### Threats",
          sw.threats.length
            ? sw.threats.map((s) => `- ${s}`).join("\n")
            : "- —",
          "",
        ].join("\n")
      : "";

  const businessModelBlock = i.businessModel
    ? `## Business model\n${i.businessModel}\n`
    : "";

  const audienceBlock =
    (i.targetAudience?.length ?? 0) > 0
      ? `## Target audience\n${i.targetAudience!.map((a) => `- ${a}`).join("\n")}\n`
      : "";

  return [
    `# ${i.title || "Untitled idea"}`,
    "",
    `**Type:** ${i.ideaType}   **Status:** ${i.status}   **ICE:** ${ice}`,
    i.oneLiner ? `\n> ${i.oneLiner}\n` : "",
    i.problem ? `\n## Problem\n${i.problem}\n` : "",
    i.coreApproach ? `\n## Core approach\n${i.coreApproach}\n` : "",
    techBlock,
    budgetBlock,
    soloBlock,
    recommendationBlock,
    revenueBlock,
    stepsBlock,
    businessModelBlock,
    audienceBlock,
    swotBlock,
    i.valueNotes ? `\n## Value / Why now\n${i.valueNotes}\n` : "",
    i.risks?.length ? `\n## Risks\n- ${i.risks.join("\n- ")}\n` : "",
    i.links?.length
      ? `\n## Links\n${i.links.map((l) => `- [${l.label || l.url}](${l.url})`).join("\n")}\n`
      : "",
  ]
    .filter(Boolean)
    .join("\n");
}
