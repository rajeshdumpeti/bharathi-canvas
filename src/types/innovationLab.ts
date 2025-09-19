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

export type Idea = {
  id: string;
  title: string;
  tags: string[];
  ideaType: IdeaType;
  oneLiner?: string;

  status: IdeaStatus;
  impact?: number; // 1–5
  effort?: number; // 1–5
  confidence?: number; // 1–5

  problem?: string;
  audience?: string[];
  outcomes?: string[];
  nonGoals?: string[];

  valueNotes?: string;
  risks?: string[];

  coreApproach?: string;
  requiredCaps?: string[];
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

  createdAt: string;
  updatedAt: string;
};
