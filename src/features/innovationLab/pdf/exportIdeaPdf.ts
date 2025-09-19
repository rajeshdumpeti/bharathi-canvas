// src/features/innovationLab/pdf/exportIdeaPdf.ts
import { jsPDF } from "jspdf";
import type { Idea } from "types/innovationLab";

/** Simple PDF exporter for an Idea. No external plugins required. */
export function exportIdeaAsPdf(idea: Idea) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;

  let y = margin;

  const addBreakIfNeeded = (delta: number) => {
    if (y + delta > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const heading = (text: string, size = 16) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    addBreakIfNeeded(size + 8);
    doc.text(text, margin, y);
    y += size + 6;
  };

  const subheading = (text: string, size = 12) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    addBreakIfNeeded(size + 6);
    doc.text(text, margin, y);
    y += size + 4;
  };

  const paragraph = (text: string, size = 11, leading = 16) => {
    if (!text?.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, contentW);
    lines.forEach((line) => {
      addBreakIfNeeded(leading);
      doc.text(line, margin, y);
      y += leading;
    });
    y += 2;
  };

  const bulletList = (items: string[], size = 11, leading = 16) => {
    if (!items?.length) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    items.forEach((raw) => {
      const line = `• ${raw}`;
      const wrapped = doc.splitTextToSize(line, contentW);
      wrapped.forEach((l, i) => {
        addBreakIfNeeded(leading);
        doc.text(l, margin, y);
        y += leading;
      });
    });
    y += 2;
  };

  // --- Title
  heading(idea.title || "Untitled idea", 20);

  // Meta
  const ice = (idea.impact ?? 0) + (idea.confidence ?? 0) - (idea.effort ?? 0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const meta = `Type: ${idea.ideaType}   •   Status: ${idea.status}   •   ICE: ${ice}`;
  doc.text(meta, margin, y);
  y += 18;

  // One-liner
  if (idea.oneLiner) {
    subheading("One-liner");
    paragraph(idea.oneLiner);
  }

  // Problem / Approach / Value
  if (idea.problem) {
    subheading("Problem");
    paragraph(idea.problem);
  }
  if (idea.coreApproach) {
    subheading("Core approach");
    paragraph(idea.coreApproach);
  }
  if (idea.valueNotes) {
    subheading("Value / Why now");
    paragraph(idea.valueNotes);
  }

  // Prioritization
  subheading("Prioritization");
  paragraph(
    `Impact: ${idea.impact ?? 0}/5   •   Confidence: ${idea.confidence ?? 0}/5   •   Effort: ${idea.effort ?? 0}/5`
  );

  // Revenue
  if (
    typeof idea.revenuePotential === "number" ||
    (idea.revenueSignals?.length ?? 0) > 0 ||
    (idea.revenueNotes?.trim()?.length ?? 0) > 0
  ) {
    subheading("Revenue potential");
    if (typeof idea.revenuePotential === "number") {
      paragraph(`Score: ${idea.revenuePotential}/5`);
    }
    if (idea.revenueSignals?.length) {
      paragraph("Signals:");
      bulletList(idea.revenueSignals);
    }
    paragraph(idea.revenueNotes ?? "");
  }

  // Target audience
  if (idea.targetAudience?.length) {
    subheading("Target audience");
    bulletList(idea.targetAudience);
  }

  // SWOT
  const sw = idea.swot ?? {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  };
  if (
    sw.strengths.length ||
    sw.weaknesses.length ||
    sw.opportunities.length ||
    sw.threats.length
  ) {
    subheading("SWOT");
    if (sw.strengths.length) {
      paragraph("Strengths:");
      bulletList(sw.strengths);
    }
    if (sw.weaknesses.length) {
      paragraph("Weaknesses:");
      bulletList(sw.weaknesses);
    }
    if (sw.opportunities.length) {
      paragraph("Opportunities:");
      bulletList(sw.opportunities);
    }
    if (sw.threats.length) {
      paragraph("Threats:");
      bulletList(sw.threats);
    }
  }

  // Risks
  if (idea.risks?.length) {
    subheading("Risks");
    bulletList(idea.risks);
  }

  // Links
  if (idea.links?.length) {
    subheading("Links");
    bulletList(idea.links.map((l) => `${l.label || l.url} — ${l.url}`));
  }

  // Footer
  y = pageH - margin + 18;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.text(
    `Exported ${new Date().toLocaleString()}`,
    margin,
    pageH - margin / 2
  );

  // Save
  const safe = (idea.title || "idea").replace(/[^\w.-]+/g, "_");
  doc.save(`${safe}.pdf`);
}
