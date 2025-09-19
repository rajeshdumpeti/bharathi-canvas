// types/ideas.ts
// Keep the types exactly as you standardized earlier.
export type IdeaType = "Product" | "Feature" | "Tooling" | "Research" | "Infra";
export type IdeaStatus =
  | "Draft"
  | "Exploring"
  | "Planned"
  | "Building"
  | "Shipped"
  | "Archived";

export type IdeaMilestone = {
  id: string;
  name: string;
  goal: string;
  eta?: string;
};

export type AcceptanceItem = {
  id: string;
  text: string;
  milestoneId?: string; // optional link to a milestone
};

export type IdeaSwot = {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
};

export type Idea = {
  id: string;
  title: string;
  tags: string[];
  ideaType: IdeaType;
  oneLiner?: string;

  status: IdeaStatus;
  impact?: number; // 1-5
  effort?: number; // 1-5
  confidence?: number; // 1-5

  // sections (you’ll fill these in detail screen later)
  problem?: string;
  outcomes?: string[];
  nonGoals?: string[];

  /** NEW: structured SWOT analysis */
  swot?: IdeaSwot;

  /** NEW: business model notes (free text / Markdown) */
  businessModel?: string;

  /** NEW: target audience/persona chips */
  targetAudience?: string[];

  valueNotes?: string;
  risks?: string[];

  coreApproach?: string;
  requiredCaps?: string[]; // purely text chips (no AI logic now)
  dataNeeds?: string;
  apis?: { name: string; purpose?: string; owner?: string }[];
  archSketchUrl?: string;
  dependencies?: string[];
  openQuestions?: string[];

  milestones?: IdeaMilestone[];
  acceptance?: string[];

  links?: { label?: string; url: string }[];
  notes?: string;

  owner?: string;
  starred?: boolean;
  visibility?: "Private" | "Shared";

  createdAt: string; // ISO
  updatedAt: string; // ISO
};
