// src/types/innovationLab.ts

export type IdeaType = "Product" | "Feature" | "Tooling" | "Research" | "Infra";
export type IdeaStatus =
  | "Draft"
  | "Exploring"
  | "Planned"
  | "Building"
  | "Shipped"
  | "Archived";

/** Simple section types */
export type SWOT = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
};

export type IdeaMilestone = {
  id: string;
  name: string;
  goal: string;
  eta?: string; // ISO
};

export type IdeaLink = { label?: string; url: string };

/** NEW: Technical requirements */
export type TechReqCategory =
  | "Frontend"
  | "Backend"
  | "ML"
  | "Infra"
  | "Data"
  | "Integration"
  | "Compliance"
  | "Other";

export type TechnicalRequirement = {
  name: string; // e.g., "Postgres", "WebSockets"
  detail?: string; // extra notes
  category?: TechReqCategory;
  required?: boolean; // default true
};

/** NEW: Budget breakdown */
export type BudgetBreakdown = {
  currency?: string; // e.g., "₹", "USD"
  freeOptions?: string[]; // libraries/services you can use for free
  oneTimeCosts?: string[]; // e.g., hardware/installation items
  monthlyCosts?: string[]; // recurring spend items
  oneTimeTotal?: number; // optional quick math
  monthlyTotal?: number; // optional quick math
  notes?: string; // anything else
};

/** NEW: Solo developer feasibility block */
export type SoloFeasibility = {
  difficulty?: number; // 0–5 (harder = higher)
  feasibility?: number; // 0–5 (more feasible = higher)
  timelineWeeks?: number; // rough solo timeline
  pros?: string[]; // what's easy/positive
  challenges?: string[]; // risks/unknowns
};

/** NEW: Step-by-step approach (simple checklist) */
export type StepItem = {
  id: string;
  text: string;
  done?: boolean;
};

/** Primary Idea record */
export type Idea = {
  id: string;
  title: string;
  tags: string[];
  ideaType: IdeaType;
  oneLiner?: string;

  status: IdeaStatus;
  impact?: number; // 0–5
  effort?: number; // 0–5 (lower is better)
  confidence?: number; // 0–5

  // Core narrative
  problem?: string;
  coreApproach?: string;
  valueNotes?: string;
  risks?: string[];

  // NEW sections
  technicalRequirements?: TechnicalRequirement[];
  budget?: BudgetBreakdown;
  solo?: SoloFeasibility;
  recommendation?: string; // free-form verdict / next step
  revenuePotential?: number; // 0–5
  steps?: StepItem[];
  revenueNotes?: string;
  revenueSignals?: string[];

  // Existing business-facing parts
  businessModel?: string;
  targetAudience?: string[];
  swot?: SWOT;

  // Optional extras you already use in places
  outcomes?: string[];
  nonGoals?: string[];
  requiredCaps?: string[];
  dataNeeds?: string;
  apis?: { name: string; purpose?: string; owner?: string }[];
  archSketchUrl?: string;
  dependencies?: string[];
  openQuestions?: string[];
  milestones?: IdeaMilestone[];
  acceptance?: string[];
  links?: IdeaLink[];
  notes?: string;

  owner?: string;
  starred?: boolean;
  visibility?: "Private" | "Shared";

  createdAt: string; // ISO
  updatedAt: string; // ISO
};
