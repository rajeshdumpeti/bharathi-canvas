// features/ideas/IdeaCaptureBar.tsx
import React, { useState } from "react";
import { useIdeasStore } from "stores/ideas.store";
import type { IdeaType } from "types/ideas";
import { PlusIcon } from "@heroicons/react/24/solid";

// If you already have a ChipInput in components/ui, import it instead
// import ChipInput from 'components/ui/ChipInput';

const IDEA_TYPES: IdeaType[] = [
  "Product",
  "Feature",
  "Tooling",
  "Research",
  "Infra",
];

type Props = {
  /** Optional: open the detail sheet/page once created */
  onAdded?: (ideaId: string) => void;
};

const IdeaCaptureBar: React.FC<Props> = ({ onAdded }) => {
  const addIdea = useIdeasStore((s) => s.addIdea);

  const [title, setTitle] = useState("");
  const [ideaType, setIdeaType] = useState<IdeaType>("Product");
  const [oneLiner, setOneLiner] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagsRaw, setTagsRaw] = useState(""); // used only if you don’t have ChipInput

  const reset = () => {
    setTitle("");
    setIdeaType("Product");
    setOneLiner("");
    setTags([]);
    setTagsRaw("");
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const finalTags = tags.length
      ? tags
      : tagsRaw
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
          .slice(0, 8);

    const created = addIdea({
      title: t.slice(0, 80),
      ideaType,
      tags: finalTags,
      oneLiner: oneLiner.slice(0, 140),
    });

    reset();
    onAdded?.(created.id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-3 md:p-4 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick add idea — e.g., “Prompt runbook generator for tickets”"
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          maxLength={80}
        />

        {/* Type */}
        <select
          value={ideaType}
          onChange={(e) => setIdeaType(e.target.value as IdeaType)}
          className="rounded-md border px-3 py-2 text-sm w-full md:w-40"
        >
          {IDEA_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Tags (use your ChipInput if present) */}
        {/* <ChipInput value={tags} onChange={setTags} placeholder="tags…" /> */}
        <input
          value={tagsRaw}
          onChange={(e) => setTagsRaw(e.target.value)}
          placeholder="tags (comma separated)"
          className="rounded-md border px-3 py-2 text-sm w-full md:w-56"
        />

        {/* One-liner */}
        <input
          value={oneLiner}
          onChange={(e) => setOneLiner(e.target.value)}
          placeholder="1-liner (optional)"
          className="rounded-md border px-3 py-2 text-sm w-full md:w-72"
          maxLength={140}
        />

        {/* Submit */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-semibold hover:bg-blue-700"
          title="Add Idea"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </button>
      </div>
    </form>
  );
};

export default IdeaCaptureBar;
