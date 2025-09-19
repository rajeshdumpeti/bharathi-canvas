import { storage, IDEAS_NS } from "packages/storage";
import type { Idea } from "types/ideas";

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
    createdAt: now,
    updatedAt: now,
  };
}

/** Very lightweight MD exporter (expand later as you add fields) */
export function ideaToMarkdown(i: Idea): string {
  const ice = (i.impact ?? 0) + (i.confidence ?? 0) - (i.effort ?? 0);
  return [
    `# ${i.title || "Untitled idea"}`,
    "",
    `**Type:** ${i.ideaType}   **Status:** ${i.status}   **ICE:** ${ice}`,
    i.oneLiner ? `\n> ${i.oneLiner}\n` : "",
    i.problem ? `\n## Problem\n${i.problem}\n` : "",
    i.coreApproach ? `\n## Core approach\n${i.coreApproach}\n` : "",
    i.valueNotes ? `\n## Value / Why now\n${i.valueNotes}\n` : "",
    i.risks?.length ? `\n## Risks\n- ${i.risks.join("\n- ")}\n` : "",
    i.links?.length
      ? `\n## Links\n${i.links.map((l) => `- [${l.label || l.url}](${l.url})`).join("\n")}\n`
      : "",
  ].join("\n");
}
