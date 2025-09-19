import React, { useMemo, useState } from "react";
import { FiCopy, FiDownload, FiCheck } from "react-icons/fi";
import type { Idea } from "types/ideas";
import { ideaToMarkdown } from "../ideaStorage";

type Props = {
  idea: Idea;
};

const SpecComposer: React.FC<Props> = ({ idea }) => {
  const md = useMemo(() => ideaToMarkdown(idea), [idea]);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // noop — if clipboard fails, user can download
    }
  };

  const onDownload = () => {
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safe = (idea.title || "idea-spec").replace(/[^\w.-]+/g, "_");
    a.href = url;
    a.download = `${safe}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const iceScore =
    (idea.impact ?? 0) + (idea.confidence ?? 0) - (idea.effort ?? 0);

  return (
    <div className="space-y-3">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">
            {idea.ideaType} • {idea.status}
          </div>
          <div className="text-xs text-gray-500">
            ICE: <b>{iceScore}</b> (impact {idea.impact ?? 0} + confidence{" "}
            {idea.confidence ?? 0} − effort {idea.effort ?? 0})
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-gray-800 hover:bg-gray-200"
            title="Copy Markdown"
          >
            {copied ? <FiCheck className="text-green-600" /> : <FiCopy />}
            {copied ? "Copied" : "Copy MD"}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="inline-flex items-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-white hover:bg-gray-900"
            title="Download Markdown"
          >
            <FiDownload /> Download .md
          </button>
        </div>
      </div>

      {/* preview (read-only) */}
      <div className="rounded-lg border bg-white p-3">
        <label className="block text-sm text-gray-600 mb-1">
          Spec (Markdown)
        </label>
        <textarea
          readOnly
          value={md}
          className="w-full h-[48vh] rounded-md border px-3 py-2 font-mono text-sm"
        />
      </div>

      <p className="text-xs text-gray-500">
        Tip: Edit any fields above (problem, approach, value, risks, links…) and
        this spec updates automatically.
      </p>
    </div>
  );
};

export default SpecComposer;
