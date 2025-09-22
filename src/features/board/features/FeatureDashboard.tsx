import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  featureSummaries,
  newFeatureSeed,
  upsertFeature,
  deleteFeature,
  newStorySeed,
  upsertStory,
} from "./storage";
import type { Feature } from "types/boardFeatures";
import { storage, BOARD_NS } from "packages/storage";
import { EmptyState } from "packages/ui";
import {
  FiPlus,
  FiChevronRight,
  FiChevronDown,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiBookOpen,
} from "react-icons/fi";

/* ------------------------------
   Description UI helpers
------------------------------ */
function useClamp(text: string, clampAt = 220) {
  const needsClamp = text.length > clampAt;
  const [expanded, setExpanded] = useState(false);
  const display = needsClamp && !expanded ? text.slice(0, clampAt) + "…" : text;
  return { display, expanded, setExpanded, needsClamp };
}

/* ───────────────────────────────────────────────────────────
 * Row (accordion) for a single Feature
 *  - rename / delete
 *  - polished Description UI (view + edit)
 *  - nested stories + bugs
 *  - “Open board” keeps ?project= in the URL
 * ─────────────────────────────────────────────────────────── */
const FeatureRow: React.FC<{
  feature: Feature;
  storyCount: number;
  projectId: string;
  onOpen: () => void;
  onChanged: () => void;
}> = ({ feature, storyCount, projectId, onOpen, onChanged }) => {
  const [open, setOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(feature.name);

  // description is optional; stored via upsertFeature with a safe cast
  const initialDesc = ((feature as any)?.description as string) || "";
  const [desc, setDesc] = useState(initialDesc);
  const [editingDesc, setEditingDesc] = useState(false);
  // ...existing imports

  const saveName = () => {
    const n = name.trim();
    if (!n || n === feature.name) {
      setEditingName(false);
      setName(feature.name);
      return;
    }
    const next: Feature & any = {
      ...feature,
      name: n,
      updatedAt: new Date().toISOString(),
    };
    upsertFeature(next);
    setEditingName(false);
    onChanged();
  };

  const saveDesc = () => {
    const next: Feature & any = {
      ...feature,
      description: desc.trim(),
      updatedAt: new Date().toISOString(),
    };
    upsertFeature(next);
    setEditingDesc(false);
    onChanged();
  };

  const remove = () => {
    if (!window.confirm(`Delete feature “${feature.name}”?`)) return;
    deleteFeature(feature.id);
    onChanged();
  };

  const countChip = (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
      {storyCount} stor{storyCount === 1 ? "y" : "ies"}
    </span>
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      {/* Row header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4">
        <div className="flex items-start sm:items-center gap-3">
          <button
            className="rounded-md border bg-white px-2 py-1 text-sm hover:bg-gray-50"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle"
            title={open ? "Collapse" : "Expand"}
          >
            {open ? <FiChevronDown /> : <FiChevronRight />}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {!editingName ? (
              <>
                <span className="truncate font-semibold text-gray-900">
                  {feature.name}
                </span>
                {countChip}
              </>
            ) : (
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                className="w-[min(28rem,80vw)] rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!editingName && (
            <button
              onClick={() => setEditingName(true)}
              className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
            >
              <FiEdit2 className="h-4 w-4" /> Rename
            </button>
          )}
          <button
            onClick={remove}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-rose-700 hover:bg-rose-50"
          >
            <FiTrash2 className="h-4 w-4" /> Delete
          </button>
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            title="Open board"
          >
            <FiExternalLink className="h-4 w-4" />
            Open board
          </button>
        </div>
      </div>

      {/* Body (collapsible) */}
      {open && !editingName && (
        <div className="px-3 pb-4 sm:px-4">
          {/* Description panel */}
          <DescriptionSection
            initialDesc={initialDesc}
            desc={desc}
            setDesc={setDesc}
            editingDesc={editingDesc}
            setEditingDesc={setEditingDesc}
            onSave={saveDesc}
          />

          {/* Stories / Bugs */}
          <FeatureBody featureId={feature.id} onChanged={onChanged} />
        </div>
      )}
    </div>
  );
};

/* ------------------------------
   Description Section (polished)
------------------------------ */
const DescriptionSection: React.FC<{
  initialDesc: string;
  desc: string;
  setDesc: (v: string) => void;
  editingDesc: boolean;
  setEditingDesc: (v: boolean) => void;
  onSave: () => void;
}> = ({ initialDesc, desc, setDesc, editingDesc, setEditingDesc, onSave }) => {
  const { display, expanded, setExpanded, needsClamp } = useClamp(
    initialDesc,
    280
  );

  return (
    <div className="mb-4 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-medium text-indigo-900">
          <FiBookOpen className="text-indigo-500" />
          Description
        </span>
        {!editingDesc && (
          <button
            onClick={() => setEditingDesc(true)}
            className="text-xs font-medium text-indigo-700 hover:text-indigo-800"
          >
            Edit
          </button>
        )}
      </div>

      {editingDesc ? (
        <>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe what this feature does, the goal, constraints, success metrics…"
            rows={4}
            className="w-full rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              onClick={onSave}
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditingDesc(false)}
              className="rounded-md border border-indigo-200 bg-white px-3 py-1.5 text-xs hover:bg-indigo-50"
            >
              Cancel
            </button>
          </div>
        </>
      ) : initialDesc ? (
        <>
          <p className="text-sm leading-6 text-indigo-900/90 whitespace-pre-wrap break-words">
            {display}
          </p>{" "}
          {needsClamp && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 text-xs font-medium text-indigo-700 hover:text-indigo-800"
            >
              Show {expanded ? "less" : "more"}
            </button>
          )}
        </>
      ) : (
        <button
          onClick={() => setEditingDesc(true)}
          className="text-xs font-medium text-indigo-700 hover:text-indigo-800"
        >
          + Add description
        </button>
      )}
    </div>
  );
};

/* ───────────────────────────────────────────────────────────
 * Stories + Bugs inside a feature row (same behavior)
 * ─────────────────────────────────────────────────────────── */
const FeatureBody: React.FC<{
  featureId: string;
  onChanged: () => void;
}> = ({ featureId, onChanged }) => {
  // Always read latest from storage so new stories show up immediately
  const summaries = featureSummaries();
  const current = summaries.find((s) => s.feature.id === featureId);

  const addStory = () => {
    const title = prompt("Story title")?.trim();
    if (!title) return;
    const s = newStorySeed(featureId, title);
    upsertStory(s);
    onChanged();
  };

  if (!current) return null;

  return (
    <div className="border-t p-3 sm:p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">User stories</h4>
        <button
          onClick={addStory}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
        >
          <FiPlus className="h-4 w-4" /> Add Story
        </button>
      </div>

      {current.stories.length === 0 ? (
        <p className="text-sm text-gray-600">No stories yet.</p>
      ) : (
        <ul className="grid gap-2 sm:gap-3 sm:grid-cols-2">
          {current.stories.map((s) => (
            <li key={s.id} className="rounded-lg border bg-white p-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <Link
                    to={`/board/story/${s.id}`}
                    className="text-md font-medium text-indigo-700 hover:text-indigo-800 hover:underline"
                    title="Open Story detail"
                  >
                    {s.title}
                  </Link>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {s.status} {s.points ? `• ${s.points} pts` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/board/story/${s.id}`}
                    className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                  >
                    View
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ───────────────────────────────────────────────────────────
 * Dashboard (project-scoped)
 * ─────────────────────────────────────────────────────────── */
const ProjectEmptyExplainer: React.FC = () => (
  <EmptyState
    title="Create your first project"
    description={
      <>Create a project in the left sidebar, then you can add Features.</>
    }
    bullets={[
      "Projects live in the left panel.",
      "Click a project to open its board.",
      "Use “Add Feature” to group related stories.",
    ]}
  />
);

const FeatureListEmpty: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <div className="rounded-xl border-2 border-dashed p-8 text-center text-gray-600">
    <p>No features yet for this project.</p>
    <button
      onClick={onCreate}
      className="mt-3 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
    >
      + Create first Feature
    </button>
  </div>
);

const FeatureDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  const projectId =
    search.get("project") ||
    storage.get<string>(BOARD_NS, "selectedProjectId", "") ||
    "";

  const all = useMemo(() => featureSummaries(), [refreshKey]);
  const summaries = useMemo(
    () => all.filter((s) => s.feature.projectId === projectId),
    [all, projectId]
  );
  // inside FeatureDashboard component:
  useEffect(() => {
    const bump = () => setRefreshKey((k) => k + 1);
    window.addEventListener("features:changed", bump);
    window.addEventListener("board:tasksUpdated", bump);
    return () => {
      window.removeEventListener("features:changed", bump);
      window.removeEventListener("board:tasksUpdated", bump);
    };
  }, []);

  const addFeature = () => {
    if (!projectId) {
      alert("Pick a project in the left sidebar first.");
      return;
    }
    const name = prompt("Feature name")?.trim();
    if (!name) return;
    const f = newFeatureSeed(projectId, name);
    (f as any).description = ""; // allow empty description by default
    upsertFeature(f);
    refresh();
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      {/* Sticky header */}

      {!projectId ? (
        <ProjectEmptyExplainer />
      ) : summaries.length === 0 ? (
        <FeatureListEmpty onCreate={addFeature} />
      ) : (
        <div className="grid gap-3 px-4">
          <div className="sticky top-0 z-10 -mx-4 sm:mx-0 bg-gray-50/80 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60 border-b">
            <div className="px-4 sm:px-0 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold">Features</h1>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={addFeature}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <FiPlus className="h-4 w-4" />
                  New Feature
                </button>
                <Link
                  to={`/board${projectId ? `?project=${projectId}` : ""}`}
                  className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                  title="Go to main board"
                >
                  Board
                </Link>
              </div>
            </div>
          </div>
          {summaries.map(({ feature, stories }) => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              storyCount={stories.length}
              projectId={projectId}
              onOpen={() => navigate(`/board?project=${feature.projectId}`)}
              onChanged={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeatureDashboard;
