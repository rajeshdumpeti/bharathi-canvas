import React, { useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  getFeatureById,
  storiesByFeature,
  newStorySeed,
  upsertStory,
  moveStory,
  bugsByStory,
} from "./storage";
import { storage, BOARD_NS } from "packages/storage";

type BoardStatus = "To Do" | "In Progress" | "Validation" | "Done";

const COLUMNS: { id: BoardStatus; hint: string }[] = [
  { id: "To Do", hint: "Not started yet" },
  { id: "In Progress", hint: "Being worked on" },
  { id: "Validation", hint: "QA / Review" },
  { id: "Done", hint: "Complete" },
];

const badge = (s: BoardStatus) =>
  ({
    "To Do": "bg-gray-100 text-gray-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Validation: "bg-amber-100 text-amber-700",
    Done: "bg-emerald-100 text-emerald-700",
  })[s];

const FeatureBoard: React.FC = () => {
  const { featureId } = useParams<{ featureId: string }>();
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const projectId =
    search.get("project") ||
    storage.get<string>(BOARD_NS, "selectedProjectId", "") ||
    "";

  const feature = featureId ? getFeatureById(featureId) : null;
  const stories = useMemo(
    () => (featureId ? storiesByFeature(featureId) : []),
    [featureId]
  );

  if (!feature) return <div className="p-6">Feature not found.</div>;

  const onAddStory = () => {
    if (!featureId) return;
    const story = newStorySeed(featureId, "New Story");
    upsertStory(story);
    // remain on the board; user can click through to edit later
  };

  const onChangeStatus = (storyId: string, next: BoardStatus) => {
    moveStory(storyId, next);
  };

  return (
    <div className="mx-auto max-w-[1200px] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{feature.name}</h1>
          {feature.tags?.length ? (
            <div className="mt-1 flex flex-wrap gap-1">
              {feature.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddStory}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            + Add Story
          </button>
          <button
            onClick={() =>
              navigate(
                `/board/features${projectId ? `?project=${projectId}` : ""}`
              )
            }
            className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
            title="Back to Features"
          >
            Back to features
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => {
          const items = stories.filter(
            (s) => (s.status as BoardStatus) === col.id
          );
          return (
            <section key={col.id} className="rounded-xl border bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">{col.id}</h2>
                <span className="text-xs text-gray-500">{items.length}</span>
              </div>
              <p className="mb-3 text-xs text-gray-400">{col.hint}</p>

              {items.length === 0 ? (
                <div className="rounded-md border border-dashed p-3 text-center text-sm text-gray-500">
                  No stories here — add one.
                </div>
              ) : (
                <ul className="space-y-2">
                  {items.map((s) => {
                    const bugs = bugsByStory(s.id);
                    return (
                      <li
                        key={s.id}
                        className="rounded-lg border p-3 hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-medium text-gray-900">
                              {s.title}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {s.points != null ? `${s.points} pts · ` : ""}
                              <span
                                className={`inline-flex rounded px-1 ${badge(s.status as BoardStatus)}`}
                              >
                                {s.status}
                              </span>
                              {bugs.length ? (
                                <span className="ml-2 inline-flex items-center rounded bg-rose-100 px-1.5 py-0.5 text-xs text-rose-700">
                                  {bugs.length} bug{bugs.length > 1 ? "s" : ""}
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <select
                            className="rounded-md border px-2 py-1 text-xs"
                            value={s.status as BoardStatus}
                            onChange={(e) =>
                              onChangeStatus(
                                s.id,
                                e.target.value as BoardStatus
                              )
                            }
                            title="Change status"
                          >
                            {COLUMNS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.id}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                            onClick={() => navigate(`/board/story/${s.id}`)}
                          >
                            Open story
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureBoard;
