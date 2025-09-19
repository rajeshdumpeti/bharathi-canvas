import React from "react";
import type { Idea } from "types/innovationLab";
import { TagInput } from "./ui";

export default function TagsSection({
  idea,
  onPatch,
}: {
  idea: Idea;
  onPatch: <K extends keyof Idea>(key: K, value: Idea[K]) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
      <h3 className="mb-2 font-semibold">Tags</h3>
      <TagInput
        value={idea.tags || []}
        onChange={(v) => onPatch("tags", v as any)}
        placeholder="Add a tag and press Enter (e.g., 'education', 'ai', 'mvp')"
      />
    </div>
  );
}
