import React, { useMemo, useState } from "react";
import { FiPlus, FiTrash2, FiCalendar } from "react-icons/fi";
import type { IdeaMilestone } from "types/ideas";

type Props = {
  value: IdeaMilestone[] | undefined;
  onChange: (next: IdeaMilestone[]) => void;
};

function uid() {
  return `ms_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;
}

const Milestones: React.FC<Props> = ({ value = [], onChange }) => {
  const [draftName, setDraftName] = useState("");
  const [draftGoal, setDraftGoal] = useState("");
  const [draftEta, setDraftEta] = useState("");

  const sorted = useMemo(
    () =>
      value.slice().sort((a, b) => {
        const da = a.eta ? new Date(a.eta).getTime() : Number.POSITIVE_INFINITY;
        const db = b.eta ? new Date(b.eta).getTime() : Number.POSITIVE_INFINITY;
        return da - db;
      }),
    [value]
  );

  const add = () => {
    const name = draftName.trim();
    if (!name) return;
    const next: IdeaMilestone = {
      id: uid(),
      name,
      goal: draftGoal.trim(),
      eta: draftEta || undefined,
    };
    onChange([next, ...value]);
    setDraftName("");
    setDraftGoal("");
    setDraftEta("");
  };

  const patch = (id: string, patch: Partial<IdeaMilestone>) => {
    onChange(value.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const remove = (id: string) => onChange(value.filter((m) => m.id !== id));

  return (
    <div className="space-y-3">
      {/* add row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        <input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Milestone name (e.g., MVP ready)"
          className="md:col-span-3 rounded-md border px-3 py-2"
        />
        <input
          value={draftGoal}
          onChange={(e) => setDraftGoal(e.target.value)}
          placeholder="Goal (short description)"
          className="md:col-span-7 rounded-md border px-3 py-2"
        />
        <div className="md:col-span-2 flex items-center gap-2">
          <div className="relative flex-1">
            <FiCalendar className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={draftEta}
              onChange={(e) => setDraftEta(e.target.value)}
              className="w-full rounded-md border pl-8 pr-2 py-2"
            />
          </div>
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
            title="Add milestone"
          >
            <FiPlus /> Add
          </button>
        </div>
      </div>

      {/* list */}
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">
          No milestones yet. Add one above to build a lightweight roadmap.
        </p>
      ) : (
        <div className="divide-y rounded-md border bg-white">
          {sorted.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3"
            >
              <input
                value={m.name}
                onChange={(e) => patch(m.id, { name: e.target.value })}
                className="md:col-span-3 rounded-md border px-3 py-2"
              />
              <input
                value={m.goal}
                onChange={(e) => patch(m.id, { goal: e.target.value })}
                className="md:col-span-7 rounded-md border px-3 py-2"
              />
              <div className="md:col-span-2 flex items-center gap-2">
                <div className="relative flex-1">
                  <FiCalendar className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={m.eta ?? ""}
                    onChange={(e) =>
                      patch(m.id, { eta: e.target.value || undefined })
                    }
                    className="w-full rounded-md border pl-8 pr-2 py-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"
                  title="Delete milestone"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Milestones;
