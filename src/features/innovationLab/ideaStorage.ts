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
export function newIdeaSeed(): Idea {
  const now = new Date().toISOString();
  return {
    id: `idea_${Date.now()}`,
    title: "",
    tags: [],
    ideaType: "Feature",
    status: "Draft",
    impact: 0,
    effort: 0,
    confidence: 0,
    swot: {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    },
    businessModel: "",
    targetAudience: [],
    createdAt: now,
    updatedAt: now,
  };
}
/** Very lightweight MD exporter (expand later as you add fields) */
export function ideaToMarkdown(i: Idea): string {
  const ice = (i.impact ?? 0) + (i.confidence ?? 0) - (i.effort ?? 0);
  const sw = i.swot ?? {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };

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
    ? `## Business Model\n${i.businessModel}\n`
    : "";

  const audienceBlock =
    (i.targetAudience?.length ?? 0) > 0
      ? `## Target Audience\n${i.targetAudience!.map((a) => `- ${a}`).join("\n")}\n`
      : "";

  return [
    `# ${i.title || "Untitled idea"}`,
    "",
    `**Type:** ${i.ideaType}   **Status:** ${i.status}   **ICE:** ${ice}`,
    i.oneLiner ? `\n> ${i.oneLiner}\n` : "",
    i.problem ? `\n## Problem\n${i.problem}\n` : "",
    i.coreApproach ? `\n## Core approach\n${i.coreApproach}\n` : "",
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
