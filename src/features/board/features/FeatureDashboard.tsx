import React, { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  featureSummaries,
  newFeatureSeed,
  upsertFeature,
  deleteFeature,
  newStorySeed,
  upsertStory,
  newBugSeed,
  upsertBug,
} from "./storage";
import type { Feature } from "types/boardFeatures";
import { storage, BOARD_NS } from "packages/storage";
import { EmptyState } from "packages/ui";

/** ───────────────────────────────────────────────────────────
 * Row (accordion) for a single Feature
 * - rename/delete
 * - nested stories + bugs
 * - “Open board” keeps ?project= in the URL
 * ─────────────────────────────────────────────────────────── */
const FeatureRow: React.FC<{
  feature: Feature;
  storyCount: number;
  projectId: string;
  onOpen: () => void;
  onChanged: () => void;
}> = ({ feature, storyCount, onOpen, onChanged }) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(feature.name);

  const saveName = () => {
    const n = name.trim();
    if (!n || n === feature.name) {
      setEditing(false);
      setName(feature.name);
      return;
    }
    const next: Feature = {
      ...feature,
      name: n,
      updatedAt: new Date().toISOString(),
    };
    upsertFeature(next);
    setEditing(false);
    onChanged();
  };

  const remove = () => {
    if (!window.confirm(`Delete feature “${feature.name}”?`)) return;
    deleteFeature(feature.id);
    onChanged();
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3">
          <button
            className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
            onClick={() => setOpen(!open)}
            aria-label="Toggle"
            title={open ? "Collapse" : "Expand"}
          >
            {open ? "▾" : "▸"}
          </button>

          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              className="rounded-md border px-2 py-1"
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-medium">{feature.name}</span>
              <span className="text-xs text-gray-500">
                ({storyCount} stories)
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(true)}
            className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          >
            Rename
          </button>
          <button
            onClick={remove}
            className="rounded-md border px-2 py-1 text-sm text-rose-700 hover:bg-rose-50"
          >
            Delete
          </button>
          <button
            onClick={onOpen}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            title="Open feature board"
          >
            Open board
          </button>
        </div>
      </div>

      {open && <FeatureBody featureId={feature.id} onChanged={onChanged} />}
    </div>
  );
};

/** Stories + Bugs inside a feature row */
const FeatureBody: React.FC<{
  featureId: string;
  onChanged: () => void;
}> = ({ featureId, onChanged }) => {
  // Recompute from storage when parent bumps refreshKey
  const summaries = useMemo(() => featureSummaries(), []);
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
    <div className="border-t p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">User stories</h4>
        <button
          onClick={addStory}
          className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
        >
          + Add Story
        </button>
      </div>

      {current.stories.length === 0 ? (
        <p className="text-sm text-gray-600">No stories yet.</p>
      ) : (
        <ul className="space-y-2">
          {current.stories.map((s) => (
            <li key={s.id} className="rounded-md border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to={`/board/story/${s.id}`}
                    className="font-medium hover:underline"
                    title="Open Story detail"
                  >
                    {s.title}
                  </Link>
                  <div className="text-xs text-gray-500">
                    {s.status} {s.points ? `• ${s.points} pts` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/board/story/${s.id}`}
                    className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
                  >
                    View
                  </Link>
                  <AddBugButton storyId={s.id} onChanged={onChanged} />
                </div>
              </div>

              <BugsList
                storyId={s.id}
                count={current.bugCountsByStory[s.id] ?? 0}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AddBugButton: React.FC<{ storyId: string; onChanged: () => void }> = ({
  storyId,
  onChanged,
}) => {
  const addBug = () => {
    const title = prompt("Bug title")?.trim();
    if (!title) return;
    const b = newBugSeed(storyId, title);
    upsertBug(b);
    onChanged();
  };
  return (
    <button
      onClick={addBug}
      className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
      title="File a bug for this story"
    >
      + Add Bug
    </button>
  );
};

const BugsList: React.FC<{ storyId: string; count: number }> = ({ count }) => {
  if (count === 0)
    return <div className="mt-2 text-xs text-gray-500">No bugs.</div>;
  return (
    <div className="mt-2 text-xs text-gray-600">
      {count} bug{count > 1 ? "s" : ""} filed.
    </div>
  );
};

const EmptyStates: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <div className="rounded-xl border-2 border-dashed p-10 text-center text-gray-600">
    <p>No features yet for this project.</p>
    <button
      onClick={onCreate}
      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
    >
      + Create first Feature
    </button>
  </div>
);

/** ───────────────────────────────────────────────────────────
 * Dashboard: filtered to the selected project
 * - reads ?project= or storage.selectedProjectId
 * - creates features with projectId
 * - links preserve ?project=
 * ─────────────────────────────────────────────────────────── */
const FeatureDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  const projectId =
    search.get("project") ||
    storage.get<string>(BOARD_NS, "selectedProjectId", "") ||
    "";

  // all summaries -> filter by project
  const all = useMemo(() => featureSummaries(), [refreshKey]);
  const summaries = useMemo(
    () => all.filter((s) => s.feature.projectId === projectId),
    [all, projectId]
  );

  const addFeature = () => {
    if (!projectId) {
      alert("Pick a project in the left sidebar first.");
      return;
    }
    const name = prompt("Feature name")?.trim();
    if (!name) return;
    const f = newFeatureSeed(projectId, name);
    upsertFeature(f);
    refresh();
  };

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 space-y-4">
      {!projectId ? (
        <EmptyState
          title="Create your first project"
          description={
            <>
              Create a project in the left sidebar, then you can add Features.
            </>
          }
          bullets={[
            "Projects live in the left panel.",
            "Click a project to open its board.",
            "Use “Add Feature” to customize the workflow.",
          ]}
        />
      ) : (
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Features</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={addFeature}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              + New Feature
            </button>
            <Link
              to={`/board${projectId ? `?project=${projectId}` : ""}`}
              className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
              title="Go to main board"
            >
              Board
            </Link>
          </div>
        </div>
      )}

      {summaries.length === 0 && projectId ? (
        <EmptyStates onCreate={addFeature} />
      ) : (
        <div className="space-y-3">
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
